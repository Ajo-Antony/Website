import React from "react";
import Link from "next/link";
import { getCertificateByCode } from "@/lib/actions/certificates";
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
  Clock
} from "lucide-react";
import { StrixmindWordmark } from "@/components/ui/StrixmindLogo";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ certCode: string }>;
}

export default async function VerifyCertificatePage({ params }: PageProps) {
  const { certCode } = await params;
  const res = await getCertificateByCode(certCode);

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
            <button
              onClick={`window.print()` as any}
              className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold transition-all"
            >
              <Printer size={13} />
              Print
            </button>
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
        <div className="relative aspect-[1.414/1] w-full bg-[#FAF9F6] rounded-3xl p-6 sm:p-10 md:p-16 text-[#15140f] border border-slate-300 shadow-2xl overflow-hidden print:shadow-none print:border-none print:inset-0 print:m-0 print:p-8">
          
          {/* Borders mirroring generateCertificatePdf */}
          <div 
            className="absolute inset-2 sm:inset-3 pointer-events-none transition-all"
            style={{ borderColor: template.secondaryColor || "#00d4aa", borderWidth: "1.5px", borderStyle: "solid" }}
          />
          <div 
            className="absolute inset-3.5 sm:inset-5 pointer-events-none transition-all"
            style={{ borderColor: template.primaryColor || "#003e8f", borderWidth: "4px", borderStyle: "solid" }}
          />
          <div 
            className="absolute inset-5 sm:inset-7 pointer-events-none transition-all"
            style={{ borderColor: template.secondaryColor || "#00d4aa", borderWidth: "1px", borderStyle: "solid" }}
          />

          {/* Corner Diamonds */}
          {[
            "top-4 left-4 sm:top-5 sm:left-5",
            "top-4 right-4 sm:top-5 sm:right-5",
            "bottom-4 left-4 sm:bottom-5 sm:left-5",
            "bottom-4 right-4 sm:bottom-5 sm:right-5"
          ].map((pos) => (
            <div key={pos} className={`absolute ${pos} w-6 h-6 flex items-center justify-center`}>
              <div 
                className="w-4 h-4 rotate-45"
                style={{ background: template.primaryColor || "#003e8f" }}
              />
            </div>
          ))}

          {/* Watermark brand */}
          <div className="text-center mt-2 sm:mt-4">
            <span 
              className="text-[9px] sm:text-xs font-bold tracking-widest block transition-colors"
              style={{ color: template.primaryColor || "#003e8f" }}
            >
              STRIXMIND AI OPERATING SYSTEM
            </span>
          </div>

          {/* Certificate Title */}
          <div className="text-center mt-6 sm:mt-12 md:mt-14">
            <h1 
              className="text-sm sm:text-2xl md:text-3xl font-extrabold tracking-tight transition-colors line-clamp-2 uppercase"
              style={{ color: template.primaryColor || "#003e8f" }}
            >
              {template.title || "CERTIFICATE OF INTERNSHIP COMPLETION"}
            </h1>
            <p 
              className="text-[10px] sm:text-sm italic mt-1 sm:mt-2"
              style={{ color: template.mutedColor || "#4b5563" }}
            >
              {template.subtitle || "This is to certify that"}
            </p>
          </div>

          {/* Student Name */}
          <div className="text-center mt-4 sm:mt-10">
            <h2 className="text-lg sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              {certificate.studentName}
            </h2>
            <div 
              className="w-40 sm:w-56 h-[2px] mx-auto mt-2 sm:mt-3 transition-all"
              style={{ background: template.secondaryColor || "#00d4aa" }}
            />
          </div>

          {/* Paragraph body */}
          <div className="text-center mt-4 sm:mt-8 max-w-[85%] mx-auto leading-relaxed text-[10px] sm:text-sm md:text-base">
            <p>
              {template.bodyTemplate
                ? template.bodyTemplate
                    .replace("{courseName}", certificate.courseName)
                    .replace("{startDate}", certificate.startDate)
                    .replace("{endDate}", certificate.endDate)
                : `has successfully completed the internship program...`}
            </p>
          </div>

          {/* Certificate Footer Row */}
          <div className="absolute bottom-6 sm:bottom-12 md:bottom-16 left-8 sm:left-14 right-8 sm:right-14 flex items-end justify-between text-[8px] sm:text-xs">
            {/* Left Signatory / Date */}
            <div className="text-center w-28 sm:w-44">
              <div className="font-bold border-t border-slate-300 pt-1 sm:pt-2">
                {certificate.issueDate}
              </div>
              <div className="text-[7px] sm:text-[10px] mt-0.5 sm:mt-1 text-slate-500">
                Date of Issue
              </div>
            </div>

            {/* Verification QR */}
            <div className="flex flex-col items-center">
              <div 
                className="w-12 h-12 sm:w-20 sm:h-20 p-1 border rounded bg-white flex items-center justify-center shadow-sm"
                style={{ borderColor: template.primaryColor || "#003e8f" }}
              >
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
              </div>
              <span className="text-[6px] sm:text-[9px] font-mono font-bold mt-1 sm:mt-2" style={{ color: template.primaryColor || "#003e8f" }}>
                {certificate.certCode}
              </span>
            </div>

            {/* Right Signatory */}
            <div className="text-center w-28 sm:w-44">
              <div className="font-bold border-t border-slate-300 pt-1 sm:pt-2 truncate">
                {template.signatoryName}
              </div>
              <div className="text-[7px] sm:text-[10px] italic mt-0.5 sm:mt-1 text-slate-500 truncate leading-tight">
                {template.signatoryTitle}
              </div>
            </div>
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
