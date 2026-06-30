import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  caption?: string;
};

const widthBySize: Record<NonNullable<Props["size"]>, string> = {
  sm: "w-[28vw] max-w-[260px]",
  md: "w-[34vw] max-w-[360px]",
  lg: "w-[44vw] max-w-[520px]",
};

export function ImageBlock({ src, alt, size = "md", caption }: Props) {
  return (
    <figure className={`flex h-full flex-col justify-center ${widthBySize[size]}`}>
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-contain"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-xs text-neutral-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
