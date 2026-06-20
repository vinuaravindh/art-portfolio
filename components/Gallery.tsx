"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { Block } from "@/content/home";
import { IntroBlock } from "@/components/blocks/IntroBlock";
import { ImageBlock } from "@/components/blocks/ImageBlock";
import { TextBlock } from "@/components/blocks/TextBlock";
import { LinksBlock } from "@/components/blocks/LinksBlock";
import { BasketIcon } from "@/components/BasketIcon";

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "intro":
      return <IntroBlock name={block.name} subtitle={block.subtitle} />;
    case "image":
      return (
        <ImageBlock
          src={block.src}
          alt={block.alt}
          width={block.width}
          height={block.height}
          size={block.size}
          caption={block.caption}
          hoverTitle={block.hoverTitle}
          hoverDescription={block.hoverDescription}
        />
      );
    case "text":
      return <TextBlock paragraphs={block.paragraphs} />;
    case "links":
      return <LinksBlock links={block.links} />;
    default: {
      const _never: never = block;
      return _never;
    }
  }
}

export function Gallery({ blocks }: { blocks: Block[] }) {
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

  // Track whether the intro section is still in view to toggle the sticky header
  useEffect(() => {
    const main = mainRef.current;
    const intro = sectionRefs.current[0];
    if (!main || !intro) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIntroVisible(entry.isIntersecting),
      { root: main, threshold: 0.2 }
    );
    observer.observe(intro);
    return () => observer.disconnect();
  }, []);

  const introBlock = blocks.find((b) => b.type === "intro");

  return (
    <div className="relative h-screen overflow-hidden">

      {/* Sticky header — fades in when the intro scrolls out of view */}
      <div
        className={`pointer-events-none fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6 transition-all duration-500 ease-out ${
          introVisible ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0 pointer-events-auto"
        }`}
      >
        <span className="font-serif text-lg text-neutral-800">
          {introBlock?.type === "intro" ? introBlock.name : ""}
        </span>
        <button aria-label="Open basket" className="text-neutral-700 hover:text-neutral-950 transition-colors">
          <BasketIcon className="h-6 w-6" />
        </button>
      </div>

      <main
        ref={mainRef}
        className="flex h-screen snap-x snap-proximity scroll-smooth items-stretch gap-16 overflow-x-auto overflow-y-hidden px-20"
        aria-label="Painting gallery"
      >
        {blocks.map((block, index) => (
          <section
            key={index}
            ref={(el) => { sectionRefs.current[index] = el; }}
            className="flex shrink-0 snap-center items-center"
          >
            {renderBlock(block, index)}
          </section>
        ))}
      </main>

      {/* Gallery position indicator */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-7 left-0 right-0 flex justify-center items-center gap-[6px]"
      >
        {blocks.slice(1, -1).map((_, dotIndex) => {
          const blockIndex = dotIndex + 1;
          return (
            <div
              key={blockIndex}
              className={`h-[3px] rounded-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                blockIndex === activeIndex
                  ? "w-7 bg-neutral-500"
                  : "w-[6px] bg-neutral-400/40"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
