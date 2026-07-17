/**
 * src/hooks/useGsapAnimations.ts
 * ─────────────────────────────────────────────────────────────
 * FILE PURPOSE:
 *   Master GSAP animation hook. Reads data-strix-* attributes from
 *   the DOM and creates ScrollTrigger animations for each.
 *
 * CALLED BY:  src/components/ui/AnimationBoot.tsx  (on mount, client-side)
 *
 * ATTRIBUTES HANDLED:
 *   data-strix-slide-up      — slides element up from +40px on scroll enter
 *   data-strix-fade-up       — fades in + slight upward drift
 *   data-strix-stagger-grid  — staggers children with data-strix-grid-item
 *   data-strix-parallax="N" — parallax offset multiplier on scroll
 *   data-strix-hero-badge    — hero badge pop-in
 *   data-strix-hero-headline — GSAP word-split title reveal
 *   data-strix-hero-sub      — hero subheading fade
 *   data-strix-hero-ctas     — CTA buttons slide in
 *   data-strix-nav           — navbar compress on scroll (shrinks padding, adds bg)
 *   data-strix-tag-badge     — eyebrow label entrance animation
 *   data-strix-square-grid   — hero bottom grid wave animation
 *   strix-hero-canvas        — canvas particle network (by id, not data attr)
 * ─────────────────────────────────────────────────────────────
 */
"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// ── Lightweight line splitter (no GSAP Club needed) ──────────────────────────
// PERF NOTE: `el.innerText` forces a synchronous layout (it has to compute
// rendered line boxes to know what's actually visible). Calling this and
// then immediately writing to the DOM (el.innerHTML = "") for one element
// at a time, in a loop across many headings, is textbook layout-thrashing —
// each iteration invalidates the layout the next iteration's read has to
// recompute. Lighthouse flags this as "Forced reflow". splitLines() now
// only does the (unavoidable) layout read; all callers batch every read
// across every matched element first, then perform every DOM write
// afterwards — see batchSplitLines().
function splitLines(el: HTMLElement): string[] {
  return el.innerText.split(" ");
}

function renderSplitWords(el: HTMLElement, wordList: string[]): HTMLElement[] {
  el.innerHTML = "";
  const frag = document.createDocumentFragment();
  const words = wordList.map(word => {
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.style.overflow = "hidden";
    span.style.verticalAlign = "bottom";
    const inner = document.createElement("span");
    inner.textContent = word + " ";
    inner.style.display = "inline-block";
    span.appendChild(inner);
    frag.appendChild(span);
    return inner;
  });
  el.appendChild(frag);
  return words;
}

// Reads every element's text (layout reads only) before writing anything
// back to the DOM, so the browser does one layout pass for the reads and
// one for the writes instead of alternating read/write/read/write.
function batchSplitLines(elements: HTMLElement[]): Map<HTMLElement, HTMLElement[]> {
  const texts = elements.map(el => splitLines(el)); // all reads first
  const result = new Map<HTMLElement, HTMLElement[]>();
  elements.forEach((el, i) => {
    result.set(el, renderSplitWords(el, texts[i])); // all writes after
  });
  return result;
}

// ── Reveal-all safety net ─────────────────────────────────────────────────
// Every entrance animation below starts elements at opacity:0 and only
// brings them to opacity:1 once GSAP + ScrollTrigger fire. That's fine when
// everything loads in time, but if the CDN scripts are slow/blocked, or a
// ScrollTrigger start position gets miscalculated because content (fonts,
// CMS images) shifts layout after `ScrollTrigger.refresh()` already ran,
// affected headings/paragraphs can stay invisible forever — with no error,
// because nothing "broke", the animation is just permanently paused at its
// "from" state. That produced the washed-out/near-invisible text seen on
// several pages. This selector list covers every attribute the animations
// below can set to opacity:0, so it can be force-revealed as a fallback.
const STRIX_ANIMATED_SELECTOR = [
  "[data-strix-hero-badge]", "[data-strix-hero-sub]", "[data-strix-hero-ctas]", "[data-strix-hero-stats]",
  "[data-strix-hero-headline]",
  "[data-strix-slide-up]", "[data-strix-fade-up]",
  "[data-strix-stagger-grid] [data-strix-grid-item]",
  "[data-strix-tag-badge]", "[data-strix-panel-reveal]",
  "[data-strix-square]",
].join(", ");

