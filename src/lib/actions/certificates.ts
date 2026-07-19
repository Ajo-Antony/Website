"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/staticClient";

export interface CertificateTemplate {
  title: string;
  subtitle: string;
  bodyTemplate: string;
  signatoryName: string;
  signatoryTitle: string;
  primaryColor: string; // Hex code, default #003E8F
  secondaryColor: string; // Hex code, default #00d4aa
  textColor: string; // Hex code, default #1a1a1e
  mutedColor: string; // Hex code, default #4b5563
  // Advanced template layout coordinates and dimensions (custom spacing)
  titleY?: number;
  subtitleY?: number;
  studentNameY?: number;
  bodyY?: number;
  footerY?: number;
  qrY?: number;
  qrSize?: number;
  borderWidth?: number;
  fontFamily?: "sans" | "serif" | "mono";
}

export interface StudentCertificate {
  id: string;
  studentName: string;
  courseName: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  certCode: string; // SM-2026-XJ92K etc.
  created_at: string;
}

const DEFAULT_TEMPLATE: CertificateTemplate = {
  title: "CERTIFICATE OF INTERNSHIP COMPLETION",
  subtitle: "This is to certify that",
  bodyTemplate: "has successfully completed the internship program in {courseName} from {startDate} to {endDate}, demonstrating consistent dedication, technical growth, and professional conduct throughout the tenure.",
  signatoryName: "Antony Sebastian",
  signatoryTitle: "Founder, StrixMind LLP",
  primaryColor: "#003e8f",
  secondaryColor: "#00d4aa",
  textColor: "#15140f",
  mutedColor: "#4b5563",
  titleY: 150,
  subtitleY: 200,
  studentNameY: 250,
  bodyY: 310,
  footerY: 120,
  qrY: 60,
  qrSize: 74,
  borderWidth: 4,
  fontFamily: "sans",
};

// ── HELPERS FOR RELATIONAL MAPPING ──

function isTableMissingError(error: any): boolean {
  if (!error) return false;
  const msg = String(error.message || "").toLowerCase();
  const code = String(error.code || "").toUpperCase();
  return (
    code === "42P01" ||
    code === "PGRST116" ||
    msg.includes("relation") && msg.includes("does not exist") ||
    msg.includes("table") && msg.includes("does not exist")
  );
}

function mapTemplateRow(row: any): CertificateTemplate {
  return {
    title: row.title ?? DEFAULT_TEMPLATE.title,
    subtitle: row.subtitle ?? DEFAULT_TEMPLATE.subtitle,
    bodyTemplate: row.body_template ?? DEFAULT_TEMPLATE.bodyTemplate,
    signatoryName: row.signatory_name ?? DEFAULT_TEMPLATE.signatoryName,
    signatoryTitle: row.signatory_title ?? DEFAULT_TEMPLATE.signatoryTitle,
    primaryColor: row.primary_color ?? DEFAULT_TEMPLATE.primaryColor,
    secondaryColor: row.secondary_color ?? DEFAULT_TEMPLATE.secondaryColor,
    textColor: row.text_color ?? DEFAULT_TEMPLATE.textColor,
    mutedColor: row.muted_color ?? DEFAULT_TEMPLATE.mutedColor,
    titleY: row.title_y ?? DEFAULT_TEMPLATE.titleY,
    subtitleY: row.subtitle_y ?? DEFAULT_TEMPLATE.subtitleY,
    studentNameY: row.student_name_y ?? DEFAULT_TEMPLATE.studentNameY,
    bodyY: row.body_y ?? DEFAULT_TEMPLATE.bodyY,
    footerY: row.footer_y ?? DEFAULT_TEMPLATE.footerY,
    qrY: row.qr_y ?? DEFAULT_TEMPLATE.qrY,
    qrSize: row.qr_size ?? DEFAULT_TEMPLATE.qrSize,
    borderWidth: row.border_width ?? DEFAULT_TEMPLATE.borderWidth,
    fontFamily: row.font_family ?? DEFAULT_TEMPLATE.fontFamily,
  };
}

