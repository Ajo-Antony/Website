"use client";

import React, { useState, useTransition, useEffect } from "react";
import { 
  addCertificateStudent, 
  deleteCertificateStudent, 
  updateCertificateTemplate, 
  updateSingleStudent,
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
  FileText
} from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  initialTemplate: CertificateTemplate;
  initialStudents: StudentCertificate[];
}

export default function CertificatesClient({ initialTemplate, initialStudents }: Props) {
  const [activeTab, setActiveTab] = useState<"students" | "branding">("students");
  const [isPending, startTransition] = useTransition();

  // Template State
  const [template, setTemplate] = useState<CertificateTemplate>(initialTemplate);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Students State
  const [students, setStudents] = useState<StudentCertificate[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals & Forms State
  const [isAdding, setIsAdding] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentCertificate | null>(null);

  // Form inputs for Add
  const [formName, setFormName] = useState("");
  const [formCourse, setFormCourse] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formIssue, setFormIssue] = useState("");
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
      
      // Default: Last 2 months
      const start = new Date();
      start.setMonth(start.getMonth() - 2);
      
      setFormStart(formatDate(start));
      setFormEnd(formatDate(today));
      setFormIssue(formatDate(today));
      setFormError("");
    }
  }, [isAdding]);

  // Handle template updates
  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    
    startTransition(async () => {
      const res = await updateCertificateTemplate(template);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Failed to save styles: " + res.error);
      }
    });
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
      });

      if (res.success && res.code) {
        setIsAdding(false);
        // Refresh local student list
        const updated = [
          {
            id: crypto.randomUUID(),
            studentName: formName.trim(),
            courseName: formCourse.trim(),
            startDate: formStart.trim(),
            endDate: formEnd.trim(),
            issueDate: formIssue.trim(),
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
      });

      if (res.success) {
        setStudents(
          students.map((s) => (s.id === editingStudent.id ? editingStudent : s))
        );
        setEditingStudent(null);
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
      } else {
        alert("Failed to delete student certificate: " + res.error);
      }
    });
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

  // Filter students
  const filteredStudents = students.filter((s) => {
    const query = search.toLowerCase();
    return (
      s.studentName.toLowerCase().includes(query) ||
      s.courseName.toLowerCase().includes(query) ||
      s.certCode.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-[var(--border)] gap-2">
        <button
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all ${
            activeTab === "students"
              ? "border-accent text-accent"
              : "border-transparent text-[var(--text-dim)] hover:text-[var(--text)]"
          }`}
        >
          <Users size={16} />
          Student Certificates ({students.length})
        </button>
        <button
          onClick={() => setActiveTab("branding")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all ${
            activeTab === "branding"
              ? "border-accent text-accent"
              : "border-transparent text-[var(--text-dim)] hover:text-[var(--text)]"
          }`}
        >
          <Sliders size={16} />
          Branding & Layout Editor
        </button>
      </div>

      {/* ─── STUDENTS TAB ─── */}
      {activeTab === "students" && (
        <div className="space-y-6">
          {/* Controls Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)]">
            <div className="relative w-full sm:max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--text-dim)]">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students, courses or verify IDs..."
                className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="w-full sm:w-auto bg-gradient-to-br from-accent to-accent-2 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-[0_8px_20px_rgba(108,99,255,0.3)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Issue Certificate
            </button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
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
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
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
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
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
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
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
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
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
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
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
                      className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
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
                        value={editingStudent.endDate}
                        onChange={(e) => setEditingStudent({ ...editingStudent, endDate: e.target.value })}
                        className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
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
                        className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] focus:outline-none"
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
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[var(--surface-alt)] text-xs font-bold uppercase tracking-wider text-[var(--text-dim)]">
                <div className="col-span-3">Student Name</div>
                <div className="col-span-4">Course Name</div>
                <div className="col-span-2">Verification Code</div>
                <div className="col-span-1">Issue Date</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {filteredStudents.map((student) => (
                <div key={student.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center px-6 py-4 hover:bg-[var(--surface-alt)]/50 transition-colors">
                  {/* Name */}
                  <div className="col-span-3 min-w-0">
                    <div className="font-bold text-[var(--text)] truncate">{student.studentName}</div>
                    <div className="text-[10px] text-[var(--text-dim)] md:hidden mt-0.5">Verification Code: {student.certCode}</div>
                  </div>

                  {/* Course */}
                  <div className="col-span-4 text-sm text-[var(--text-muted)] md:truncate">
                    {student.courseName}
                  </div>

                  {/* Verification ID */}
                  <div className="col-span-2 hidden md:block">
                    <code className="text-xs font-mono bg-[var(--surface-alt)] px-2.5 py-1 rounded-md border border-[var(--border)] text-accent font-bold">
                      {student.certCode}
                    </code>
                  </div>

                  {/* Issue Date */}
                  <div className="col-span-1 text-sm text-[var(--text-dim)] flex items-center gap-1.5">
                    <Calendar size={13} />
                    {student.issueDate}
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
                      title="View certificate"
                      className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-alt)] text-[var(--text-muted)] hover:text-accent transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
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
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── BRANDING & LAYOUT EDITOR TAB ─── */}
      {activeTab === "branding" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Editor (Left side, 5 cols) */}
          <div className="lg:col-span-5 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-md">
            <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-2">
              <Sliders size={16} className="text-accent" />
              Template Layout Variables
            </h2>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
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
                  Certificate Color Accents
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-[var(--text-dim)]">Primary (Dark Border/Text)</span>
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
                    <span className="text-[10px] text-[var(--text-dim)]">Secondary (Inner Border)</span>
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
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">
                  Paragraph Template Body
                </label>
                <textarea
                  rows={4}
                  required
                  value={template.bodyTemplate}
                  onChange={(e) => setTemplate({ ...template, bodyTemplate: e.target.value })}
                  className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[var(--text)] focus:outline-none font-sans"
                />
                <span className="text-[10px] text-[var(--text-dim)] block mt-1 leading-normal">
                  Use placeholders: <code className="font-mono text-accent">{`{courseName}`}</code>, <code className="font-mono text-accent">{`{startDate}`}</code>, and <code className="font-mono text-accent">{`{endDate}`}</code>. These will resolve automatically for each student certificate.
                </span>
              </div>

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
                    className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)]"
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
                    className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)]"
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
                    ✓ Advanced branding config updated successfully!
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Interactive Dynamic Certificate Live Preview (Right side, 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
              Interactive Design Canvas Preview (Landscape 16:11 Aspect)
            </span>

            {/* Simulated Live PDF certificate render */}
            <div 
              className="w-full aspect-[1.414/1] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all border border-line"
              style={{ 
                background: "#FAF9F6", // Luxury linen paper colour
                color: template.textColor || "#15140f",
                fontFamily: "var(--font-body)"
              }}
            >
              {/* Decorative Accent Borders */}
              <div 
                className="absolute inset-2 pointer-events-none transition-all"
                style={{ borderColor: template.secondaryColor || "#00d4aa", borderWidth: "1.5px", borderStyle: "solid" }}
              />
              <div 
                className="absolute inset-3 pointer-events-none transition-all"
                style={{ borderColor: template.primaryColor || "#003e8f", borderWidth: "4px", borderStyle: "solid" }}
              />
              <div 
                className="absolute inset-4.5 pointer-events-none transition-all"
                style={{ borderColor: template.secondaryColor || "#00d4aa", borderWidth: "1px", borderStyle: "solid" }}
              />

              {/* Corner Diamonds */}
              {[
                "top-3 left-3",
                "top-3 right-3",
                "bottom-3 left-3",
                "bottom-3 right-3"
              ].map((pos) => (
                <div key={pos} className={`absolute ${pos} w-4.5 h-4.5 flex items-center justify-center`}>
                  <div 
                    className="w-3.5 h-3.5 rotate-45"
                    style={{ background: template.primaryColor || "#003e8f" }}
                  />
                </div>
              ))}

              {/* Branding Header Watermark */}
              <div className="text-center mt-3">
                <span 
                  className="text-[8px] md:text-[10px] font-bold tracking-widest block transition-colors"
                  style={{ color: template.primaryColor || "#003e8f" }}
                >
                  STRIXMIND AI OPERATING SYSTEM
                </span>
              </div>

              {/* Dynamic Title */}
              <div className="text-center mt-4 md:mt-6">
                <h3 
                  className="text-sm md:text-xl font-bold tracking-tight transition-colors line-clamp-1"
                  style={{ color: template.primaryColor || "#003e8f" }}
                >
                  {template.title || "CERTIFICATE OF INTERNSHIP COMPLETION"}
                </h3>
                <p 
                  className="text-[10px] md:text-xs italic mt-1"
                  style={{ color: template.mutedColor || "#4b5563" }}
                >
                  {template.subtitle || "This is to certify that"}
                </p>
              </div>

              {/* Sample Student Name */}
              <div className="text-center mt-3 md:mt-5">
                <h4 className="text-lg md:text-2xl font-extrabold tracking-tight">
                  John Doe Sebastian
                </h4>
                {/* Accent line */}
                <div 
                  className="w-32 h-[1.5px] mx-auto mt-1 md:mt-2 transition-all"
                  style={{ background: template.secondaryColor || "#00d4aa" }}
                />
              </div>

              {/* Body Text Compiled preview */}
              <div className="text-center mt-3 md:mt-5 max-w-[85%] mx-auto leading-relaxed">
                <p className="text-[10px] md:text-xs">
                  {template.bodyTemplate
                    ? template.bodyTemplate
                        .replace("{courseName}", "Full Stack AI Engineering Internship")
                        .replace("{startDate}", "01 May 2026")
                        .replace("{endDate}", "30 June 2026")
                    : "has successfully completed the internship program..."}
                </p>
              </div>

              {/* Footer row (Signatures and QR code) */}
              <div className="absolute bottom-6 md:bottom-8 left-8 right-8 flex items-end justify-between text-[10px]">
                {/* Date of Issue */}
                <div className="text-center w-28 md:w-36">
                  <div className="font-bold border-t border-slate-300 pt-1">
                    01 July 2026
                  </div>
                  <div className="text-[8px] md:text-[9px] mt-0.5" style={{ color: template.mutedColor || "#4b5563" }}>
                    Date of Issue
                  </div>
                </div>

                {/* Simulated QR Code */}
                <div className="flex flex-col items-center">
                  {/* Outer QR Frame */}
                  <div 
                    className="w-12 h-12 md:w-16 md:h-16 p-1 border rounded bg-white flex items-center justify-center shadow-sm"
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
                  <span className="text-[7px] md:text-[8px] font-mono font-bold mt-1.5" style={{ color: template.primaryColor || "#003e8f" }}>
                    SM-2026-XJ92K
                  </span>
                </div>

                {/* Signatory */}
                <div className="text-center w-28 md:w-36">
                  <div className="font-bold border-t border-slate-300 pt-1 line-clamp-1">
                    {template.signatoryName || "Antony Sebastian"}
                  </div>
                  <div className="text-[8px] md:text-[9px] italic mt-0.5 leading-none line-clamp-1" style={{ color: template.mutedColor || "#4b5563" }}>
                    {template.signatoryTitle || "Founder, StrixMind LLP"}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] text-xs text-[var(--text-dim)] leading-normal flex gap-2.5 items-start">
              <span className="text-accent shrink-0 pt-0.5">ℹ</span>
              <span>
                The dynamic preview panel on this canvas reflects real-time styling, accent borders, custom signatory values, and structural margins as they appear on the final generated PDF files.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
