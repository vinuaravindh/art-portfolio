"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  size?: "sm" | "md" | "lg" | "edge";
  caption?: string;
  hoverTitle?: string;
  hoverDescription?: string;
};

const imageClampBySize: Record<NonNullable<Props["size"]>, string> = {
  sm: "max-h-[50vh] max-w-[28vw]",
  md: "max-h-[62vh] max-w-[38vw]",
  lg: "max-h-[68vh] max-w-[50vw]",
  edge: "h-screen max-h-screen",
};

export function ImageBlock({ src, alt, width, height, size = "md", caption, hoverTitle, hoverDescription }: Props) {
  const isEdge = size === "edge";
  const hasInfo = !isEdge && (hoverTitle || hoverDescription);

  // Measure the image's actual rendered width so title/description are exactly
  // as wide as the painting — necessary because max-h can make a portrait
  // image narrower than max-w, which CSS alone can't detect at layout time.
  const imgRef = useRef<HTMLImageElement>(null);
  const [renderedWidth, setRenderedWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!hasInfo) return;
    const img = imgRef.current;
    if (!img) return;

    const measure = () => setRenderedWidth(img.offsetWidth);
    const ro = new ResizeObserver(measure);
    ro.observe(img);
    if (img.complete) measure();
    else img.addEventListener("load", measure, { once: true });

    return () => ro.disconnect();
  }, [hasInfo]);

  const textStyle = renderedWidth ? { width: renderedWidth } : undefined;

  return (
    <figure className={`group flex ${isEdge ? "h-screen" : "h-full"} flex-col justify-center gap-3`}>

      {hasInfo && (
        <p
          style={textStyle}
          className="font-serif font-semibold text-2xl text-neutral-800 opacity-0 -translate-y-1 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0"
        >
          {hoverTitle}
        </p>
      )}

      <div className={isEdge ? "h-full" : ""}>
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={isEdge ? "60vw" : "(max-width: 768px) 50vw, 40vw"}
          className={`${isEdge ? "w-auto object-cover" : "w-auto h-auto object-contain"} ${imageClampBySize[size]}`}
        />
      </div>

      {hasInfo && (
        <p
          style={textStyle}
          className="font-serif text-sm text-neutral-600 whitespace-pre-line leading-relaxed opacity-0 translate-y-1 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0"
        >
          {hoverDescription}
        </p>
      )}

      {caption ? (
        <figcaption className="text-xs text-neutral-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
