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
};

// ── TEMPLATE ACTIONS ──

export async function getCertificateTemplate(): Promise<CertificateTemplate> {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "certificates.template")
      .maybeSingle();

    if (data?.value) {
      return { ...DEFAULT_TEMPLATE, ...(data.value as any) };
    }
  } catch (e) {
    console.error("Error loading certificate template:", e);
  }
  return DEFAULT_TEMPLATE;
}

export async function updateCertificateTemplate(template: CertificateTemplate): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("site_content")
      .upsert(
        {
          key: "certificates.template",
          value: template as any,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (error) return { success: false, error: error.message };
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
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "certificates.students")
      .maybeSingle();

    if (data?.value && Array.isArray(data.value)) {
      return data.value as StudentCertificate[];
    }
  } catch (e) {
    console.error("Error loading certificate students:", e);
  }
  return [];
}

export async function updateCertificateStudents(students: StudentCertificate[]): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("site_content")
      .upsert(
        {
          key: "certificates.students",
          value: students as any,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (error) return { success: false, error: error.message };
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

    const updated = [newStudent, ...students];
    const res = await updateCertificateStudents(updated);
    if (res.success) {
      return { success: true, code: certCode };
    }
    return { success: false, error: res.error };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to add student" };
  }
}

export async function deleteCertificateStudent(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const students = await getCertificateStudents();
    const filtered = students.filter((s) => s.id !== id);
    return await updateCertificateStudents(filtered);
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete student" };
  }
}

export async function updateSingleStudent(id: string, updatedFields: Partial<Omit<StudentCertificate, "id" | "certCode" | "created_at">>): Promise<{ success: boolean; error?: string }> {
  try {
    const students = await getCertificateStudents();
    const idx = students.findIndex((s) => s.id === id);
    if (idx === -1) return { success: false, error: "Student not found" };

    students[idx] = { ...students[idx], ...updatedFields };
    return await updateCertificateStudents(students);
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update student" };
  }
}

// ── PUBLIC / VERIFY SECURE ACTION ──
// This ONLY returns the single matched certificate, completely hiding all other entries.
export async function getCertificateByCode(certCode: string): Promise<{ success: boolean; certificate?: StudentCertificate; template?: CertificateTemplate; error?: string }> {
  try {
    const cleanCode = String(certCode ?? "").trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, error: "Verification code is required." };
    }

    const students = await getCertificateStudents();
    const match = students.find((s) => s.certCode.toUpperCase() === cleanCode);

    if (!match) {
      return { success: false, error: "No certificate found with this verification code." };
    }

    const template = await getCertificateTemplate();
    return { success: true, certificate: match, template };
  } catch (e) {
    return { success: false, error: "Failed to verify certificate." };
  }
}
