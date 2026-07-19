import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from "pdf-lib";
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
  
  // A4 Landscape is 841.89 x 595.27 points (roughly 11.7 x 8.3 inches)
  const page = pdfDoc.addPage([841.89, 595.27]);
  const { width, height } = page.getSize();

  // Embed standard Helvetica fonts
  // Embed requested font families dynamically based on configuration
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

  const boldBorderWidth = templateSettings.borderWidth ?? 4;

  // ---- DRAW BRANDED TEMPLATE DESIGN (Matching "my template" layout) ----
  // 1. Plain white A4 background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(1, 1, 1),
  });

  // 1.b Draw primary outer border & secondary inner border matching preview configuration
  const borderMargin = 12;
  page.drawRectangle({
    x: borderMargin,
    y: borderMargin,
    width: width - (borderMargin * 2),
    height: height - (borderMargin * 2),
    borderColor: primaryColor,
    borderWidth: boldBorderWidth,
  });

  const innerBorderMargin = borderMargin + boldBorderWidth + 3;
  page.drawRectangle({
    x: innerBorderMargin,
    y: innerBorderMargin,
    width: width - (innerBorderMargin * 2),
    height: height - (innerBorderMargin * 2),
    borderColor: secondaryColor,
    borderWidth: 1.5,
  });

  // 2. Top-Right Corner Color Blocks (Stripes)
  // Strip 1 (Primary - Rightmost): Dark Blue
  page.drawRectangle({
    x: width - 15,
    y: height - 45,
    width: 15,
    height: 45,
    color: primaryColor,
  });
  // Strip 2 (Secondary - Left of Strip 1): Light/Medium Blue
  page.drawRectangle({
    x: width - 30,
    y: height - 45,
    width: 15,
    height: 45,
    color: secondaryColor,
  });

  // 3. Embed and draw Logo in the Top-Left Header
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

  if (logoImage) {
    page.drawImage(logoImage, {
      x: 60,
      y: height - 80,
      width: 150,
      height: 38,
    });
  } else {
    page.drawText("STRIXMIND", {
      x: 60,
      y: height - 70,
      size: 20,
      font: fontBold,
      color: primaryColor,
    });
  }

  // 4. Draw Right-Aligned Contact Information in Top-Right
  const contactLines = [
    "Changanassery,Kottayam",
    "strixmindllp@gmail.com",
    "www.strixmind.com"
  ];
  
  let contactY = height - 42;
  for (let i = 0; i < contactLines.length; i++) {
    const line = contactLines[i];
    const lineWidth = fontRegular.widthOfTextAtSize(line, 8);
    const textX = width - 72 - lineWidth; // Right align text to width - 72
    
    // Draw text
    page.drawText(line, {
      x: textX,
      y: contactY,
      size: 8,
      font: fontRegular,
      color: textColor,
    });

    // Draw solid blue circle for the icon background
    const circleX = width - 58;
    const circleY = contactY + 3;
    page.drawCircle({
      x: circleX,
      y: circleY,
      size: 5,
      color: primaryColor,
    });

    // Draw a small white inner indicator to represent the icon!
    if (i === 0) { // Location: draw a small pinhead or white dot
      page.drawCircle({
        x: circleX,
        y: circleY + 1,
        size: 1.5,
        color: rgb(1, 1, 1),
      });
      page.drawLine({
        start: { x: circleX, y: circleY - 2 },
        end: { x: circleX, y: circleY + 1 },
        thickness: 1,
        color: rgb(1, 1, 1),
      });
    } else if (i === 1) { // Email: draw a tiny envelope
      page.drawRectangle({
        x: circleX - 2.5,
        y: circleY - 1.8,
        width: 5,
        height: 3.5,
        color: rgb(1, 1, 1),
      });
    } else { // Web: draw a globe
      page.drawCircle({
        x: circleX,
        y: circleY,
        size: 2,
        color: rgb(1, 1, 1),
      });
    }

    contactY -= 15;
  }

  // 5. Draw Horizontal Divider Line (thick primary line on left, thin gray on right)
  const dividerY = height - 95;
  // Left thick bar
  page.drawLine({
    start: { x: 60, y: dividerY },
    end: { x: 300, y: dividerY },
    thickness: 3,
    color: primaryColor,
  });
  // Right thin bar
  page.drawLine({
    start: { x: 300, y: dividerY },
    end: { x: width - 50, y: dividerY },
    thickness: 0.75,
    color: rgb(0.85, 0.85, 0.85),
  });

  // 6. Draw 4-Segment Footer blocks at the very bottom
  const footerHeight = 15;
  const colWidth = width / 4;
  // Segment 1 (Deep Navy): #0a192f
  page.drawRectangle({
    x: 0,
    y: 0,
    width: colWidth,
    height: footerHeight,
    color: hexToRgb("#0a192f"),
  });
  // Segment 2 (Primary Blue)
  page.drawRectangle({
    x: colWidth,
    y: 0,
    width: colWidth,
    height: footerHeight,
    color: primaryColor,
  });
  // Segment 3 (Medium Blue): #1b6ca8
  page.drawRectangle({
    x: colWidth * 2,
    y: 0,
    width: colWidth,
    height: footerHeight,
    color: hexToRgb("#1b6ca8"),
  });
  // Segment 4 (Light Blue)
  page.drawRectangle({
    x: colWidth * 3,
    y: 0,
    width: colWidth,
    height: footerHeight,
    color: secondaryColor,
  });

  // ---- TITLE -----------------------------------------------------------
  const titleText = templateSettings.title || "CERTIFICATE OF INTERNSHIP COMPLETION";
  const titleY = height - (templateSettings.titleY ?? 150);
  page.drawText(titleText, {
    x: centerX(fontBold, 22, titleText, width),
    y: titleY,
    size: 22,
    font: fontBold,
    color: primaryColor,
  });

  // Subtitle
  const subtitleText = templateSettings.subtitle || "This is to certify that";
  const subtitleY = height - (templateSettings.subtitleY ?? 200);
  page.drawText(subtitleText, {
    x: centerX(fontItalic, 14, subtitleText, width),
    y: subtitleY,
    size: 14,
    font: fontItalic,
    color: mutedColor,
  });

  // ---- STUDENT NAME ----------------------------------------------------
  const studentNameY = height - (templateSettings.studentNameY ?? 250);
  page.drawText(studentName, {
    x: centerX(fontBold, 30, studentName, width),
    y: studentNameY,
    size: 30,
    font: fontBold,
    color: textColor,
  });

  // Underline decorative element below student name
  const nameWidth = fontBold.widthOfTextAtSize(studentName, 30);
  page.drawLine({
    start: { x: (width - nameWidth) / 2, y: studentNameY - 12 },
    end: { x: (width + nameWidth) / 2, y: studentNameY - 12 },
    thickness: 1.5,
    color: secondaryColor,
  });

  // ---- BODY TEXT -------------------------------------------------------
  // Replace variables in the template body
  const bodyTextRaw = templateSettings.bodyTemplate || "";
  const bodyTextCompiled = bodyTextRaw
    .replace("{courseName}", courseName)
    .replace("{startDate}", startDate)
    .replace("{endDate}", endDate);

  // Split text into chunks that fit beautifully in the page
  const words = bodyTextCompiled.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = fontRegular.widthOfTextAtSize(testLine, 13);
    if (testWidth < width - 200) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  let bodyY = height - (templateSettings.bodyY ?? 310);
  for (const line of lines) {
    page.drawText(line, {
      x: centerX(fontRegular, 13, line, width),
      y: bodyY,
      size: 13,
      font: fontRegular,
      color: textColor,
    });
    bodyY -= 22;
  }

  // ---- SIGNATURES AND ISSUANCE DATES -----------------------------------
  const footerY = templateSettings.footerY ?? 120;

  // Left Signatory / Issuance Date
  page.drawLine({
    start: { x: 100, y: footerY + 20 },
    end: { x: 260, y: footerY + 20 },
    thickness: 1,
    color: primaryColor,
  });
  
  page.drawText(issueDate, {
    x: 100 + centerX(fontBold, 11, issueDate, 160),
    y: footerY + 28,
    size: 11,
    font: fontBold,
    color: textColor,
  });

  page.drawText("Date of Issue", {
    x: 100 + centerX(fontRegular, 10, "Date of Issue", 160),
    y: footerY + 4,
    size: 10,
    font: fontRegular,
    color: mutedColor,
  });

  // Right Signatory
  page.drawLine({
    start: { x: width - 260, y: footerY + 20 },
    end: { x: width - 100, y: footerY + 20 },
    thickness: 1,
    color: primaryColor,
  });

  const signatoryName = templateSettings.signatoryName || "Antony Sebastian";
  page.drawText(signatoryName, {
    x: width - 260 + centerX(fontBold, 11, signatoryName, 160),
    y: footerY + 28,
    size: 11,
    font: fontBold,
    color: textColor,
  });

  const signatoryTitle = templateSettings.signatoryTitle || "Founder, StrixMind LLP";
  page.drawText(signatoryTitle, {
    x: width - 260 + centerX(fontItalic, 9, signatoryTitle, 160),
    y: footerY + 4,
    size: 9,
    font: fontItalic,
    color: mutedColor,
  });

  // ---- QR CODE & VERIFICATION SYSTEM (Centered at bottom) ------------
  const qrSize = templateSettings.qrSize ?? 74;
  const qrX = (width - qrSize) / 2;
  const qrY = templateSettings.qrY ?? 60;

  const verifyUrl = `${verifyBaseUrl}/${certCode}`;
  
  // Generate QR code data URL using qrcode library
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    color: {
      dark: templateSettings.primaryColor || "#003e8f",
      light: "#ffffff",
    },
  });

  const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await pdfDoc.embedPng(qrImageBytes);

  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // Verification metadata text below QR code
  const scanText = "Scan to verify certificate authenticity";
  page.drawText(scanText, {
    x: centerX(fontRegular, 8, scanText, width),
    y: qrY - 12,
    size: 8,
    font: fontRegular,
    color: mutedColor,
  });

  const codeLabel = `Verification ID: ${certCode}`;
  page.drawText(codeLabel, {
    x: centerX(fontBold, 8, codeLabel, width),
    y: qrY - 24,
    size: 8,
    font: fontBold,
    color: primaryColor,
  });

  // Return the PDF as Uint8Array
  return await pdfDoc.save();
}
