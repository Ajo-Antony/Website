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

        {/* Dynamic, responsive HTML representation of the Certificate (Portrait Letterhead Style) */}
        <div 
          className="relative aspect-[1/1.414] w-full bg-[#ffffff] rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:border-none print:inset-0 print:m-0 print:p-12 transition-all"
          style={{
            fontFamily: template.fontFamily === "serif" ? "Georgia, serif" : template.fontFamily === "mono" ? "monospace" : "sans-serif",
            color: template.textColor || "#15140f"
          }}
        >
          {/* BRAND LOGO TOP-LEFT */}
          <div className="absolute top-[4.5%] left-[8%] flex items-center pointer-events-none">
            <img 
              src="/brand/strixmind-logo.png" 
              alt="StrixMind Logo" 
              className="h-7 sm:h-9 md:h-12 w-auto object-contain"
            />
          </div>

          {/* CONTACT INFO TOP-RIGHT */}
          <div className="absolute top-[3%] right-[8%] text-right pointer-events-none text-[5px] sm:text-[8px] md:text-[10px] leading-snug text-slate-600 font-sans space-y-0.5 sm:space-y-1">
            <div className="flex items-center justify-end gap-1.5">
              <span>Changanassery, Kottayam</span>
              <div className="w-4 h-4 rounded-full flex items-center justify-center border" style={{ borderColor: template.primaryColor || "#003e8f" }}>
                <MapPin className="w-2 h-2 sm:w-2.5 sm:h-2.5" style={{ color: template.primaryColor || "#003e8f" }} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <span>strixmindllp@gmail.com</span>
              <div className="w-4 h-4 rounded-full flex items-center justify-center border" style={{ borderColor: template.primaryColor || "#003e8f" }}>
                <Mail className="w-2 h-2 sm:w-2.5 sm:h-2.5" style={{ color: template.primaryColor || "#003e8f" }} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <span>www.strixmind.com</span>
              <div className="w-4 h-4 rounded-full flex items-center justify-center border" style={{ borderColor: template.primaryColor || "#003e8f" }}>
                <Globe className="w-2 h-2 sm:w-2.5 sm:h-2.5" style={{ color: template.primaryColor || "#003e8f" }} />
              </div>
            </div>
          </div>

          {/* ASYMMETRIC DIVIDER LINE */}
          <div className="absolute top-[12.5%] left-[8%] right-[8%] h-[3.5px] flex pointer-events-none">
            <div className="w-[30%] h-full transition-all" style={{ background: template.primaryColor || "#003e8f" }} />
            <div className="flex-1 h-[0.75px] self-center transition-all bg-[#121016]" />
          </div>

          {/* SUBJECT / DOCUMENT TITLE (Centered below header) */}
          <div className="absolute top-[16.5%] left-0 right-0 text-center px-8">
            <h1 
              className="text-[8px] sm:text-[13px] md:text-[16px] lg:text-[18px] font-extrabold tracking-tight transition-colors uppercase"
              style={{ color: template.primaryColor || "#003e8f" }}
            >
              {template.title || "CERTIFICATE OF INTERNSHIP COMPLETION"}
            </h1>
            {template.subtitle && (
              <p 
                className="text-[5px] sm:text-[9px] md:text-[11px] italic mt-0.5"
                style={{ color: template.mutedColor || "#4b5563" }}
              >
                {template.subtitle}
              </p>
            )}
          </div>

          {/* LETTER RECIPIENT & DATE HEADER */}
          <div className="absolute top-[22%] left-[8%] right-[8%] flex justify-between items-end pointer-events-none">
            <div>
              <span className="text-[6px] sm:text-[10px] md:text-xs font-extrabold" style={{ color: template.textColor || "#15140f" }}>
                To: {certificate.studentName}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[6px] sm:text-[10px] md:text-xs font-extrabold" style={{ color: template.textColor || "#15140f" }}>
                {certificate.issueDate || "25 January, 2029"}
              </span>
            </div>
          </div>

          {/* SALUTATION */}
          <div className="absolute top-[28%] left-[8%] right-[8%] pointer-events-none">
            <p className="text-[6px] sm:text-[10px] md:text-xs font-extrabold" style={{ color: template.textColor || "#15140f" }}>
              Dear {certificate.studentName},
            </p>
          </div>

          {/* LETTER BODY TEXT (Supports multiple paragraphs styled as blocks) */}
          <div className="absolute top-[32.5%] left-[8%] right-[8%] pointer-events-none text-justify space-y-2 sm:space-y-4">
            {(template.bodyTemplate || "")
              .replace("{courseName}", certificate.courseName)
              .replace("{startDate}", certificate.startDate)
              .replace("{endDate}", certificate.endDate)
              .split("\n")
              .map((paragraph: string, idx: number) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                return (
                  <p 
                    key={idx}
                    className="text-[5.5px] sm:text-[10px] md:text-xs lg:text-[13px] leading-relaxed"
                    style={{ color: template.textColor || "#15140f" }}
                  >
                    {trimmed}
                  </p>
                );
              })}
          </div>

          {/* REGARDS & SIGNATORY (Placed below body text using custom margins or bottom anchor) */}
          <div className="absolute bottom-[20%] left-[8%] pointer-events-none space-y-1 sm:space-y-2">
            <p className="text-[6px] sm:text-[10px] md:text-xs font-extrabold" style={{ color: template.textColor || "#15140f" }}>
              Regards,
            </p>
            <div className="pt-2 sm:pt-4">
              <p className="text-[6px] sm:text-[10px] md:text-xs font-extrabold" style={{ color: template.textColor || "#15140f" }}>
                {template.signatoryName || "Antony Sebastian"}
              </p>
              <p className="text-[5px] sm:text-[8px] md:text-[9.5px] italic" style={{ color: template.mutedColor || "#4b5563" }}>
                {template.signatoryTitle || "Founder, StrixMind LLP"}
              </p>
            </div>
          </div>

          {/* VERIFICATION QR & ID DIGITAL STAMP (Bottom-Right) */}
          <div className="absolute bottom-[6%] right-[8%] flex flex-col items-center">
            <div 
              className="p-0.5 border bg-white flex items-center justify-center shadow-sm overflow-hidden"
              style={{ 
                borderColor: template.primaryColor || "#003e8f",
                width: "48px",
                height: "48px"
              }}
            >
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Verification QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-slate-100" />
              )}
            </div>
            <span className="text-[4px] sm:text-[7.5px] font-mono font-bold mt-1" style={{ color: template.primaryColor || "#003e8f" }}>
              Scan to verify
            </span>
            <span className="text-[4px] sm:text-[7.5px] font-mono font-extrabold" style={{ color: template.primaryColor || "#003e8f" }}>
              ID: {certificate.certCode}
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
