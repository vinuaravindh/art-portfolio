"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import type { Block } from "@/content/home";
import { BasketIcon } from "@/components/BasketIcon";

// =============================================================================
// MOBILE GALLERY
// =============================================================================
// A phone-tuned version of the gallery. Same swipe-right "slideshow" idea as the
// desktop view, but:
//   - Image / intro panels are full viewport width so neighbours stay hidden and
//     each painting feels immersive.
//   - Text panels are narrower, so a sliver of the previous & next image peeks in
//     on both sides — a hint that there's more to swipe to.
//   - Image titles + descriptions fade in only while their panel is centered
//     (touch has no hover), and fade away as the panel slides aside.
// Rendered only on small screens (see app/page.tsx); the desktop Gallery handles
// everything from `md` up.
// =============================================================================

// Each panel is a flex child of the scroller. Image / intro / links fill the
// viewport; text is narrower so the adjacent images peek in on both sides.
function sectionClass(block: Block) {
  const base = "flex h-full shrink-0 snap-center flex-col";
  return block.type === "text"
    ? `${base} w-[74vw] justify-center gap-5 px-2`
    : `${base} w-screen`;
}

function PanelContent({ block, active }: { block: Block; active: boolean }) {
  switch (block.type) {
    case "intro":
      return (
        <div className="relative flex h-full flex-col justify-end px-8 pb-[26vh]">
          <BasketIcon className="absolute top-[20vh] left-8 h-7 w-7 text-neutral-700" />
          <h1 className="font-serif text-5xl leading-tight text-neutral-900">{block.name}</h1>
          <p className="mt-3 font-serif text-[11px] uppercase tracking-[0.2em] text-neutral-600">
            {block.subtitle}
          </p>
        </div>
      );

    case "image": {
      const isEdge = block.size === "edge";
      const hasInfo = !isEdge && (block.hoverTitle || block.hoverDescription);
      return (
        <div className="flex h-full flex-col items-center justify-center px-5">
          <figure className="flex max-w-[90vw] flex-col items-center gap-3">
            {hasInfo && (
              <p
                className={`max-w-[90vw] text-center font-serif font-semibold text-xl text-neutral-800 transition-all duration-500 ease-out ${
                  active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                }`}
              >
                {block.hoverTitle}
              </p>
            )}

            <Image
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              sizes="90vw"
              className={`w-auto object-contain ${
                isEdge ? "max-h-[82vh] max-w-[92vw]" : "max-h-[60vh] max-w-[94vw]"
              }`}
            />

            {hasInfo && (
              <p
                className={`max-w-[90vw] whitespace-pre-line text-center font-serif text-[13px] leading-relaxed text-neutral-600 transition-all duration-500 ease-out ${
                  active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                }`}
              >
                {block.hoverDescription}
              </p>
            )}

            {block.caption && (
              <figcaption className="text-xs text-neutral-500">{block.caption}</figcaption>
            )}
          </figure>
        </div>
      );
    }

    case "text":
      return (
        <>
          {block.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-serif font-semibold text-base leading-loose text-neutral-700"
            >
              {p}
            </p>
          ))}
        </>
      );

    case "links":
      return (
        <nav className="flex h-full flex-col justify-center gap-5 px-10">
          {block.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-center gap-2 font-serif font-semibold tracking-wide text-lg text-neutral-700"
            >
              <span aria-hidden className="inline-block text-sm text-neutral-400">
                ↗
              </span>
              {link.label}
            </a>
          ))}
        </nav>
      );

    default: {
      const _never: never = block;
      return _never;
    }
  }
}