function mapTemplateToRow(t: CertificateTemplate) {
  return {
    key: "certificates.template",
    title: t.title,
    subtitle: t.subtitle,
    body_template: t.bodyTemplate,
    signatory_name: t.signatoryName,
    signatory_title: t.signatoryTitle,
    primary_color: t.primaryColor,
    secondary_color: t.secondaryColor,
    text_color: t.textColor,
    muted_color: t.mutedColor,
    title_y: t.titleY ?? DEFAULT_TEMPLATE.titleY,
    subtitle_y: t.subtitleY ?? DEFAULT_TEMPLATE.subtitleY,
    student_name_y: t.studentNameY ?? DEFAULT_TEMPLATE.studentNameY,
    body_y: t.bodyY ?? DEFAULT_TEMPLATE.bodyY,
    footer_y: t.footerY ?? DEFAULT_TEMPLATE.footerY,
    qr_y: t.qrY ?? DEFAULT_TEMPLATE.qrY,
    qr_size: t.qrSize ?? DEFAULT_TEMPLATE.qrSize,
    border_width: t.borderWidth ?? DEFAULT_TEMPLATE.borderWidth,
    font_family: t.fontFamily ?? DEFAULT_TEMPLATE.fontFamily,
    updated_at: new Date().toISOString(),
  };
}

function mapStudentRow(row: any): StudentCertificate {
  return {
    id: row.id,
    studentName: row.student_name,
    courseName: row.course_name,
    startDate: row.start_date,
    endDate: row.end_date,
    issueDate: row.issue_date,
    certCode: row.cert_code,
    created_at: row.created_at,
  };
}

function mapStudentToRow(s: Partial<StudentCertificate>) {
  const row: any = {};
  if (s.id !== undefined) row.id = s.id;
  if (s.studentName !== undefined) row.student_name = s.studentName;
  if (s.courseName !== undefined) row.course_name = s.courseName;
  if (s.startDate !== undefined) row.start_date = s.startDate;
  if (s.endDate !== undefined) row.end_date = s.endDate;
  if (s.issueDate !== undefined) row.issue_date = s.issueDate;
  if (s.certCode !== undefined) row.cert_code = s.certCode;
  if (s.created_at !== undefined) row.created_at = s.created_at;
  return row;
}

// ── TEMPLATE ACTIONS ──

export async function getCertificateTemplate(): Promise<CertificateTemplate> {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("certificate_templates")
      .select("*")
      .eq("key", "certificates.template")
      .maybeSingle();

    if (error && isTableMissingError(error)) {
      const { data: legacyData } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "certificates.template")
        .maybeSingle();

      if (legacyData?.value) {
        return { ...DEFAULT_TEMPLATE, ...(legacyData.value as any) };
      }
      return DEFAULT_TEMPLATE;
    }

    if (data) {
      return mapTemplateRow(data);
    }
  } catch (e) {
    console.error("Error loading certificate template:", e);
  }
  return DEFAULT_TEMPLATE;
}

export async function updateCertificateTemplate(template: CertificateTemplate): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const row = mapTemplateToRow(template);
    const { error } = await supabase
      .from("certificate_templates")
      .upsert(row, { onConflict: "key" });

    if (error) {
      if (isTableMissingError(error)) {
        const { error: legacyError } = await supabase
          .from("site_content")
          .upsert(
            {
              key: "certificates.template",
              value: template as any,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "key" }
          );

        if (legacyError) return { success: false, error: legacyError.message };
        revalidatePath("/admin/certificates");
        return { success: true };
      }
      return { success: false, error: error.message };
    }
    revalidatePath("/admin/certificates");
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update template" };
  }
}

// ── STUDENT ACTIONS ──

export async function getCertificateStudents(): Promise<StudentCertificate[]> {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("student_certificates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error && isTableMissingError(error)) {
      const { data: legacyData } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "certificates.students")
        .maybeSingle();

      if (legacyData?.value && Array.isArray(legacyData.value)) {
        return legacyData.value as StudentCertificate[];
      }
      return [];
    }

    if (data && Array.isArray(data)) {
      return data.map(mapStudentRow);
    }
  } catch (e) {
    console.error("Error loading certificate students:", e);
  }
  return [];
}

