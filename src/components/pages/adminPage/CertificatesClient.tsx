"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import { 
  addCertificateStudent, 
  deleteCertificateStudent, 
  updateCertificateTemplate, 
  updateSingleStudent,
  sendCertificateEmailAction,
  type CertificateTemplate, 
  type StudentCertificate 
} from "@/lib/actions/certificates";
import { 
  Plus, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  Edit, 
  Download, 
  ExternalLink, 
  Sliders, 
  Users, 
  RefreshCw,
  Award,
  Calendar,
  Layers,
  FileText,
  QrCode,
  CheckSquare,
  Square,
  FileArchive,
  Move,
  Info,
  Type,
  Maximize2,
  MapPin,
  Mail,
  Globe
} from "lucide-react";
import confetti from "canvas-confetti";
import QRCode from "qrcode";

interface Props {
  initialTemplate: CertificateTemplate;
  initialStudents: StudentCertificate[];
}

export default function CertificatesClient({ initialTemplate, initialStudents }: Props) {
  const [activeTab, setActiveTab] = useState<"students" | "branding">("students");
  const [isPending, startTransition] = useTransition();

  // Template State
  const [template, setTemplate] = useState<CertificateTemplate>({
    titleY: 150,
    subtitleY: 200,
    studentNameY: 250,
    bodyY: 310,
    footerY: 120,
    qrY: 60,
    qrSize: 74,
    borderWidth: 4,
    fontFamily: "sans",
    ...initialTemplate
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showGuides, setShowGuides] = useState(true);

  // Drag and Drop State for Advanced Canvas Layout Editor
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Students State
  const [students, setStudents] = useState<StudentCertificate[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Selection state for Bulk Actions
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [isExportingZip, setIsExportingZip] = useState(false);

  // Modals & Forms State
  const [isAdding, setIsAdding] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentCertificate | null>(null);

  // Email Student Modal State
  const [emailModalStudent, setEmailModalStudent] = useState<StudentCertificate | null>(null);
  const [emailModalInput, setEmailModalInput] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  // QR Generator Modal State
  const [qrModalStudent, setQrModalStudent] = useState<StudentCertificate | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Form inputs for Add
  const [formName, setFormName] = useState("");
  const [formCourse, setFormCourse] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formIssue, setFormIssue] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formError, setFormError] = useState("");

  // Populate helper templates for course or date defaults
  useEffect(() => {
    if (isAdding) {
      setFormName("");
      setFormCourse("Full Stack AI Engineering Internship");
      
      const today = new Date();
      const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        });
      };
      
      const start = new Date();
      start.setMonth(start.getMonth() - 2);
      
      setFormStart(formatDate(start));
      setFormEnd(formatDate(today));
      setFormIssue(formatDate(today));
      setFormEmail("");
      setFormError("");
    }
  }, [isAdding]);

  // Generate QR on-demand when student row button is clicked
  useEffect(() => {
    if (qrModalStudent) {
      const origin = window.location.origin;
      const verifyUrl = `${origin}/certificate/verify/${qrModalStudent.certCode}`;
      
      QRCode.toDataURL(verifyUrl, {
        margin: 2,
        width: 350,
        color: {
          dark: template.primaryColor || "#003e8f",
          light: "#ffffff",
        }
      }).then(url => {
        setQrDataUrl(url);
      }).catch(err => {
        console.error("QR creation failed", err);
      });
    } else {
      setQrDataUrl("");
    }
  }, [qrModalStudent, template.primaryColor]);

  // Sync email modal input with chosen student email
  useEffect(() => {
    if (emailModalStudent) {
      setEmailModalInput(emailModalStudent.studentEmail || "");
      setEmailSuccess(false);
      setEmailError("");
    }
  }, [emailModalStudent]);

  // Handle template updates
  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    
    startTransition(async () => {
      const res = await updateCertificateTemplate(template);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        confetti({ particleCount: 50, spread: 40 });
      } else {
        alert("Failed to save styles: " + res.error);
      }
    });
  };

  // Reset coordinates to default safely
  const handleResetCoordinates = () => {
    setTemplate(prev => ({
      ...prev,
      titleY: 150,
      subtitleY: 200,
      studentNameY: 250,
      bodyY: 310,
      footerY: 120,
      qrY: 60,
      qrSize: 74,
      borderWidth: 4,
      fontFamily: "sans"
    }));
  };

  // Drag and Drop Core Event Listeners
  const startDrag = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    setDraggingElement(elementId);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingElement || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const yFromTop = e.clientY - rect.top;
    const yFromBottom = rect.bottom - e.clientY;
    
    // Total PDF height is 841.89 pts for A4 Portrait letterhead
    const ratio = 841.89 / rect.height;
    
    if (draggingElement === "title") {
      const pt = Math.round(yFromTop * ratio);
      setTemplate(prev => ({ ...prev, titleY: Math.max(40, Math.min(400, pt)) }));
    } else if (draggingElement === "subtitle") {
      const pt = Math.round(yFromTop * ratio);
      setTemplate(prev => ({ ...prev, subtitleY: Math.max(60, Math.min(450, pt)) }));
    } else if (draggingElement === "studentName") {
      const pt = Math.round(yFromTop * ratio);
      setTemplate(prev => ({ ...prev, studentNameY: Math.max(100, Math.min(500, pt)) }));
    } else if (draggingElement === "body") {
      const pt = Math.round(yFromTop * ratio);
      setTemplate(prev => ({ ...prev, bodyY: Math.max(150, Math.min(650, pt)) }));
    } else if (draggingElement === "footer") {
      const pt = Math.round(yFromBottom * ratio);
      setTemplate(prev => ({ ...prev, footerY: Math.max(40, Math.min(350, pt)) }));
    } else if (draggingElement === "qr") {
      const pt = Math.round(yFromBottom * ratio);
      setTemplate(prev => ({ ...prev, qrY: Math.max(20, Math.min(250, pt)) }));
    }
  };

  const stopDrag = () => {
    setDraggingElement(null);
  };

  // Handle Add Student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim() || !formCourse.trim() || !formStart.trim() || !formEnd.trim() || !formIssue.trim()) {
      setFormError("All fields are required.");
      return;
    }

    startTransition(async () => {
      const res = await addCertificateStudent({
        studentName: formName.trim(),
        courseName: formCourse.trim(),
        startDate: formStart.trim(),
        endDate: formEnd.trim(),
        issueDate: formIssue.trim(),
        studentEmail: formEmail.trim() || undefined,
      });

      if (res.success && res.code) {
        setIsAdding(false);
        const updated = [
          {
            id: res.id || crypto.randomUUID(),
            studentName: formName.trim(),
            courseName: formCourse.trim(),
            startDate: formStart.trim(),
            endDate: formEnd.trim(),
            issueDate: formIssue.trim(),
            studentEmail: formEmail.trim(),
            certCode: res.code,
            created_at: new Date().toISOString(),
          },
          ...students,
        ];
        setStudents(updated);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } else {
        setFormError(res.error || "Failed to add student.");
      }
    });
  };

  // Handle Edit Student
  const handleEditStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    startTransition(async () => {
      const res = await updateSingleStudent(editingStudent.id, {
        studentName: editingStudent.studentName,
        courseName: editingStudent.courseName,
        startDate: editingStudent.startDate,
        endDate: editingStudent.endDate,
        issueDate: editingStudent.issueDate,
        studentEmail: editingStudent.studentEmail,
      });

      if (res.success) {
        setStudents(
          students.map((s) => (s.id === editingStudent.id ? editingStudent : s))
        );
        setEditingStudent(null);
        confetti({ particleCount: 30 });
      } else {
        alert("Failed to update: " + res.error);
      }
    });
  };

  // Handle Delete Student
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the certificate for ${name}? This cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteCertificateStudent(id);
      if (res.success) {
        setStudents(students.filter((s) => s.id !== id));
        // Remove from selected list
        setSelectedCodes(prev => prev.filter(code => {
          const m = students.find(s => s.id === id);
          return m ? code !== m.certCode : true;
        }));
      } else {
        alert("Failed to delete student certificate: " + res.error);
      }
    });
  };

  // Handle send certificate email action
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalStudent) return;

    const email = emailModalInput.trim();
    if (!email) {
      setEmailError("Recipient email address is required.");
      return;
    }

    setIsSendingEmail(true);
    setEmailError("");
    setEmailSuccess(false);

    try {
      const res = await sendCertificateEmailAction(emailModalStudent.id, email);
      if (res.success) {
        setEmailSuccess(true);
        setStudents(prev => prev.map(s => s.id === emailModalStudent.id ? { ...s, studentEmail: email } : s));
        confetti({ particleCount: 30, spread: 50 });
      } else {
        setEmailError(res.error || "Failed to send email. Make sure SMTP is configured in your environments.");
      }
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Copy unique view url to clipboard
  const handleCopyLink = (code: string) => {
    const origin = window.location.origin;
    const link = `${origin}/certificate/verify/${code}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  // Trigger browser PDF download
  const handleDownloadPdf = (code: string, studentName: string) => {
    const downloadUrl = `/api/certificates/${code}/download`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `Internship_Certificate_${studentName.replace(/\s+/g, "_")}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle individual checkbox selection
  const handleToggleSelect = (code: string) => {
    setSelectedCodes(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  // Handle Select All visible students
  const handleToggleSelectAll = (visibleCodes: string[]) => {
    const allSelected = visibleCodes.every(code => selectedCodes.includes(code));
    if (allSelected) {
      setSelectedCodes(prev => prev.filter(code => !visibleCodes.includes(code)));
    } else {
      // Add missing codes
      setSelectedCodes(prev => {
        const added = [...prev];
        visibleCodes.forEach(code => {
          if (!added.includes(code)) added.push(code);
        });
        return added;
      });
    }
  };

  // Bulk ZIP Download API Handler
  const handleBulkDownloadZip = async () => {
    if (selectedCodes.length === 0) return;
    setIsExportingZip(true);

    try {
      const res = await fetch("/api/certificates/bulk-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certCodes: selectedCodes }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to package bulk certificates archive.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `StrixMind_Certificates_Batch_${new Date().toISOString().slice(0, 10)}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      confetti({ particleCount: 120, spread: 80 });
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Bulk ZIP download failed.");
    } finally {
      setIsExportingZip(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const query = search.toLowerCase();
    return (
      s.studentName.toLowerCase().includes(query) ||
      s.courseName.toLowerCase().includes(query) ||
      s.certCode.toLowerCase().includes(query)
    );
  });

  const visibleCodes = filteredStudents.map(s => s.certCode);
  const isAllSelected = visibleCodes.length > 0 && visibleCodes.every(code => selectedCodes.includes(code));

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-[var(--border)] gap-2">
        <button
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all ${
            activeTab === "students"
              ? "border-accent text-accent animate-fade-in"
              : "border-transparent text-[var(--text-dim)] hover:text-[var(--text)]"
          }`}
        >
          <Users size={16} />
          Student Directory ({students.length})
        </button>
        <button
          onClick={() => setActiveTab("branding")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all ${
            activeTab === "branding"
              ? "border-accent text-accent animate-fade-in"
              : "border-transparent text-[var(--text-dim)] hover:text-[var(--text)]"
          }`}
        >
          <Sliders size={16} />
          Branding & Layout Customizer
        </button>
      </div>

      {/* ─── STUDENTS TAB ─── */}
      {activeTab === "students" && (
        <div className="space-y-6">
          {/* Controls Panel */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--text-dim)]">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students, courses or unique verification IDs..."
                className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {/* ZIP Bulk download trigger */}
              {selectedCodes.length > 0 && (
                <button
                  onClick={handleBulkDownloadZip}
                  disabled={isExportingZip}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  {isExportingZip ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <FileArchive size={15} />
                  )}
                  <span>Export Selection ({selectedCodes.length}) as ZIP</span>
                </button>
              )}

              <button
                onClick={() => setIsAdding(true)}
                className="bg-gradient-to-br from-accent to-accent-2 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-[0_8px_20px_rgba(108,99,255,0.3)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Issue Certificate
              </button>
            </div>
          </div>

          {/* Student Add collapse form */}
          {isAdding && (
            <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-xl relative animate-fade-in">
              <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <Award size={18} className="text-accent" />
                New Certificate Details
              </h2>
              <form onSubmit={handleAddStudent} className="space-y-4">
                {formError && (
                  <div className="text-xs text-rose bg-rose/10 border border-rose/25 rounded-lg px-3 py-2">
                    {formError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                      Student Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Antony Sebastian"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                      Internship Course Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Full Stack AI Engineering Internship"
                      value={formCourse}
                      onChange={(e) => setFormCourse(e.target.value)}
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                      Student Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. student@gmail.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 01 May 2026"
                      value={formStart}
                      onChange={(e) => setFormStart(e.target.value)}
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                      End Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 30 June 2026"
                      value={formEnd}
                      onChange={(e) => setFormEnd(e.target.value)}
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                      Date of Issue
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 01 July 2026"
                      value={formIssue}
                      onChange={(e) => setFormIssue(e.target.value)}
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--border)] hover:bg-[var(--surface-alt)] text-[var(--text-muted)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="bg-accent hover:bg-accent-deep text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isPending ? "Generating..." : "Generate & Store Certificate"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Student Edit Modal */}
          {editingStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/75" onClick={() => setEditingStudent(null)} />
              <div className="relative bg-[var(--surface)] border border-[var(--border)] p-6 rounded-3xl max-w-xl w-full shadow-2xl animate-fade-in z-10">
                <h2 className="text-lg font-bold text-ink mb-4">Edit Student Certificate</h2>
                <form onSubmit={handleEditStudentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                      Student Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editingStudent.studentName}
                      onChange={(e) => setEditingStudent({ ...editingStudent, studentName: e.target.value })}
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                      Course Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editingStudent.courseName}
                      onChange={(e) => setEditingStudent({ ...editingStudent, courseName: e.target.value })}
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                      Student Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={editingStudent.studentEmail || ""}
                      onChange={(e) => setEditingStudent({ ...editingStudent, studentEmail: e.target.value })}
                      placeholder="e.g. student@gmail.com"
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        required
                        value={editingStudent.startDate}
                        onChange={(e) => setEditingStudent({ ...editingStudent, startDate: e.target.value })}
                        className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                        End Date
                      </label>
                      <input
                        type="text"
                        required
                        value={editingStudent.endDate}
                        onChange={(e) => setEditingStudent({ ...editingStudent, endDate: e.target.value })}
                        className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                        Issue Date
                      </label>
                      <input
                        type="text"
                        required
                        value={editingStudent.issueDate}
                        onChange={(e) => setEditingStudent({ ...editingStudent, issueDate: e.target.value })}
                        className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingStudent(null)}
                      className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--border)] hover:bg-[var(--surface-alt)] text-[var(--text-muted)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="bg-accent hover:bg-accent-deep text-white font-bold text-sm px-5 py-2.5 rounded-xl"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Email to Student Modal */}
          {emailModalStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/75" onClick={() => setEmailModalStudent(null)} />
              <div className="relative bg-[var(--surface)] border border-[var(--border)] p-6 rounded-3xl max-w-md w-full shadow-2xl animate-fade-in z-10">
                <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-2 text-ink">
                  <h3 className="font-bold flex items-center gap-2">
                    <Mail size={16} className="text-accent" />
                    Email Certificate to Student
                  </h3>
                  <button 
                    onClick={() => setEmailModalStudent(null)}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    Close
                  </button>
                </div>

                {emailSuccess ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Check size={24} />
                    </div>
                    <h4 className="font-bold text-[var(--text)] text-base">Email Dispatched Successfully!</h4>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-sm mx-auto">
                      An automated email containing the custom verification link and the QR passport attachment has been delivered to:
                      <br />
                      <strong className="text-[var(--text)] font-semibold break-all">{emailModalInput}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => setEmailModalStudent(null)}
                      className="mt-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      Awesome
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSendEmail} className="space-y-4">
                    <div className="bg-[var(--surface-alt)] p-4 rounded-2xl border border-[var(--border)] space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-dim)]">Student</span>
                        <span className="text-xs font-bold text-[var(--text)] text-right">{emailModalStudent.studentName}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-dim)]">Course</span>
                        <span className="text-xs font-semibold text-[var(--text)] text-right max-w-[200px]">{emailModalStudent.courseName}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-dim)]">Code</span>
                        <span className="font-mono text-xs font-bold text-accent">{emailModalStudent.certCode}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                        Recipient Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={emailModalInput}
                        onChange={(e) => setEmailModalInput(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30"
                      />
                    </div>

                    {emailError && (
                      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs">
                        {emailError}
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEmailModalStudent(null)}
                        className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--border)] hover:bg-[var(--surface-alt)] text-[var(--text-muted)]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSendingEmail}
                        className="bg-accent hover:bg-accent-deep text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isSendingEmail ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Mail size={14} />
                            <span>Send Email</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* QR Code Dynamic Generator Modal */}
          {qrModalStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/75" onClick={() => setQrModalStudent(null)} />
              <div className="relative bg-[var(--surface)] border border-[var(--border)] p-6 rounded-3xl max-w-sm w-full shadow-2xl animate-fade-in z-10 text-center">
                <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-2 text-ink">
                  <h3 className="font-bold flex items-center gap-2">
                    <QrCode size={16} className="text-accent" />
                    Dynamic QR Passport
                  </h3>
                  <button 
                    onClick={() => setQrModalStudent(null)}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    Close
                  </button>
                </div>

                <p className="text-xs text-[var(--text-muted)] mb-4">
                  Dynamically mapped to verification records of <br/>
                  <strong className="text-[var(--text)] font-semibold">{qrModalStudent.studentName}</strong>
                </p>

                {/* QR Code Graphic Container */}
                <div className="bg-white p-4 rounded-2xl inline-block border border-slate-200 shadow-inner mb-4">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="Student Verification QR Code" 
                      className="w-48 h-48 mx-auto"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                      Generating QR...
                    </div>
                  )}
                </div>

                {/* Action Row */}
                <div className="space-y-2">
                  <code className="block bg-[var(--surface-alt)] px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text)] font-mono text-xs font-bold mb-3 select-all">
                    {qrModalStudent.certCode}
                  </code>

                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = qrDataUrl;
                      link.download = `QR_${qrModalStudent.studentName.replace(/\s+/g, "_")}_${qrModalStudent.certCode}.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    disabled={!qrDataUrl}
                    className="w-full bg-accent hover:bg-accent-deep text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download size={13} />
                    Download QR Image (PNG)
                  </button>

                  <button
                    onClick={() => handleCopyLink(qrModalStudent.certCode)}
                    className="w-full border border-[var(--border)] hover:bg-[var(--surface-alt)] text-[var(--text)] text-xs font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copiedCode === qrModalStudent.certCode ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span>Copied Link!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy Verification Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Students List */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-16 bg-[var(--surface)] rounded-2xl border border-[var(--border)] border-dashed">
              <Award className="w-12 h-12 text-[var(--text-dim)] mx-auto mb-3" />
              <p className="text-[var(--text-muted)] text-base">
                {search ? "No certificates match your search filters." : "No student certificates issued yet."}
              </p>
            </div>
          ) : (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden divide-y divide-[var(--border)] shadow-md">
              <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-[var(--surface-alt)] text-xs font-bold uppercase tracking-wider text-[var(--text-dim)] items-center">
                <div className="col-span-1 flex items-center justify-center">
                  <button
                    onClick={() => handleToggleSelectAll(visibleCodes)}
                    className="p-1 rounded text-[var(--text-dim)] hover:text-accent transition-colors"
                    title={isAllSelected ? "Deselect All" : "Select All"}
                  >
                    {isAllSelected ? (
                      <CheckSquare size={16} className="text-accent" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </div>
                <div className="col-span-3">Student Name</div>
                <div className="col-span-3">Course Name</div>
                <div className="col-span-2">Verification Code</div>
                <div className="col-span-1 text-center">QR Code</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {filteredStudents.map((student) => {
                const isSelected = selectedCodes.includes(student.certCode);
                return (
                  <div key={student.id} className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center px-6 py-4 hover:bg-[var(--surface-alt)]/50 transition-colors ${isSelected ? 'bg-accent/5' : ''}`}>
                    {/* Checkbox */}
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        onClick={() => handleToggleSelect(student.certCode)}
                        className="p-1.5 rounded transition-colors text-[var(--text-dim)] hover:text-accent"
                      >
                        {isSelected ? (
                          <CheckSquare size={16} className="text-accent" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </div>

                    {/* Name */}
                    <div className="col-span-3 min-w-0">
                      <div className="font-bold text-[var(--text)] truncate">{student.studentName}</div>
                      <div className="text-[10px] text-[var(--text-dim)] md:hidden mt-0.5">ID: {student.certCode}</div>
                    </div>

                    {/* Course */}
                    <div className="col-span-3 text-sm text-[var(--text-muted)] md:truncate">
                      {student.courseName}
                    </div>

                    {/* Verification ID */}
                    <div className="col-span-2 hidden md:block">
                      <code className="text-xs font-mono bg-[var(--surface-alt)] px-2.5 py-1 rounded-md border border-[var(--border)] text-accent font-bold">
                        {student.certCode}
                      </code>
                    </div>

                    {/* Dynamic QR Passport Trigger */}
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        onClick={() => setQrModalStudent(student)}
                        title="Open QR Passport"
                        className="p-2 rounded-lg border border-transparent hover:border-accent/20 hover:bg-accent/10 text-accent transition-all flex items-center gap-1"
                      >
                        <QrCode size={16} />
                        <span className="text-[10px] font-bold md:hidden">QR code</span>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-1.5 pt-2 md:pt-0">
                      <button
                        onClick={() => handleCopyLink(student.certCode)}
                        title="Copy public link"
                        className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-alt)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors relative"
                      >
                        {copiedCode === student.certCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                      <a
                        href={`/certificate/verify/${student.certCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View certificate verification"
                        className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-alt)] text-[var(--text-muted)] hover:text-accent transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => setEmailModalStudent(student)}
                        title="Email certificate & QR to student"
                        className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-alt)] text-[var(--text-muted)] hover:text-emerald-400 transition-colors"
                      >
                        <Mail size={14} />
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(student.certCode, student.studentName)}
                        title="Download high-res PDF"
                        className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-alt)] text-[var(--text-muted)] hover:text-accent-2 transition-colors"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => setEditingStudent({ ...student })}
                        title="Edit certificate details"
                        className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-alt)] text-[var(--text-muted)] hover:text-blue-400 transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id, student.studentName)}
                        title="Delete student record"
                        className="p-2 rounded-lg border border-[var(--border)] hover:border-red-500/30 hover:bg-red-500/10 text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── BRANDING & LAYOUT CUSTOMIZER TAB ─── */}
      {activeTab === "branding" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Editor (Left side, 5 cols) */}
          <div className="lg:col-span-5 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <Sliders size={16} className="text-accent" />
                Branding Configurator
              </h2>
              <div className="flex items-center gap-3">
                <label className="text-[11px] font-bold text-[var(--text-dim)] flex items-center gap-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showGuides}
                    onChange={(e) => setShowGuides(e.target.checked)}
                    className="rounded border-[var(--border)] text-accent focus:ring-accent w-3.5 h-3.5"
                  />
                  Show Guides
                </label>
                <button
                  type="button"
                  onClick={handleResetCoordinates}
                  className="text-[11px] font-bold text-accent hover:underline flex items-center gap-1"
                  title="Reset layout spacings to factory standards"
                >
                  Reset Layout
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              {/* Text Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                    Certificate Header Title
                  </label>
                  <input
                    type="text"
                    required
                    value={template.title}
                    onChange={(e) => setTemplate({ ...template, title: e.target.value })}
                    className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                    Eye-Brow Subtitle
                  </label>
                  <input
                    type="text"
                    required
                    value={template.subtitle}
                    onChange={(e) => setTemplate({ ...template, subtitle: e.target.value })}
                    className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                    Typography Selection
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--text-dim)]">
                      <Type size={14} />
                    </span>
                    <select
                      value={template.fontFamily || "sans"}
                      onChange={(e) => setTemplate({ ...template, fontFamily: e.target.value as any })}
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
                    >
                      <option value="sans">Inter & Helvetica (Clean Modern)</option>
                      <option value="serif">Playfair & Times (Luxury Traditional)</option>
                      <option value="mono">Fira Code & Courier (Tech Minimalist)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Spacing Controls (Sliders) */}
              <div className="space-y-3 bg-[var(--surface-alt)]/40 p-4 rounded-xl border border-[var(--border)]">
                <span className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                  Fine-Tune Vertical Spacings (PDF points)
                </span>

                <div>
                  <div className="flex justify-between text-[11px] text-[var(--text-dim)] mb-1">
                    <span>Title Y-Offset</span>
                    <span className="font-mono">{template.titleY ?? 150} pt</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="280"
                    value={template.titleY ?? 150}
                    onChange={(e) => setTemplate({ ...template, titleY: parseInt(e.target.value) })}
                    className="w-full accent-accent cursor-pointer h-1 rounded-lg bg-[var(--border)]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-[var(--text-dim)] mb-1">
                    <span>Subtitle Y-Offset</span>
                    <span className="font-mono">{template.subtitleY ?? 200} pt</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="320"
                    value={template.subtitleY ?? 200}
                    onChange={(e) => setTemplate({ ...template, subtitleY: parseInt(e.target.value) })}
                    className="w-full accent-accent cursor-pointer h-1 rounded-lg bg-[var(--border)]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-[var(--text-dim)] mb-1">
                    <span>Student Name Y-Offset</span>
                    <span className="font-mono">{template.studentNameY ?? 250} pt</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="380"
                    value={template.studentNameY ?? 250}
                    onChange={(e) => setTemplate({ ...template, studentNameY: parseInt(e.target.value) })}
                    className="w-full accent-accent cursor-pointer h-1 rounded-lg bg-[var(--border)]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-[var(--text-dim)] mb-1">
                    <span>Paragraph Body Y-Offset</span>
                    <span className="font-mono">{template.bodyY ?? 310} pt</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="450"
                    value={template.bodyY ?? 310}
                    onChange={(e) => setTemplate({ ...template, bodyY: parseInt(e.target.value) })}
                    className="w-full accent-accent cursor-pointer h-1 rounded-lg bg-[var(--border)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex justify-between text-[10px] text-[var(--text-dim)] mb-1">
                      <span>Signatures Bottom</span>
                      <span className="font-mono">{template.footerY ?? 120}</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="220"
                      value={template.footerY ?? 120}
                      onChange={(e) => setTemplate({ ...template, footerY: parseInt(e.target.value) })}
                      className="w-full accent-accent cursor-pointer h-1 rounded-lg bg-[var(--border)]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-[var(--text-dim)] mb-1">
                      <span>QR Bottom</span>
                      <span className="font-mono">{template.qrY ?? 60}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="180"
                      value={template.qrY ?? 60}
                      onChange={(e) => setTemplate({ ...template, qrY: parseInt(e.target.value) })}
                      className="w-full accent-accent cursor-pointer h-1 rounded-lg bg-[var(--border)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex justify-between text-[10px] text-[var(--text-dim)] mb-1">
                      <span>QR Code Size</span>
                      <span className="font-mono">{template.qrSize ?? 74}px</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="110"
                      value={template.qrSize ?? 74}
                      onChange={(e) => setTemplate({ ...template, qrSize: parseInt(e.target.value) })}
                      className="w-full accent-accent cursor-pointer h-1 rounded-lg bg-[var(--border)]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-[var(--text-dim)] mb-1">
                      <span>Border Width</span>
                      <span className="font-mono">{template.borderWidth ?? 4}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={template.borderWidth ?? 4}
                      onChange={(e) => setTemplate({ ...template, borderWidth: parseInt(e.target.value) })}
                      className="w-full accent-accent cursor-pointer h-1 rounded-lg bg-[var(--border)]"
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                  Palettes & Accents
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-[var(--text-dim)]">Primary (Watermark/Border)</span>
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="color"
                        value={template.primaryColor}
                        onChange={(e) => setTemplate({ ...template, primaryColor: e.target.value })}
                        className="w-10 h-10 rounded border border-[var(--border)] cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={template.primaryColor}
                        onChange={(e) => setTemplate({ ...template, primaryColor: e.target.value })}
                        className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--text)] font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-dim)]">Secondary (Inner Line)</span>
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="color"
                        value={template.secondaryColor}
                        onChange={(e) => setTemplate({ ...template, secondaryColor: e.target.value })}
                        className="w-10 h-10 rounded border border-[var(--border)] cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={template.secondaryColor}
                        onChange={(e) => setTemplate({ ...template, secondaryColor: e.target.value })}
                        className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--text)] font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-[10px] text-[var(--text-dim)]">Main Text Color</span>
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="color"
                        value={template.textColor || "#15140f"}
                        onChange={(e) => setTemplate({ ...template, textColor: e.target.value })}
                        className="w-10 h-10 rounded border border-[var(--border)] cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={template.textColor || "#15140f"}
                        onChange={(e) => setTemplate({ ...template, textColor: e.target.value })}
                        className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--text)] font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-dim)]">Muted Labels Color</span>
                    <div className="flex gap-2 items-center mt-1">
                      <input
                        type="color"
                        value={template.mutedColor || "#4b5563"}
                        onChange={(e) => setTemplate({ ...template, mutedColor: e.target.value })}
                        className="w-10 h-10 rounded border border-[var(--border)] cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={template.mutedColor || "#4b5563"}
                        onChange={(e) => setTemplate({ ...template, mutedColor: e.target.value })}
                        className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--text)] font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Area */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                  Paragraph Template Body
                </label>
                <textarea
                  rows={3}
                  required
                  value={template.bodyTemplate}
                  onChange={(e) => setTemplate({ ...template, bodyTemplate: e.target.value })}
                  className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[var(--text)] focus:outline-none font-sans"
                />
                <span className="text-[9px] text-[var(--text-dim)] block mt-1 leading-normal">
                  Use: <code className="font-mono text-accent">{`{courseName}`}</code>, <code className="font-mono text-accent">{`{startDate}`}</code>, and <code className="font-mono text-accent">{`{endDate}`}</code>.
                </span>
              </div>

              {/* Signatories */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                    Signatory Name
                  </label>
                  <input
                    type="text"
                    required
                    value={template.signatoryName}
                    onChange={(e) => setTemplate({ ...template, signatoryName: e.target.value })}
                    className="w-full bg-[var(--surface-alt)] border border-[var(--border)] text-xs rounded-xl px-3 py-2 text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                    Signatory Title
                  </label>
                  <input
                    type="text"
                    required
                    value={template.signatoryTitle}
                    onChange={(e) => setTemplate({ ...template, signatoryTitle: e.target.value })}
                    className="w-full bg-[var(--surface-alt)] border border-[var(--border)] text-xs rounded-xl px-3 py-2 text-[var(--text)]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gradient-to-br from-accent to-accent-2 text-white font-bold text-sm py-3 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {isPending && <RefreshCw size={14} className="animate-spin" />}
                  Save Branding Configuration
                </button>
                {saveSuccess && (
                  <p className="text-xs text-emerald-400 font-semibold text-center mt-2 animate-pulse">
                    ✓ Custom layouts & styles updated successfully!
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Interactive Drag-and-Drop Canvas (Right side, 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] flex items-center gap-1.5">
                <Maximize2 size={13} className="text-accent" />
                Live Draggable Canvas (Mouse drag to position Y coords)
              </span>
              {draggingElement && (
                <span className="text-[10px] bg-accent/20 text-accent font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                  Aligning {draggingElement}...
                </span>
              )}
            </div>

            {/* Canvas Container */}
            {/* Live Interactive Designer Preview (rendered dynamically with drag-and-drop coordinates) */}
            <div 
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
              className={`w-full aspect-[1/1.414] rounded-3xl shadow-2xl relative overflow-hidden select-none transition-all ${draggingElement ? 'cursor-ns-resize ring-2 ring-accent/40' : 'cursor-default'}`}
              style={{ 
                background: "#ffffff", // Pure white letterhead background
                color: template.textColor || "#15140f",
              }}
            >
              {/* Show Horizontal Guideline Markers for Pixel-Perfect Spacing & Margins */}
              {showGuides && (
                <>
                  {/* Title guideline */}
                  <div 
                    className="absolute left-0 right-0 border-t border-dashed border-slate-300/60 pointer-events-none flex justify-between px-3 text-[7px] sm:text-[9px] text-slate-400 font-mono z-20"
                    style={{ top: `${((template.titleY ?? 135) / 841.89) * 100}%` }}
                  >
                    <span>Title Level</span>
                    <span>{template.titleY} pt</span>
                  </div>
                  {/* Subtitle guideline */}
                  <div 
                    className="absolute left-0 right-0 border-t border-dashed border-slate-300/60 pointer-events-none flex justify-between px-3 text-[7px] sm:text-[9px] text-slate-400 font-mono z-20"
                    style={{ top: `${(((template.titleY ?? 135) + 14) / 841.89) * 100}%` }}
                  >
                    <span>Subtitle Level</span>
                    <span>{template.subtitleY} pt</span>
                  </div>
                  {/* Student Name guideline */}
                  <div 
                    className="absolute left-0 right-0 border-t border-dashed border-slate-300/60 pointer-events-none flex justify-between px-3 text-[7px] sm:text-[9px] text-slate-400 font-mono z-20"
                    style={{ top: `${((template.studentNameY ?? 180) / 841.89) * 100}%` }}
                  >
                    <span>Recipient/Date Level</span>
                    <span>{template.studentNameY} pt</span>
                  </div>
                  {/* Body guideline */}
                  <div 
                    className="absolute left-0 right-0 border-t border-dashed border-slate-300/60 pointer-events-none flex justify-between px-3 text-[7px] sm:text-[9px] text-slate-400 font-mono z-20"
                    style={{ top: `${((template.bodyY ?? 265) / 841.89) * 100}%` }}
                  >
                    <span>Body Level</span>
                    <span>{template.bodyY} pt</span>
                  </div>
                  {/* QR guideline */}
                  <div 
                    className="absolute left-0 right-0 border-b border-dashed border-slate-300/60 pointer-events-none flex justify-between px-3 text-[7px] sm:text-[9px] text-slate-400 font-mono z-20"
                    style={{ bottom: `${((template.qrY ?? 60) / 841.89) * 100}%` }}
                  >
                    <span>QR Level</span>
                    <span>{template.qrY} pt</span>
                  </div>
                  {/* Signatures guideline */}
                  <div 
                    className="absolute left-0 right-0 border-b border-dashed border-slate-300/60 pointer-events-none flex justify-between px-3 text-[7px] sm:text-[9px] text-slate-400 font-mono z-20"
                    style={{ bottom: `${((template.footerY ?? 120) / 841.89) * 100}%` }}
                  >
                    <span>Regards/Signatures Level</span>
                    <span>{template.footerY} pt</span>
                  </div>
                </>
              )}

              {/* BRAND LOGO TOP-LEFT */}
              <div className="absolute top-[4.5%] left-[8%] flex items-center pointer-events-none">
                <img 
                  src="/brand/strixmind-logo.png" 
                  alt="StrixMind Logo" 
                  className="h-7 sm:h-9 md:h-12 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
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

              {/* DRAGGABLE SUBJECT / DOCUMENT TITLE (Centered below header) */}
              <div 
                onMouseDown={(e) => startDrag(e, "title")}
                className={`absolute left-0 right-0 text-center px-8 py-1.5 transition-all hover:bg-accent/5 rounded ${
                  draggingElement === "title" 
                    ? "ring-2 ring-dashed ring-accent bg-accent/5 shadow-md z-30" 
                    : showGuides 
                      ? "border border-dashed border-slate-200 hover:border-accent/40 hover:bg-slate-50/10 z-10" 
                      : "hover:shadow-sm"
                }`}
                style={{ 
                  top: `${((template.titleY ?? 135) / 841.89) * 100}%`,
                  cursor: "ns-resize",
                  fontFamily: template.fontFamily === "serif" ? "Georgia, serif" : template.fontFamily === "mono" ? "monospace" : "sans-serif"
                }}
              >
                <div className="relative group">
                  <h1 
                    className="text-[8px] sm:text-[13px] md:text-[16px] lg:text-[18px] font-extrabold tracking-tight transition-colors uppercase select-none"
                    style={{ color: template.primaryColor || "#003e8f" }}
                  >
                    {template.title || "CERTIFICATE OF INTERNSHIP COMPLETION"}
                  </h1>
                  {template.subtitle && (
                    <p 
                      className="text-[5px] sm:text-[9px] md:text-[11px] italic mt-0.5 select-none"
                      style={{ color: template.mutedColor || "#4b5563" }}
                    >
                      {template.subtitle}
                    </p>
                  )}
                  <span className="absolute -top-4 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 text-[8px] bg-accent text-white px-1.5 py-0.5 rounded font-mono font-bold transition-opacity whitespace-nowrap z-40">
                    Y: {template.titleY}pt
                  </span>
                </div>
              </div>

              {/* DRAGGABLE LETTER RECIPIENT & DATE HEADER */}
              <div 
                onMouseDown={(e) => startDrag(e, "studentName")}
                className={`absolute left-[8%] right-[8%] flex justify-between items-end px-2 py-1.5 transition-all hover:bg-accent/5 rounded ${
                  draggingElement === "studentName" 
                    ? "ring-2 ring-dashed ring-accent bg-accent/5 shadow-md z-30" 
                    : showGuides 
                      ? "border border-dashed border-slate-200 hover:border-accent/40 hover:bg-slate-50/10 z-10" 
                      : "hover:shadow-sm"
                }`}
                style={{ 
                  top: `${((template.studentNameY ?? 180) / 841.89) * 100}%`,
                  cursor: "ns-resize",
                  fontFamily: template.fontFamily === "serif" ? "Georgia, serif" : template.fontFamily === "mono" ? "monospace" : "sans-serif"
                }}
              >
                <div className="relative group flex justify-between w-full">
                  <div>
                    <span className="text-[6px] sm:text-[10px] md:text-xs font-extrabold select-none" style={{ color: template.textColor || "#15140f" }}>
                      To: Max Sebastian
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[6px] sm:text-[10px] md:text-xs font-extrabold select-none" style={{ color: template.textColor || "#15140f" }}>
                      25 January, 2029
                    </span>
                  </div>
                  <span className="absolute -top-4 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 text-[8px] bg-accent text-white px-1.5 py-0.5 rounded font-mono font-bold transition-opacity whitespace-nowrap z-40">
                    Y: {template.studentNameY}pt
                  </span>
                </div>
              </div>

              {/* SALUTATION (Positioned dynamically slightly below recipient line) */}
              <div className="absolute left-[8%] right-[8%] pointer-events-none" style={{ top: `${(((template.studentNameY ?? 180) + 40) / 841.89) * 100}%` }}>
                <p className="text-[6px] sm:text-[10px] md:text-xs font-extrabold" style={{ color: template.textColor || "#15140f" }}>
                  Dear Max Sebastian,
                </p>
              </div>

              {/* DRAGGABLE LETTER BODY TEXT */}
              <div 
                onMouseDown={(e) => startDrag(e, "body")}
                className={`absolute left-[8%] right-[8%] text-justify px-2 py-2 transition-all hover:bg-accent/5 rounded ${
                  draggingElement === "body" 
                    ? "ring-2 ring-dashed ring-accent bg-accent/5 shadow-md z-30" 
                    : showGuides 
                      ? "border border-dashed border-slate-200 hover:border-accent/40 hover:bg-slate-50/10 z-10" 
                      : "hover:shadow-sm"
                }`}
                style={{ 
                  top: `${((template.bodyY ?? 265) / 841.89) * 100}%`,
                  cursor: "ns-resize",
                  fontFamily: template.fontFamily === "serif" ? "Georgia, serif" : template.fontFamily === "mono" ? "monospace" : "sans-serif"
                }}
              >
                <div className="relative group space-y-2">
                  {(template.bodyTemplate || "")
                    .replace("{courseName}", "Full Stack AI Engineering Internship")
                    .replace("{startDate}", "01 May 2026")
                    .replace("{endDate}", "30 June 2026")
                    .split("\n")
                    .map((paragraph: string, idx: number) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return null;
                      return (
                        <p 
                          key={idx}
                          className="text-[5.5px] sm:text-[10px] md:text-xs lg:text-[13px] leading-relaxed select-none"
                          style={{ color: template.textColor || "#15140f" }}
                        >
                          {trimmed}
                        </p>
                      );
                    })}
                  <span className="absolute -top-4 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 text-[8px] bg-accent text-white px-1.5 py-0.5 rounded font-mono font-bold transition-opacity whitespace-nowrap z-40">
                    Y: {template.bodyY}pt
                  </span>
                </div>
              </div>

              {/* DRAGGABLE REGARDS & SIGNATORY */}
              <div 
                onMouseDown={(e) => startDrag(e, "footer")}
                className={`absolute left-[8%] text-left px-2 py-1.5 transition-all hover:bg-accent/5 rounded ${
                  draggingElement === "footer" 
                    ? "ring-2 ring-dashed ring-accent bg-accent/5 shadow-md z-30" 
                    : showGuides 
                      ? "border border-dashed border-slate-200 hover:border-accent/40 hover:bg-slate-50/10 z-10" 
                      : "hover:shadow-sm"
                }`}
                style={{ 
                  bottom: `${((template.footerY ?? 120) / 841.89) * 100}%`,
                  cursor: "ns-resize",
                  fontFamily: template.fontFamily === "serif" ? "Georgia, serif" : template.fontFamily === "mono" ? "monospace" : "sans-serif"
                }}
              >
                <div className="relative group space-y-1 sm:space-y-2">
                  <p className="text-[6px] sm:text-[10px] md:text-xs font-extrabold select-none" style={{ color: template.textColor || "#15140f" }}>
                    Regards,
                  </p>
                  <div className="pt-2">
                    <p className="text-[6px] sm:text-[10px] md:text-xs font-extrabold select-none" style={{ color: template.textColor || "#15140f" }}>
                      {template.signatoryName || "Antony Sebastian"}
                    </p>
                    <p className="text-[5px] sm:text-[8px] md:text-[9.5px] italic select-none" style={{ color: template.mutedColor || "#4b5563" }}>
                      {template.signatoryTitle || "Founder, StrixMind LLP"}
                    </p>
                  </div>
                  <span className="absolute -top-4 left-0 opacity-0 group-hover:opacity-100 text-[8px] bg-accent text-white px-1.5 py-0.5 rounded font-mono font-bold transition-opacity whitespace-nowrap z-40">
                    Bottom Y: {template.footerY}pt
                  </span>
                </div>
              </div>

              {/* DRAGGABLE VERIFICATION QR & ID DIGITAL STAMP (Bottom-Right) */}
              <div 
                onMouseDown={(e) => startDrag(e, "qr")}
                className={`absolute bottom-[6%] right-[8%] p-2 flex flex-col items-center transition-all hover:bg-accent/5 rounded ${
                  draggingElement === "qr" 
                    ? "ring-2 ring-dashed ring-accent bg-accent/5 shadow-md z-30" 
                    : showGuides 
                      ? "border border-dashed border-slate-200 hover:border-accent/40 hover:bg-slate-50/10 z-10" 
                      : "hover:shadow-sm"
                }`}
                style={{ 
                  bottom: `${((template.qrY ?? 60) / 841.89) * 100}%`,
                  cursor: "ns-resize",
                }}
              >
                <div className="relative group flex flex-col items-center">
                  <div 
                    className="p-0.5 border bg-white flex items-center justify-center shadow-sm overflow-hidden"
                    style={{ 
                      borderColor: template.primaryColor || "#003e8f",
                      width: "48px",
                      height: "48px"
                    }}
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
                  <span className="text-[4px] sm:text-[7.5px] font-mono font-bold mt-1 select-none" style={{ color: template.primaryColor || "#003e8f" }}>
                    Scan to verify
                  </span>
                  <span className="text-[4px] sm:text-[7.5px] font-mono font-extrabold select-none" style={{ color: template.primaryColor || "#003e8f" }}>
                    ID: SM-2026-XJ92K
                  </span>
                  <span className="absolute -top-4 opacity-0 group-hover:opacity-100 text-[8px] bg-accent text-white px-1.5 py-0.5 rounded font-mono font-bold transition-opacity whitespace-nowrap z-40">
                    Bottom Y: {template.qrY}pt
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] text-xs text-[var(--text-dim)] leading-normal flex gap-2.5 items-start">
              <Info className="text-accent shrink-0 mt-0.5" size={14} />
              <span>
                <strong>Advanced Designer Instructions:</strong> Click and drag any of the elements (Header Title, Subtitle, Student Name, Paragraph text block, signatures, or QR container) vertically on the live preview canvas above to change their PDF positions instantly! Spacing values will update the controls on the left dynamically. Save when satisfied.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
