"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    Lenis: any;
  }
}

// ── Lightweight line splitter (no GSAP Club needed) ──────────────────────────
function splitLines(el: HTMLElement): HTMLElement[] {
  const text = el.innerText;
  el.innerHTML = "";
  const words = text.split(" ").map(word => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.style.display = "inline-block";
    span.style.overflow = "hidden";
    span.style.verticalAlign = "bottom";
    const inner = document.createElement("span");
    inner.textContent = word + " ";
    inner.style.display = "inline-block";
    span.innerHTML = "";
    span.appendChild(inner);
    el.appendChild(span);
    return inner;
  });
  return words;
}

export function useGsapAnimations() {
  useEffect(() => {
    const ready = () => window.gsap && window.ScrollTrigger && window.Lenis;

    const run = () => {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      const Lenis = window.Lenis;

      gsap.registerPlugin(ScrollTrigger);

      // ── 1. Lenis smooth scroll ──────────────────────────────────────────────
      const lenis = new Lenis({ duration: 1.15, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      lenis.on("scroll", ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value?: number) {
          if (arguments.length) lenis.scrollTo(value!);
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
      });

      // ── 2. Reading progress bar ─────────────────────────────────────────────
      const bar = document.getElementById("strix-progress-bar");
      if (bar) {
        gsap.to(bar, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0 },
        });
      }

      // ── 3. Navbar: compress logo on scroll ─────────────────────────────────
      const navbar = document.querySelector<HTMLElement>("[data-strix-nav]");
      const navLogo = document.querySelector<HTMLElement>("[data-strix-logo-text]");
      if (navbar && navLogo) {
        ScrollTrigger.create({
          trigger: document.body,
          start: "80px top",
          onEnter: () => { navbar.setAttribute("data-scrolled", "true"); },
          onLeaveBack: () => { navbar.removeAttribute("data-scrolled"); },
        });
      }

      // ── 4. Hero: stagger-in headline words ─────────────────────────────────
      const heroHeadline = document.querySelector<HTMLElement>("[data-strix-hero-headline]");
      if (heroHeadline) {
        const words = splitLines(heroHeadline);
        gsap.fromTo(words,
          { y: "110%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 1.1, ease: "power3.out", stagger: 0.06, delay: 0.3 }
        );
      }

      // ── 5. Hero badge & sub-copy fade up ───────────────────────────────────
      gsap.fromTo("[data-strix-hero-badge]",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo("[data-strix-hero-sub]",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", delay: 0.65 }
      );
      gsap.fromTo("[data-strix-hero-ctas]",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", delay: 0.85 }
      );
      gsap.fromTo("[data-strix-hero-stats]",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", delay: 1.05 }
      );

      // ── 6. Section headlines: slide-up on scroll ───────────────────────────
      document.querySelectorAll<HTMLElement>("[data-strix-slide-up]").forEach(el => {
        const words = splitLines(el);
        gsap.fromTo(words,
          { y: "105%", opacity: 0 },
          {
            y: "0%", opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.04,
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });

      // ── 7. Fade-up cards and elements ──────────────────────────────────────
      document.querySelectorAll<HTMLElement>("[data-strix-fade-up]").forEach((el, i) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
            delay: el.dataset.strixDelay ? parseFloat(el.dataset.strixDelay) : 0,
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });

      // ── 8. Staggered card grids ────────────────────────────────────────────
      document.querySelectorAll<HTMLElement>("[data-strix-stagger-grid]").forEach(grid => {
        const items = grid.querySelectorAll<HTMLElement>("[data-strix-grid-item]");
        gsap.fromTo(items,
          { y: 48, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.1,
            scrollTrigger: { trigger: grid, start: "top 82%", toggleActions: "play none none none" },
          }
        );
      });

      // ── 9. Process step connector lines draw in ────────────────────────────
      document.querySelectorAll<HTMLElement>("[data-strix-connector]").forEach(line => {
        gsap.fromTo(line,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 1.2, ease: "power3.inOut",
            scrollTrigger: { trigger: line, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });

      // ── 10. Step circles scale in ──────────────────────────────────────────
      document.querySelectorAll<HTMLElement>("[data-strix-step-circle]").forEach((el, i) => {
        gsap.fromTo(el,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.4)",
            delay: i * 0.15,
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });

      // ── 11. Divider lines draw in (horizontal) ─────────────────────────────
      document.querySelectorAll<HTMLElement>("[data-strix-divider-h]").forEach(el => {
        gsap.fromTo(el,
          { scaleX: 0, transformOrigin: "left center", opacity: 0 },
          {
            scaleX: 1, opacity: 1, duration: 1, ease: "power3.inOut",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
          }
        );
      });

      // ── 12. Counter number roll-up ─────────────────────────────────────────
      document.querySelectorAll<HTMLElement>("[data-strix-counter]").forEach(el => {
        const target = parseInt(el.dataset.strixCounter || "0", 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(obj.val).toString(); },
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      // ── 13. Subhead pixel-square reveal (Lithosquare style) ────────────────
      document.querySelectorAll<HTMLElement>("[data-strix-tag-badge]").forEach(el => {
        gsap.fromTo(el,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.4)",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });

      // ── 14. Parallax hero BG blobs ─────────────────────────────────────────
      document.querySelectorAll<HTMLElement>("[data-strix-parallax]").forEach(el => {
        const speed = parseFloat(el.dataset.strixParallax || "0.3");
        gsap.to(el, {
          y: () => -window.innerHeight * speed,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top top", end: "bottom top", scrub: true },
        });
      });

      // ── 15. Dark section: reveal background panel (floating card) ──────────
      document.querySelectorAll<HTMLElement>("[data-strix-panel-reveal]").forEach(el => {
        gsap.fromTo(el,
          { y: 60, opacity: 0, borderRadius: "3rem" },
          {
            y: 0, opacity: 1, borderRadius: "1.5rem", duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });

      // ── 16. Sticky catchphrase: word-by-word colour reveal ─────────────────
      document.querySelectorAll<HTMLElement>("[data-strix-catchphrase]").forEach(container => {
        const words = Array.from(container.querySelectorAll<HTMLElement>("[data-strix-catch-word]"));
        if (!words.length) return;
        gsap.fromTo(words,
          { color: "rgba(255,255,255,0.15)" },
          {
            color: "rgba(255,255,255,1)",
            stagger: 0.04,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top 60%",
              end: "bottom 40%",
              scrub: 1,
            },
          }
        );
      });

      // ── 17. Footer / hero grid squares (Lithosquare's signature grid) ──────
      document.querySelectorAll<HTMLElement>("[data-strix-square-grid]").forEach(grid => {
        const squares = Array.from(grid.querySelectorAll<HTMLElement>("[data-strix-square]"));
        // Sort by random priority for organic appearance
        const sorted = squares
          .map(s => ({ el: s, p: Math.random() }))
          .sort((a, b) => a.p - b.p);

        gsap.fromTo(sorted.map(s => s.el),
          { opacity: 0, scale: 0 },
          {
            opacity: 1, scale: 1,
            stagger: { each: 0.012, from: "random" },
            ease: "power2.out",
            duration: 0.4,
            scrollTrigger: {
              trigger: grid,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ── 18. Canvas interactive node network (hero) ─────────────────────────
      const canvas = document.getElementById("strix-hero-canvas") as HTMLCanvasElement | null;
      if (canvas) {
        const ctx = canvas.getContext("2d")!;
        let W = canvas.offsetWidth, H = canvas.offsetHeight;
        canvas.width = W; canvas.height = H;

        const NODES: { x: number; y: number; vx: number; vy: number; r: number }[] = Array.from({ length: 40 }, () => ({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2.5 + 1,
        }));

        function drawCanvas() {
          ctx.clearRect(0, 0, W, H);
          // Draw connections
          for (let i = 0; i < NODES.length; i++) {
            for (let j = i + 1; j < NODES.length; j++) {
              const dx = NODES[i].x - NODES[j].x, dy = NODES[i].y - NODES[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0,99,229,${(1 - dist / 120) * 0.25})`;
                ctx.lineWidth = 1;
                ctx.moveTo(NODES[i].x, NODES[i].y);
                ctx.lineTo(NODES[j].x, NODES[j].y);
                ctx.stroke();
              }
            }
          }
          // Draw nodes
          NODES.forEach(n => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0,99,229,0.5)";
            ctx.fill();
            // Update pos
            n.x += n.vx; n.y += n.vy;
            if (n.x < 0 || n.x > W) n.vx *= -1;
            if (n.y < 0 || n.y > H) n.vy *= -1;
          });
          requestAnimationFrame(drawCanvas);
        }
        drawCanvas();

        window.addEventListener("resize", () => {
          W = canvas.offsetWidth; H = canvas.offsetHeight;
          canvas.width = W; canvas.height = H;
        });
      }

      ScrollTrigger.refresh();
    };

    // Poll until GSAP is available (loaded via Script tags)
    let attempts = 0;
    const poll = setInterval(() => {
      attempts++;
      if (ready()) { clearInterval(poll); run(); }
      if (attempts > 50) clearInterval(poll);
    }, 100);

    return () => clearInterval(poll);
  }, []);
}
