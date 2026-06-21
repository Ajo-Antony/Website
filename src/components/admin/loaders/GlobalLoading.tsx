"use client";
import { StrixmindWordmark } from "@/components/ui/StrixmindLogo";

export default function GlobalLoading() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", flexDirection:"column" as const, alignItems:"center", justifyContent:"center", background:"rgba(238,240,251,0.92)", backdropFilter:"blur(20px)" }}>
      <div style={{ marginBottom:"1.5rem" }}>
        <StrixmindWordmark theme="light" height={28} />
      </div>
      <div style={{ position:"relative", width:40, height:40 }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid rgba(108,99,255,0.15)" }} />
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid transparent", borderTopColor:"#6c63ff", borderRightColor:"#a78bfa", animation:"spin 0.8s linear infinite" }} />
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <p style={{ marginTop:"1rem", fontSize:"0.7rem", letterSpacing:"0.18em", textTransform:"uppercase" as const, color:"#5b5478" }}>Loading...</p>
    </div>
  );
}
