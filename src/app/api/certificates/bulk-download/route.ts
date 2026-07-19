import { NextRequest, NextResponse } from "next/server";
import { getCertificateStudents, getCertificateTemplate } from "@/lib/actions/certificates";
import { generateCertificatePdf } from "@/lib/generateCertificate";
import QRCode from "qrcode";
import JSZip from "jszip";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { certCodes } = await req.json();

    if (!certCodes || !Array.isArray(certCodes) || certCodes.length === 0) {
      return NextResponse.json({ error: "No student certificate codes selected for bulk export." }, { status: 400 });
    }

    const [students, template] = await Promise.all([
      getCertificateStudents(),
      getCertificateTemplate(),
    ]);

    // Filter students selected
    const selectedStudents = students.filter((s) => certCodes.includes(s.certCode));

    if (selectedStudents.length === 0) {
      return NextResponse.json({ error: "None of the selected certificate codes match any stored student records." }, { status: 404 });
    }

    const host = req.headers.get("host") || "strixmind.com";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const verifyBaseUrl = `${protocol}://${host}/certificate/verify`;

    // Initialize JSZip instance
    const zip = new JSZip();

    // Create sub-folders for structure
    const pdfsFolder = zip.folder("certificates");
    const qrsFolder = zip.folder("verification_qrs");

    for (const student of selectedStudents) {
      // 1. Generate PDF Certificate
      const pdfBytes = await generateCertificatePdf({
        studentName: student.studentName,
        courseName: student.courseName,
        startDate: student.startDate,
        endDate: student.endDate,
        issueDate: student.issueDate,
        certCode: student.certCode,
        verifyBaseUrl,
        templateSettings: template,
      });

      const safeName = student.studentName.trim().replace(/\s+/g, "_");
      const pdfFileName = `${safeName}_Certificate_${student.certCode}.pdf`;

      // Add PDF to zip
      if (pdfsFolder) {
        pdfsFolder.file(pdfFileName, Buffer.from(pdfBytes));
      }

      // 2. Generate high-resolution standalone QR code PNG
      const verifyUrl = `${verifyBaseUrl}/${student.certCode}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        margin: 1,
        width: 600, // high-resolution standalone export
        color: {
          dark: template.primaryColor || "#003e8f",
          light: "#ffffff",
        },
      });

      const qrBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
      const qrFileName = `QR_Code_${safeName}_${student.certCode}.png`;

      // Add QR image to zip
      if (qrsFolder) {
        qrsFolder.file(qrFileName, qrBytes);
      }
    }

    // Generate zip file as native Web Blob
    const zipBlob = await zip.generateAsync({ type: "blob" });

    return new NextResponse(zipBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="StrixMind_Certificates_Export_${new Date().toISOString().slice(0, 10)}.zip"`,
        "Content-Length": zipBlob.size.toString(),
      },
    });

  } catch (error) {
    console.error("Bulk certificate generation failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate bulk exports." }, { status: 500 });
  }
}
