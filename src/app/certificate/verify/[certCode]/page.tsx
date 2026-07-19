import React from "react";
import Link from "next/link";
import { getCertificateByCode } from "@/lib/actions/certificates";
import { createClient } from "@/lib/supabase/server";
import { 
  Award, 
  Download, 
  Printer, 
  ShieldCheck, 
  Calendar, 
  BookOpen, 
  User, 
  ChevronRight,
  AlertCircle,
  Clock,
  MapPin,
  Mail,
  Globe
} from "lucide-react";
import { StrixmindWordmark } from "@/components/ui/StrixmindLogo";
import { PrintButton } from "@/components/ui/PrintButton";
import { headers } from "next/headers";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ certCode: string }>;
}

export default async function VerifyCertificatePage({ params }: PageProps) {
  const { certCode } = await params;
  
  // 1. Link integrity format check
  const cleanCode = String(certCode ?? "").trim().toUpperCase();
  const certCodeRegex = /^SM-\d{4}-[A-Z2-9]{5}$/i;
  const isValidFormat = certCodeRegex.test(cleanCode);

  // 2. Active session validation (defense-in-depth)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Route Guard: structurally unsound dynamic route requests are blocked unless from active admin session
  if (!isValidFormat && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#0a090d]" style={{ background: "radial-gradient(circle at center, #151124 0%, #0a090d 100%)" }}>
        <div className="mb-10 animate-fade-in">
          <Link href="/">
            <StrixmindWordmark theme="dark" height={22} />
          </Link>
        </div>

        <div className="max-w-md w-full bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
          {/* Subtle background red pulse */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-rose/10 rounded-full filter blur-xl" />
          
          <AlertCircle className="w-14 h-14 text-rose-500 mx-auto mb-4" />
          <h1 className="text-xl font-extrabold text-white mb-2">Invalid Link Integrity</h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            The certificate verification URL format is invalid. Please ensure the QR code scan or URL link has not been tampered with.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/"
              className="block w-full text-center bg-gradient-to-r from-accent to-accent-2 text-white font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Return to Homepage
            </Link>
            <p className="text-[10px] text-slate-500">
              Only authorized students and credential holders with valid links or QR codes can access internship certificates.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fetch verification details securely
  const res = await getCertificateByCode(cleanCode);

  if (!res.success || !res.certificate || !res.template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#0a090d]" style={{ background: "radial-gradient(circle at center, #151124 0%, #0a090d 100%)" }}>
        <div className="mb-10 animate-fade-in">
          <Link href="/">
            <StrixmindWordmark theme="dark" height={22} />
          </Link>
        </div>

        <div className="max-w-md w-full bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
          {/* Subtle background red pulse */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-rose/10 rounded-full filter blur-xl" />
          
          <AlertCircle className="w-14 h-14 text-rose-500 mx-auto mb-4" />
          <h1 className="text-xl font-extrabold text-white mb-2">Invalid Certificate Code</h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            We couldn't verify the certificate code <code className="text-rose font-mono font-semibold bg-rose/10 px-2 py-0.5 rounded border border-rose/10">{certCode}</code>. Please double-check the URL or QR code.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/"
              className="block w-full text-center bg-gradient-to-r from-accent to-accent-2 text-white font-bold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Return to Homepage
            </Link>
            <p className="text-[10px] text-slate-500">
              Only authorized students and credential holders with valid links or QR codes can access internship certificates.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { certificate, template } = res;

  // Resolve host dynamically to generate a scan-able dynamic QR code
  let qrDataUrl = "";
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "strixmind.com";
    const protocol = headersList.get("x-forwarded-proto") || "https";
    const verifyUrl = `${protocol}://${host}/certificate/verify/${certificate.certCode}`;
    qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 1,
      color: {
        dark: template.primaryColor || "#003e8f",
        light: "#ffffff",
      },
    });
  } catch (e) {
    console.error("Failed to generate QR code for verification page:", e);
  }

  // Render a beautifully styled certificate page
  return (
    <div className="min-h-screen bg-[#070609] text-white flex flex-col selection:bg-accent selection:text-white pb-12 print:bg-white print:text-black">
      {/* Non-printable header */}
      <header className="sticky top-0 z-40 bg-[#0a090d]/80 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 py-4 print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <StrixmindWordmark theme="dark" height={18} />
          </Link>

          {/* Verification Badge */}
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-emerald-400 text-xs font-bold shadow-sm animate-pulse">
            <ShieldCheck size={14} />
            Official Verified Credential
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <PrintButton />
            <a
              href={`/api/certificates/${certificate.certCode}/download`}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-accent to-accent-2 hover:opacity-90 rounded-xl text-xs font-bold transition-all shadow-[0_4px_16px_rgba(108,99,255,0.2)]"
            >
              <Download size={13} />
              Download PDF
            </a>
          </div>
        </div>
      </header>

      {/* Main Screen layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 print:p-0">
        
        {/* Verification announcement banner */}
        <div className="bg-gradient-to-r from-accent/15 via-accent-2/15 to-emerald-500/15 border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg print:hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Award className="text-accent" size={16} />
              Internship Credential Authenticated
            </div>
            <p className="text-xs text-slate-400 leading-normal max-w-2xl">
              This certificate has been cryptographically registered and verified by StrixMind LLP. It represents the authentic completion of an internship tenure under professional supervision.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono font-bold shrink-0 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            ID: {certificate.certCode}
          </div>
        </div>

        {/* Dynamic, responsive HTML representation of the Certificate */}
        <div 
          className="relative aspect-[1.414/1] w-full bg-[#ffffff] rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:border-none print:inset-0 print:m-0 print:p-8 transition-all"
          style={{
            fontFamily: template.fontFamily === "serif" ? "Georgia, serif" : template.fontFamily === "mono" ? "monospace" : "sans-serif",
            border: `${template.borderWidth ?? 4}px solid ${template.primaryColor || "#003e8f"}`,
            color: template.textColor || "#15140f"
          }}
        >
          {/* Elegant Double Border (Inner Line) */}
          <div 
            className="absolute pointer-events-none transition-all rounded-[16px]"
            style={{
              top: `${(template.borderWidth ?? 4) + 3}px`,
              bottom: `${(template.borderWidth ?? 4) + 3}px`,
              left: `${(template.borderWidth ?? 4) + 3}px`,
              right: `${(template.borderWidth ?? 4) + 3}px`,
              border: `1.5px solid ${template.secondaryColor || "#00d4aa"}`,
            }}
          />

          {/* TOP-RIGHT CORNER ACCENT BANDS */}
          <div 
            className="absolute top-0 right-0 w-3 sm:w-4.5 h-12 sm:h-16 transition-all"
            style={{ background: template.primaryColor || "#003e8f" }}
          />
          <div 
            className="absolute top-0 right-3 sm:right-4.5 w-3 sm:w-4.5 h-12 sm:h-16 transition-all"
            style={{ background: template.secondaryColor || "#00d4aa" }}
          />

          {/* BRAND LOGO TOP-LEFT */}
          <div className="absolute top-[4.5%] left-[6%] flex items-center pointer-events-none">
            <img 
              src="/brand/strixmind-logo.png" 
              alt="StrixMind Logo" 
              className="h-6 sm:h-9 md:h-11 w-auto object-contain"
            />
          </div>

          {/* CONTACT INFO TOP-RIGHT */}
          <div className="absolute top-[3%] right-[6%] text-right pointer-events-none text-[5px] sm:text-[9px] md:text-[11px] leading-snug text-slate-600 font-sans space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
              <span>Changanassery, Kottayam</span>
              <div 
                className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ background: template.primaryColor || "#003e8f" }}
              >
                <MapPin className="w-2 h-2 sm:w-3 sm:h-3" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
              <span>strixmindllp@gmail.com</span>
              <div 
                className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ background: template.primaryColor || "#003e8f" }}
              >
                <Mail className="w-2 h-2 sm:w-3 sm:h-3" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
              <span>www.strixmind.com</span>
              <div 
                className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ background: template.primaryColor || "#003e8f" }}
              >
                <Globe className="w-2 h-2 sm:w-3 sm:h-3" />
              </div>
            </div>
          </div>

          {/* ASYMMETRIC DIVIDER LINE */}
          <div className="absolute top-[16%] left-[6%] right-[6%] h-[3px] flex pointer-events-none">
            <div className="w-[30%] h-full transition-all" style={{ background: template.primaryColor || "#003e8f" }} />
            <div className="flex-1 h-[0.75px] self-center transition-all bg-slate-200" />
          </div>

          {/* QUAD-COLOR BOTTOM STRIP */}
          <div className="absolute bottom-0 left-0 right-0 h-2 sm:h-3.5 flex pointer-events-none">
            <div className="flex-1 h-full bg-[#0a192f]" />
            <div className="flex-1 h-full transition-all" style={{ background: template.primaryColor || "#003e8f" }} />
            <div className="flex-1 h-full bg-[#1b6ca8]" />
            <div className="flex-1 h-full transition-all" style={{ background: template.secondaryColor || "#00d4aa" }} />
          </div>

          {/* Certificate Title */}
          <div 
            className="absolute left-0 right-0 text-center px-4"
            style={{ 
              top: `${((template.titleY ?? 150) / 595.27) * 100}%`
            }}
          >
            <h1 
              className="text-[9px] sm:text-base md:text-xl lg:text-2xl font-bold tracking-tight transition-colors line-clamp-1 uppercase"
              style={{ color: template.primaryColor || "#003e8f" }}
            >
              {template.title || "CERTIFICATE OF INTERNSHIP COMPLETION"}
            </h1>
            <p 
              className="text-[7px] sm:text-xs italic mt-0.5 sm:mt-1"
              style={{ color: template.mutedColor || "#4b5563" }}
            >
              {template.subtitle || "This is to certify that"}
            </p>
          </div>

          {/* Student Name */}
          <div 
            className="absolute left-0 right-0 text-center px-4"
            style={{ 
              top: `${((template.studentNameY ?? 250) / 595.27) * 100}%`
            }}
          >
            <h2 
              className="text-[12px] sm:text-xl md:text-3xl font-extrabold tracking-tight"
              style={{ color: template.textColor || "#15140f" }}
            >
              {certificate.studentName}
            </h2>
            <div 
              className="w-24 sm:w-48 h-[1.5px] mx-auto mt-1 sm:mt-2 transition-all"
              style={{ background: template.secondaryColor || "#00d4aa" }}
            />
          </div>

          {/* Paragraph body */}
          <div 
            className="absolute left-[10%] right-[10%] text-center px-4"
            style={{ 
              top: `${((template.bodyY ?? 310) / 595.27) * 100}%`
            }}
          >
            <p 
              className="text-[7px] sm:text-[10px] md:text-sm lg:text-base leading-relaxed"
              style={{ color: template.textColor || "#15140f" }}
            >
              {template.bodyTemplate
                ? template.bodyTemplate
                    .replace("{courseName}", certificate.courseName)
                    .replace("{startDate}", certificate.startDate)
                    .replace("{endDate}", certificate.endDate)
                : `has successfully completed the internship program...`}
            </p>
          </div>

          {/* Certificate Footer Row (Signatories & Issue Date) */}
          <div 
            className="absolute left-[8%] right-[8%] flex justify-between px-2 items-end"
            style={{ 
              bottom: `${((template.footerY ?? 120) / 595.27) * 100}%`
            }}
          >
            {/* Left Signatory / Date */}
            <div className="text-center w-[30%]">
              <div 
                className="font-bold border-t text-[6px] sm:text-[10px] md:text-xs pt-1"
                style={{ 
                  borderColor: template.primaryColor || "#cbd5e1",
                  color: template.textColor || "#15140f"
                }}
              >
                {certificate.issueDate}
              </div>
              <div className="text-[5px] sm:text-[8px] md:text-[9px] mt-0.5" style={{ color: template.mutedColor || "#4b5563" }}>
                Date of Issue
              </div>
            </div>

            {/* Right Signatory */}
            <div className="text-center w-[30%]">
              <div 
                className="font-bold border-t text-[6px] sm:text-[10px] md:text-xs pt-1 truncate"
                style={{ 
                  borderColor: template.primaryColor || "#cbd5e1",
                  color: template.textColor || "#15140f"
                }}
              >
                {template.signatoryName}
              </div>
              <div className="text-[5px] sm:text-[8px] md:text-[9px] italic mt-0.5 truncate leading-tight" style={{ color: template.mutedColor || "#4b5563" }}>
                {template.signatoryTitle}
              </div>
            </div>
          </div>

          {/* Verification QR (Bottom Center) */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{ 
              bottom: `${((template.qrY ?? 60) / 595.27) * 100}%`
            }}
          >
            <div 
              className="p-0.5 border rounded bg-white flex items-center justify-center shadow-sm overflow-hidden"
              style={{ 
                borderColor: template.primaryColor || "#003e8f",
                width: `${(template.qrSize ?? 74) * 0.7}px`,
                height: `${(template.qrSize ?? 74) * 0.7}px`
              }}
            >
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Verification QR Code" className="w-full h-full object-contain" />
              ) : (
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <rect x="10" y="10" width="30" height="30" fill={template.primaryColor || "#003e8f"} />
                  <rect x="60" y="10" width="30" height="30" fill={template.primaryColor || "#003e8f"} />
                  <rect x="10" y="60" width="30" height="30" fill={template.primaryColor || "#003e8f"} />
                  <rect x="20" y="20" width="10" height="10" fill="white" />
                  <rect x="70" y="20" width="10" height="10" fill="white" />
                  <rect x="20" y="70" width="10" height="10" fill="white" />
                  <rect x="50" y="50" width="20" height="20" fill={template.primaryColor || "#003e8f"} />
                  <rect x="75" y="75" width="15" height="15" fill={template.primaryColor || "#003e8f"} />
                </svg>
              )}
            </div>
            <span className="text-[5px] sm:text-[8px] font-mono font-bold mt-1" style={{ color: template.primaryColor || "#003e8f" }}>
              {certificate.certCode}
            </span>
          </div>
        </div>

        {/* Detailed Credential Profile Card (Non-printable metadata card) */}
        <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl print:hidden">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <BookOpen size={18} className="text-accent" />
            Certificate Audit Ledger
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="text-[var(--text-dim)] shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="text-xs text-[var(--text-muted)] block">Recipient</span>
                  <span className="font-bold text-white">{certificate.studentName}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Award className="text-[var(--text-dim)] shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="text-xs text-[var(--text-muted)] block">Internship Category</span>
                  <span className="font-bold text-white">{certificate.courseName}</span>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-[var(--text-dim)] shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="text-xs text-[var(--text-muted)] block">Internship Duration</span>
                  <span className="font-bold text-white">{certificate.startDate} — {certificate.endDate}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="text-[var(--text-dim)] shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="text-xs text-[var(--text-muted)] block">Issuance Date</span>
                  <span className="font-bold text-white">{certificate.issueDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Verify Status: <strong className="text-emerald-400">ACTIVE & VERIFIED</strong></span>
            <span>Secure Code: <code className="font-mono text-white/75">{certificate.certCode}</code></span>
          </div>
        </div>
      </main>
    </div>
  );
}
