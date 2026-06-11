"use client";
export default function GlobalLoading() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", flexDirection:"column" as const, alignItems:"center", justifyContent:"center", background:"rgba(216,232,229,0.92)", backdropFilter:"blur(20px)" }}>
      <div style={{ fontSize:"1.5rem", fontWeight:800, color:"#0F172A", letterSpacing:"-0.03em", marginBottom:"1.5rem" }}>
        Strix<span style={{ color:"#0A5C68" }}>Mind</span>
      </div>
      <div style={{ position:"relative", width:40, height:40 }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid rgba(10,92,104,0.15)" }} />
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid transparent", borderTopColor:"#0A5C68", borderRightColor:"#14b8a6", animation:"spin 0.8s linear infinite" }} />
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <p style={{ marginTop:"1rem", fontSize:"0.7rem", letterSpacing:"0.18em", textTransform:"uppercase" as const, color:"#64748B" }}>Loading...</p>
    </div>
  );
}
