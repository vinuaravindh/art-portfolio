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

  // Index of the panel whose center is nearest a given scroll position.
  const indexAtScroll = useCallback((scrollLeft: number) => {
    const main = mainRef.current;
    if (!main) return 0;
    const center = scrollLeft + main.clientWidth / 2;
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
    return closest;
  }, []);

  // Smoothly center a specific panel.
  const scrollToIndex = useCallback((i: number) => {
    const main = mainRef.current;
    const section = sectionRefs.current[i];
    if (!main || !section) return;
    main.scrollTo({
      left: section.offsetLeft + section.offsetWidth / 2 - main.clientWidth / 2,
      behavior: "smooth",
    });
  }, []);

  // One deliberate swipe = exactly one slide. We fully own the gesture (no
  // native momentum, so a light flick can't coast to the end). Either axis
  // navigates: finger LEFT or finger UP → next slide; RIGHT or DOWN → previous.
  // A swipe only commits if it travels past DIST or is flicked faster than
  // VELOCITY; otherwise it springs back to the current slide.
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const DIST = 55; // px of travel needed to commit to an adjacent slide
    const VELOCITY = 0.45; // px/ms flick speed that also commits

    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let startTime = 0;
    let startScroll = 0;
    let startIndex = 0;
    let axis: "h" | "v" | null = null;
    let restoreTimer: number | undefined;

    const lastIndex = () => sectionRefs.current.length - 1;
    const clamp = (i: number) => Math.max(0, Math.min(lastIndex(), i));

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = lastX = t.clientX;
      startY = lastY = t.clientY;
      startTime = Date.now();
      startScroll = main.scrollLeft;
      startIndex = indexAtScroll(startScroll);
      axis = null;
      window.clearTimeout(restoreTimer);
      main.style.scrollSnapType = "none"; // we drive scrollLeft while dragging
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      lastX = t.clientX;
      lastY = t.clientY;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (axis === null) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        axis = Math.abs(dy) > Math.abs(dx) ? "v" : "h";
      }
      e.preventDefault();
      // Live drag feedback. Forward (next) follows finger left / finger up,
      // so the content tracks the finger by an equal amount.
      main.scrollLeft = startScroll - (axis === "v" ? dy : dx);
    };

    const onTouchEnd = () => {
      if (axis !== null) {
        const elapsed = Math.max(1, Date.now() - startTime);
        // Positive = toward the next slide (finger moved left or up).
        const dist = axis === "v" ? startY - lastY : startX - lastX;
        const velocity = dist / elapsed;
        let target = startIndex;
        if (dist > DIST || velocity > VELOCITY) target = startIndex + 1;
        else if (dist < -DIST || velocity < -VELOCITY) target = startIndex - 1;
        scrollToIndex(clamp(target));
      }
      // Restore CSS snap once the smooth scroll has settled.
      restoreTimer = window.setTimeout(() => {
        main.style.scrollSnapType = "";
      }, 450);
      axis = null;
    };

    // Wheel / trackpad: one notch of vertical scroll advances one slide
    // (down → next), with a short lock so momentum can't skip several.
    let wheelLocked = false;
    let wheelAccum = 0;
    let wheelReset: number | undefined;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      if (wheelLocked) return;
      wheelAccum += e.deltaY;
      if (Math.abs(wheelAccum) > 30) {
        const dir = wheelAccum > 0 ? 1 : -1;
        scrollToIndex(clamp(indexAtScroll(main.scrollLeft) + dir));
        wheelAccum = 0;
        wheelLocked = true;
        window.clearTimeout(wheelReset);
        wheelReset = window.setTimeout(() => {
          wheelLocked = false;
        }, 500);
      }
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
      window.clearTimeout(restoreTimer);
      window.clearTimeout(wheelReset);
    };
  }, [indexAtScroll, scrollToIndex]);

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
        className="flex h-[100dvh] snap-x snap-mandatory items-stretch gap-3 overflow-x-auto overflow-y-hidden [touch-action:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
