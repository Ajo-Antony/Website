import { NextRequest, NextResponse } from "next/server";
import { getCertificateByCode } from "@/lib/actions/certificates";
import { generateCertificatePdf } from "@/lib/generateCertificate";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ certCode: string }> }
) {
  try {
    const { certCode } = await params;
    
    if (!certCode) {
      return NextResponse.json({ error: "Certificate verification code is required" }, { status: 400 });
    }

    // Retrieve specific student certificate + custom template branding securely
    const res = await getCertificateByCode(certCode);
    if (!res.success || !res.certificate || !res.template) {
      return NextResponse.json({ error: res.error || "Certificate not found" }, { status: 404 });
    }

    const { certificate, template } = res;
    
    // Resolve host URL dynamically to create absolute QR verification link
    const host = req.headers.get("host") || "strixmind.com";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const verifyBaseUrl = `${protocol}://${host}/certificate/verify`;

    // Compile dynamic PDF using our premium canvas template engine
    const pdfBytes = await generateCertificatePdf({
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
      issueDate: certificate.issueDate,
      certCode: certificate.certCode,
      verifyBaseUrl,
      templateSettings: template,
    });

    // Create readable stream / response representing PDF attachment
    const cleanFileName = `Internship_Certificate_${certificate.studentName.replace(/\s+/g, "_")}.pdf`;
    
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cleanFileName}"`,
        "Content-Length": pdfBytes.length.toString(),
      },
    });

  } catch (error) {
    console.error("Failed to generate PDF download:", error);
    return NextResponse.json({ error: "Failed to generate certificate PDF" }, { status: 500 });
  }
}