export function MobileGallery({ blocks }: { blocks: Block[] }) {
  const mainRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);

  const updateActive = useCallback(() => {
    const main = mainRef.current;
    if (!main) return;
    const center = main.scrollLeft + main.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    sectionRefs.current.forEach((section, i) => {
      if (!section) return;
      const sectionCenter = section.offsetLeft + section.offsetWidth / 2;
      const dist = Math.abs(sectionCenter - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    main.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
    return () => main.removeEventListener("scroll", updateActive);
  }, [updateActive]);

  // Smoothly settle on the panel nearest the viewport center
  const snapToNearest = useCallback(() => {
    const main = mainRef.current;
    if (!main) return;
    const center = main.scrollLeft + main.clientWidth / 2;
    let target = 0;
    let minDist = Infinity;
    sectionRefs.current.forEach((section) => {
      if (!section) return;
      const sectionCenter = section.offsetLeft + section.offsetWidth / 2;
      const dist = Math.abs(sectionCenter - center);
      if (dist < minDist) {
        minDist = dist;
        target = sectionCenter - main.clientWidth / 2;
      }
    });
    main.scrollTo({ left: target, behavior: "smooth" });
  }, []);

  // Translate vertical drag / wheel into horizontal motion, so a swipe down
  // (or up) advances the slideshow just like a horizontal swipe. Native
  // horizontal panning is left alone — touch-action:pan-x hands us only the
  // vertical axis. Swipe down → forward (right); swipe up → back (left).
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    let startX = 0;
    let startY = 0;
    let lastY = 0;
    let axis: "h" | "v" | null = null;
    let restoreTimer: number | undefined;

    // While we drive scrollLeft by hand, mandatory snap would yank every small
    // delta back to the current panel — so suspend it, then settle + restore.
    const suspendSnap = () => {
      window.clearTimeout(restoreTimer);
      main.style.scrollSnapType = "none";
    };
    const settle = () => {
      snapToNearest();
      restoreTimer = window.setTimeout(() => {
        main.style.scrollSnapType = "";
      }, 400);
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      lastY = t.clientY;
      axis = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (axis === null) {
        const dx = Math.abs(t.clientX - startX);
        const dy = Math.abs(t.clientY - startY);
        if (dx < 8 && dy < 8) return;
        axis = dy > dx ? "v" : "h";
        if (axis === "v") suspendSnap();
      }
      if (axis === "v") {
        e.preventDefault();
        main.scrollLeft += t.clientY - lastY;
      }
      lastY = t.clientY;
    };

    const onTouchEnd = () => {
      if (axis === "v") settle();
      axis = null;
    };

    let wheelTimer: number | undefined;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      suspendSnap();
      main.scrollLeft += e.deltaY;
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(settle, 90);
    };

    main.addEventListener("touchstart", onTouchStart, { passive: true });
    main.addEventListener("touchmove", onTouchMove, { passive: false });
    main.addEventListener("touchend", onTouchEnd, { passive: true });
    main.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      main.removeEventListener("touchstart", onTouchStart);
      main.removeEventListener("touchmove", onTouchMove);
      main.removeEventListener("touchend", onTouchEnd);
      main.removeEventListener("wheel", onWheel);
      window.clearTimeout(wheelTimer);
      window.clearTimeout(restoreTimer);
    };
  }, [snapToNearest]);

  // Toggle the sticky header once the intro panel scrolls out of view
  useEffect(() => {
    const main = mainRef.current;
    const intro = sectionRefs.current[0];
    if (!main || !intro) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIntroVisible(entry.isIntersecting),
      { root: main, threshold: 0.4 }
    );
    observer.observe(intro);
    return () => observer.disconnect();
  }, []);

  const introBlock = blocks.find((b) => b.type === "intro");

  return (
    <div className="relative h-[100dvh] overflow-hidden">
      {/* Sticky header — fades in once the intro scrolls away */}
      <div
        className={`pointer-events-none fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-5 transition-all duration-500 ease-out ${
          introVisible
            ? "opacity-0 -translate-y-2"
            : "opacity-100 translate-y-0 pointer-events-auto"
        }`}
      >
        <span className="font-serif text-base text-neutral-800">
          {introBlock?.type === "intro" ? introBlock.name : ""}
        </span>
        <button
          aria-label="Open basket"
          className="text-neutral-700 transition-colors hover:text-neutral-950"
        >
          <BasketIcon className="h-6 w-6" />
        </button>
      </div>

      <main
        ref={mainRef}
        className="flex h-[100dvh] snap-x snap-mandatory items-stretch gap-3 overflow-x-auto overflow-y-hidden [touch-action:pan-x] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Painting gallery"
      >
        {blocks.map((block, index) => (
          <section
            key={index}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className={sectionClass(block)}
          >
            <PanelContent block={block} active={index === activeIndex} />
          </section>
        ))}
      </main>

      {/* Swipe hint — only on the homepage, fades the moment you start moving */}
      <div
        aria-hidden
        className={`pointer-events-none absolute bottom-16 left-0 right-0 flex items-center justify-center gap-2 transition-opacity duration-500 ${
          activeIndex === 0 ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="font-serif text-xs uppercase tracking-[0.2em] text-neutral-500">
          Swipe
        </span>
        <span className="swipe-hint text-neutral-500">→</span>
      </div>

      {/* Position indicator */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-0 right-0 flex items-center justify-center gap-[6px]"
      >
        {blocks.slice(1, -1).map((_, dotIndex) => {
          const blockIndex = dotIndex + 1;
          return (
            <div
              key={blockIndex}
              className={`h-[3px] rounded-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                blockIndex === activeIndex ? "w-7 bg-neutral-500" : "w-[6px] bg-neutral-400/40"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
