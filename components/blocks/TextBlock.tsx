type Props = {
  paragraphs: string[];
};

export function TextBlock({ paragraphs }: Props) {
  return (
    <div className="flex h-full w-[34vw] max-w-xs flex-col justify-center gap-6">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-sm leading-relaxed text-neutral-700">
          {p}
        </p>
      ))}
    </div>
  );
}