function revealAllStrixAnimatedElements() {
  document.querySelectorAll<HTMLElement>(STRIX_ANIMATED_SELECTOR).forEach((el) => {
    if (parseFloat(getComputedStyle(el).opacity) < 1) {
      el.style.opacity = "1";
      el.style.transform = "none";
    }
  });
}

export function useGsapAnimations() {
  useEffect(() => {
    let cancelled = false;
    let cleanupScrollTrigger: (() => void) | null = null;

    const run = (gsap: any, ScrollTrigger: any, Lenis: any) => {
      if (cancelled) return;

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

      // ── 4 & 6. Split-word headlines (hero + section slide-ups) ─────────────
      // Both used to call splitLines() one element at a time inside their own
      // loop, each call reading layout (el.innerText) then immediately writing
      // (el.innerHTML = "") before moving to the next element — alternating
      // read/write/read/write across every heading on the page forces the
      // browser to re-run layout on every iteration. Collecting every
      // matching element first and running batchSplitLines() once does all
      // the reads together, then all the writes together, cutting this down
      // to two layout passes total instead of one per heading.
      const heroHeadline = document.querySelector<HTMLElement>("[data-strix-hero-headline]");
      const slideUpEls = Array.from(document.querySelectorAll<HTMLElement>("[data-strix-slide-up]"));
      const splitTargets = heroHeadline ? [heroHeadline, ...slideUpEls] : slideUpEls;
      const splitResults = batchSplitLines(splitTargets);

      if (heroHeadline) {
        gsap.fromTo(splitResults.get(heroHeadline),
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
      slideUpEls.forEach(el => {
        gsap.fromTo(splitResults.get(el),
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
        el.style.borderRadius = "1.5rem"; // final radius set once, not animated
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          {
            // NOTE: previously animated `borderRadius` from 3rem to 1.5rem
            // here. border-radius can't be composited — the browser has to
            // repaint the element on every scroll tick this scrollTrigger
            // fires on, which Lighthouse flags as a "non-composited
            // animation". The radius is now set to its final value up
            // front (a one-time, non-animated paint) and only y/opacity/
            // scale — all compositable — actually animate, which reads as
            // the same "settling into place" reveal.
            y: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });

      // ── 16. Sticky catchphrase: word-by-word colour reveal ─────────────────
      // NOTE: previously animated the `color` property directly, which (like
      // border-radius) forces a main-thread repaint on every scroll tick for
      // as long as the user is scrolling through this section. Animating
      // `opacity` of the same white text instead produces the same
      // dim-to-bright reveal but runs entirely on the compositor thread.
      document.querySelectorAll<HTMLElement>("[data-strix-catchphrase]").forEach(container => {
        const words = Array.from(container.querySelectorAll<HTMLElement>("[data-strix-catch-word]"));
        if (!words.length) return;
        words.forEach(w => { w.style.color = "#fff"; });
        gsap.fromTo(words,
          { opacity: 0.15 },
          {
            opacity: 1,
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
                ctx.strokeStyle = `rgba(108,99,255,${(1 - dist / 120) * 0.22})`;
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
            ctx.fillStyle = "rgba(108,99,255,0.45)";
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

      // ── 19. Late-layout safety refresh ──────────────────────────────────────
      // If images/fonts/CMS content finish loading after this initial
      // refresh, ScrollTrigger's cached start/end positions can drift,
      // causing an already-passed trigger to never fire. Re-measure once
      // everything has actually finished loading, and once more shortly
      // after (covers webfont swap + late CMS images).
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      const refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 1200);

      ScrollTrigger.refresh();
      cleanupScrollTrigger = () => {
        window.removeEventListener("load", onLoad);
        clearTimeout(refreshTimeout);
        ScrollTrigger.getAll().forEach((t: any) => t.kill());
      };
    };

    // Execute GSAP and Lenis animations directly on client mount to guarantee 
    // smooth scrolling and avoid dynamic chunk loading issues.
    run(gsap, ScrollTrigger, Lenis);

    // Hard safety net: if for any reason the animation setup never runs
    // (chunk load failure, offline, etc.), no heading or paragraph should
    // stay invisible forever.
    const revealTimeout = setTimeout(revealAllStrixAnimatedElements, 3500);

    return () => {
      cancelled = true;
      clearTimeout(revealTimeout);
      cleanupScrollTrigger?.();
    };
  }, []);
}