import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from "pdf-lib";
import QRCode from "qrcode";
import type { CertificateTemplate } from "@/lib/actions/certificates";

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
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const primaryColor = hexToRgb(templateSettings.primaryColor || "#003e8f");
  const secondaryColor = hexToRgb(templateSettings.secondaryColor || "#00d4aa");
  const textColor = hexToRgb(templateSettings.textColor || "#15140f");
  const mutedColor = hexToRgb(templateSettings.mutedColor || "#4b5563");

  // ---- DRAW PREMIUM BACKGROUND & BORDERS DYNAMICALLY --------------------
  // Subtle cream/white page background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.98, 0.98, 0.97),
  });

  // Outer thin accent border (Secondary Color)
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: secondaryColor,
    borderWidth: 1.5,
  });

  // Inner bold border (Primary Color)
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: primaryColor,
    borderWidth: 4,
  });

  // Dual inner thin border
  page.drawRectangle({
    x: 38,
    y: 38,
    width: width - 76,
    height: height - 76,
    borderColor: secondaryColor,
    borderWidth: 1,
  });

  // Decorative corner accent shapes (Classic luxury certificate style)
  const drawCornerDecoration = (p: PDFPage, cx: number, cy: number) => {
    // Elegant diamond or square accents at corners
    p.drawRectangle({
      x: cx - 10,
      y: cy - 10,
      width: 20,
      height: 20,
      color: primaryColor,
    });
    p.drawRectangle({
      x: cx - 6,
      y: cy - 6,
      width: 12,
      height: 12,
      color: secondaryColor,
    });
  };

  drawCornerDecoration(page, 34, 34);
  drawCornerDecoration(page, width - 34, 34);
  drawCornerDecoration(page, 34, height - 34);
  drawCornerDecoration(page, width - 34, height - 34);

  // Top header branding / logo watermark
  const brandName = "STRIXMIND AI OPERATING SYSTEM";
  page.drawText(brandName, {
    x: centerX(fontBold, 10, brandName, width),
    y: height - 80,
    size: 10,
    font: fontBold,
    color: primaryColor,
  });

  // ---- TITLE -----------------------------------------------------------
  const titleText = templateSettings.title || "CERTIFICATE OF INTERNSHIP COMPLETION";
  page.drawText(titleText, {
    x: centerX(fontBold, 22, titleText, width),
    y: height - 150,
    size: 22,
    font: fontBold,
    color: primaryColor,
  });

  // Subtitle
  const subtitleText = templateSettings.subtitle || "This is to certify that";
  page.drawText(subtitleText, {
    x: centerX(fontItalic, 14, subtitleText, width),
    y: height - 200,
    size: 14,
    font: fontItalic,
    color: mutedColor,
  });

  // ---- STUDENT NAME ----------------------------------------------------
  page.drawText(studentName, {
    x: centerX(fontBold, 30, studentName, width),
    y: height - 250,
    size: 30,
    font: fontBold,
    color: textColor,
  });

  // Underline decorative element below student name
  const nameWidth = fontBold.widthOfTextAtSize(studentName, 30);
  page.drawLine({
    start: { x: (width - nameWidth) / 2, y: height - 262 },
    end: { x: (width + nameWidth) / 2, y: height - 262 },
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

  let bodyY = height - 310;
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
  const footerY = 120;

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
  const qrSize = 74;
  const qrX = (width - qrSize) / 2;
  const qrY = 60;

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
