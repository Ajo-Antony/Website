import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";
import QRCode from "qrcode";
import type { CertificateTemplate } from "@/lib/actions/certificates";
import fs from "fs";
import path from "path";

interface GenerateParams {
  studentName: string;
  courseName: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  certCode: string;
  verifyBaseUrl?: string;
  templateSettings: CertificateTemplate;
}

// Convert hex string to pdf-lib rgb color
function hexToRgb(hex: string) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255 || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255 || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255 || 0;
  return rgb(r, g, b);
}

function centerX(font: PDFFont, size: number, text: string, pageWidth: number): number {
  const textWidth = font.widthOfTextAtSize(text, size);
  return (pageWidth - textWidth) / 2;
}

export async function generateCertificatePdf({
  studentName,
  courseName,
  startDate,
  endDate,
  issueDate,
  certCode,
  verifyBaseUrl = "https://strixmind.com/certificate/verify",
  templateSettings,
}: GenerateParams): Promise<Uint8Array> {
  // Create a fresh PDF document
  const pdfDoc = await PDFDocument.create();
  
  // A4 Portrait is 595.27 x 841.89 points
  const page = pdfDoc.addPage([595.27, 841.89]);
  const { width, height } = page.getSize();

  // Embed standard Helvetica fonts
  const fontFam = templateSettings.fontFamily || "sans";
  let regularFontName = StandardFonts.Helvetica;
  let boldFontName = StandardFonts.HelveticaBold;
  let italicFontName = StandardFonts.HelveticaOblique;

  if (fontFam === "serif") {
    regularFontName = StandardFonts.TimesRoman;
    boldFontName = StandardFonts.TimesRomanBold;
    italicFontName = StandardFonts.TimesRomanItalic;
  } else if (fontFam === "mono") {
    regularFontName = StandardFonts.Courier;
    boldFontName = StandardFonts.CourierBold;
    italicFontName = StandardFonts.CourierOblique;
  }

  const fontRegular = await pdfDoc.embedFont(regularFontName);
  const fontBold = await pdfDoc.embedFont(boldFontName);
  const fontItalic = await pdfDoc.embedFont(italicFontName);

  const primaryColor = hexToRgb(templateSettings.primaryColor || "#003e8f");
  const secondaryColor = hexToRgb(templateSettings.secondaryColor || "#00d4aa");
  const textColor = hexToRgb(templateSettings.textColor || "#15140f");
  const mutedColor = hexToRgb(templateSettings.mutedColor || "#4b5563");

  // Plain white background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(1, 1, 1),
  });

  // Embed and draw Logo in the Top-Left Header
  let logoImage;
  try {
    const logoPath = path.join(process.cwd(), "public", "brand", "strixmind-logo.png");
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      logoImage = await pdfDoc.embedPng(logoBytes);
    }
  } catch (e) {
    console.error("Failed to load logo in PDF generator:", e);
  }

  const leftMargin = 50;
  const rightMargin = 50;
  const contentWidth = width - leftMargin - rightMargin;

  if (logoImage) {
    // Aligned to leftMargin
    page.drawImage(logoImage, {
      x: leftMargin,
      y: height - 75,
      width: 140,
      height: 35,
    });
  } else {
    page.drawText("STRIXMIND", {
      x: leftMargin,
      y: height - 65,
      size: 18,
      font: fontBold,
      color: primaryColor,
    });
  }

  // Draw Right-Aligned Contact Information in Top-Right
  const contactLines = [
    "Changanassery,Kottayam",
    "strixmindllp@gmail.com",
    "www.strixmind.com"
  ];
  
  let contactY = height - 45;
  for (let i = 0; i < contactLines.length; i++) {
    const line = contactLines[i];
    const lineWidth = fontRegular.widthOfTextAtSize(line, 8);
    const textX = width - rightMargin - 18 - lineWidth; // Align to right margin minus space for icon
    
    // Draw text
    page.drawText(line, {
      x: textX,
      y: contactY,
      size: 8,
      font: fontRegular,
      color: textColor,
    });

    // Draw outlined circle for the icon background (matches the requested image design)
    const circleX = width - rightMargin - 6;
    const circleY = contactY + 3;
    
    page.drawCircle({
      x: circleX,
      y: circleY,
      size: 5.5,
      borderColor: primaryColor,
      borderWidth: 1.2,
    });

    // Draw tiny inner white dots or lines to act as clean abstract glyphs
    if (i === 0) { // Pin dot
      page.drawCircle({
        x: circleX,
        y: circleY,
        size: 1.5,
        color: primaryColor,
      });
    } else if (i === 1) { // Mail dot
      page.drawCircle({
        x: circleX,
        y: circleY,
        size: 1.5,
        color: primaryColor,
      });
    } else { // Web dot
      page.drawCircle({
        x: circleX,
        y: circleY,
        size: 1.5,
        color: primaryColor,
      });
    }

    contactY -= 14;
  }

  // Draw Divider Line (thick primary line on left, thin dark gray on right)
  const dividerY = height - 90;
  
  // Left thick bar (covers logo width - under the logo, thick like the image)
  page.drawLine({
    start: { x: leftMargin, y: dividerY },
    end: { x: leftMargin + 150, y: dividerY },
    thickness: 3.5,
    color: primaryColor,
  });
  
  // Right thin bar (extending to the right edge)
  page.drawLine({
    start: { x: leftMargin + 150, y: dividerY },
    end: { x: width - rightMargin, y: dividerY },
    thickness: 0.75,
    color: rgb(0.12, 0.16, 0.22), // Dark charcoal/black
  });

  // ---- DOCUMENT TITLE (Centered subject/title, highly professional) ----
  const titleText = templateSettings.title || "CERTIFICATE OF INTERNSHIP COMPLETION";
  const titleY = height - 135;
  page.drawText(titleText, {
    x: centerX(fontBold, 13, titleText, width),
    y: titleY,
    size: 13,
    font: fontBold,
    color: primaryColor,
  });

  // Subtitle (if present)
  if (templateSettings.subtitle) {
    page.drawText(templateSettings.subtitle, {
      x: centerX(fontItalic, 9.5, templateSettings.subtitle, width),
      y: titleY - 14,
      size: 9.5,
      font: fontItalic,
      color: mutedColor,
    });
  }

  // ---- LETTER HEADER (To: & Date) ----
  const infoY = height - 180;
  
  // "To: studentName"
  page.drawText(`To: ${studentName}`, {
    x: leftMargin,
    y: infoY,
    size: 11,
    font: fontBold,
    color: textColor,
  });

  // Date (right-aligned)
  const formattedDate = issueDate || "25 January, 2029";
  const dateWidth = fontRegular.widthOfTextAtSize(formattedDate, 11);
  page.drawText(formattedDate, {
    x: width - rightMargin - dateWidth,
    y: infoY - 12,
    size: 11,
    font: fontBold,
    color: textColor,
  });

  // ---- SALUTATION ----
  const salutationY = height - 235;
  page.drawText(`Dear ${studentName},`, {
    x: leftMargin,
    y: salutationY,
    size: 11,
    font: fontBold,
    color: textColor,
  });

  // ---- BODY TEXT ----
  const bodyTextRaw = templateSettings.bodyTemplate || "";
  const bodyTextCompiled = bodyTextRaw
    .replace("{courseName}", courseName)
    .replace("{startDate}", startDate)
    .replace("{endDate}", endDate);

  // Split compiled body text by newlines to support multi-paragraph formatting perfectly!
  const paragraphs = bodyTextCompiled.split("\n");
  let currentY = height - 265;
  
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;
    
    const words = trimmed.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = fontRegular.widthOfTextAtSize(testLine, 11);
      if (testWidth < contentWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    
    for (const line of lines) {
      page.drawText(line, {
        x: leftMargin,
        y: currentY,
        size: 11,
        font: fontRegular,
        color: textColor,
      });
      currentY -= 17; // Line spacing
    }
    currentY -= 12; // Paragraph gap
  }

  // ---- REGARDS & SIGNATURES ----
  currentY -= 10;
  
  // Prevent falling off the page by guarding currentY
  if (currentY < 180) {
    currentY = 180;
  }

  page.drawText("Regards,", {
    x: leftMargin,
    y: currentY,
    size: 11,
    font: fontBold,
    color: textColor,
  });

  currentY -= 30; // Spacing for signature

  const signatoryName = templateSettings.signatoryName || "Antony Sebastian";
  page.drawText(signatoryName, {
    x: leftMargin,
    y: currentY,
    size: 11,
    font: fontBold,
    color: textColor,
  });

  currentY -= 13;
  const signatoryTitle = templateSettings.signatoryTitle || "Founder, StrixMind LLP";
  page.drawText(signatoryTitle, {
    x: leftMargin,
    y: currentY,
    size: 9.5,
    font: fontItalic,
    color: mutedColor,
  });

  // ---- QR CODE & VERIFICATION DIGITAL STAMP (Bottom-Right, extremely professional) ----
  const qrSize = 65;
  const qrX = width - rightMargin - qrSize;
  const qrY = 55;

  const verifyUrl = `${verifyBaseUrl}/${certCode}`;
  
  // Generate QR code data URL
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    color: {
      dark: templateSettings.primaryColor || "#003e8f",
      light: "#ffffff",
    },
  });

  const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await pdfDoc.embedPng(qrImageBytes);

  // Draw delicate border around QR code to act as a security seal
  page.drawRectangle({
    x: qrX - 4,
    y: qrY - 4,
    width: qrSize + 8,
    height: qrSize + 8,
    borderColor: primaryColor,
    borderWidth: 0.75,
    color: rgb(1, 1, 1),
  });

  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // Verification metadata aligned neatly next to or below the QR Code
  const scanText = "Scan to verify authenticity";
  const scanTextWidth = fontRegular.widthOfTextAtSize(scanText, 7.5);
  page.drawText(scanText, {
    x: qrX + (qrSize / 2) - (scanTextWidth / 2),
    y: qrY - 11,
    size: 7.5,
    font: fontRegular,
    color: mutedColor,
  });

  const codeLabel = `Verification ID: ${certCode}`;
  const codeLabelWidth = fontBold.widthOfTextAtSize(codeLabel, 7.5);
  page.drawText(codeLabel, {
    x: qrX + (qrSize / 2) - (codeLabelWidth / 2),
    y: qrY - 21,
    size: 7.5,
    font: fontBold,
    color: primaryColor,
  });

  // Return the PDF as Uint8Array
  return await pdfDoc.save();
}
