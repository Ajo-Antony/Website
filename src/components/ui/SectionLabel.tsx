export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--accent-deep)", background:"var(--glass-bg)", padding:"0.3rem 0.875rem", borderRadius:100, marginBottom:"1.25rem" }}>
      {children}
    </div>
  );
}