export async function updateCertificateStudents(students: StudentCertificate[]): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const rows = students.map((s) => mapStudentToRow(s));
    
    const { error } = await supabase
      .from("student_certificates")
      .upsert(rows, { onConflict: "cert_code" });

    if (error) {
      if (isTableMissingError(error)) {
        const { error: legacyError } = await supabase
          .from("site_content")
          .upsert(
            {
              key: "certificates.students",
              value: students as any,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "key" }
          );

        if (legacyError) return { success: false, error: legacyError.message };
        revalidatePath("/admin/certificates");
        return { success: true };
      }
      return { success: false, error: error.message };
    }
    revalidatePath("/admin/certificates");
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update students list" };
  }
}

// Generate unique short code like SM-2026-XJ92K
function generateUniqueCode(existingCodes: Set<string>): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // clear of confusing chars like 1, 0, I, O
  const year = new Date().getFullYear();
  let code = "";
  let isUnique = false;

  while (!isUnique) {
    let randomPart = "";
    for (let i = 0; i < 5; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code = `SM-${year}-${randomPart}`;
    if (!existingCodes.has(code)) {
      isUnique = true;
    }
  }
  return code;
}

export async function addCertificateStudent(student: Omit<StudentCertificate, "id" | "certCode" | "created_at">): Promise<{ success: boolean; error?: string; code?: string }> {
  try {
    const students = await getCertificateStudents();
    const existingCodes = new Set(students.map((s) => s.certCode));
    const certCode = generateUniqueCode(existingCodes);

    const newStudent: StudentCertificate = {
      ...student,
      id: crypto.randomUUID(),
      certCode,
      created_at: new Date().toISOString(),
    };

    const supabase = await createClient();
    const row = mapStudentToRow(newStudent);
    const { error } = await supabase
      .from("student_certificates")
      .insert(row);

    if (error) {
      if (isTableMissingError(error)) {
        const updated = [newStudent, ...students];
        const res = await updateCertificateStudents(updated);
        if (res.success) {
          return { success: true, code: certCode };
        }
        return { success: false, error: res.error };
      }
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/certificates");
    return { success: true, code: certCode };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to add student" };
  }
}

export async function deleteCertificateStudent(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("student_certificates")
      .delete()
      .eq("id", id);

    if (error) {
      if (isTableMissingError(error)) {
        const students = await getCertificateStudents();
        const filtered = students.filter((s) => s.id !== id);
        return await updateCertificateStudents(filtered);
      }
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/certificates");
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete student" };
  }
}

export async function updateSingleStudent(id: string, updatedFields: Partial<Omit<StudentCertificate, "id" | "certCode" | "created_at">>): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const mapped = mapStudentToRow(updatedFields);
    const { error } = await supabase
      .from("student_certificates")
      .update(mapped)
      .eq("id", id);

    if (error) {
      if (isTableMissingError(error)) {
        const students = await getCertificateStudents();
        const idx = students.findIndex((s) => s.id === id);
        if (idx === -1) return { success: false, error: "Student not found" };

        students[idx] = { ...students[idx], ...updatedFields };
        return await updateCertificateStudents(students);
      }
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/certificates");
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update student" };
  }
}

// ── PUBLIC / VERIFY SECURE ACTION ──
export async function getCertificateByCode(certCode: string): Promise<{ success: boolean; certificate?: StudentCertificate; template?: CertificateTemplate; error?: string }> {
  try {
    const cleanCode = String(certCode ?? "").trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, error: "Verification code is required." };
    }

    const supabase = createStaticClient();
    const { data: studentData, error: studentError } = await supabase
      .from("student_certificates")
      .select("*")
      .eq("cert_code", cleanCode)
      .maybeSingle();

    let match: StudentCertificate | undefined;

    if (studentError && isTableMissingError(studentError)) {
      const students = await getCertificateStudents();
      match = students.find((s) => s.certCode.toUpperCase() === cleanCode);
    } else if (studentData) {
      match = mapStudentRow(studentData);
    }

    if (!match) {
      return { success: false, error: "No certificate found with this verification code." };
    }

    const template = await getCertificateTemplate();
    return { success: true, certificate: match, template };
  } catch (e) {
    return { success: false, error: "Failed to verify certificate." };
  }
}
