type Props = {
  paragraphs: string[];
};

export function TextBlock({ paragraphs }: Props) {
  return (
    <div className="flex h-full w-[46vw] max-w-2xl flex-col justify-center gap-6">
      {paragraphs.map((p, i) => (
        <p key={i} className="font-serif font-semibold text-lg leading-loose text-neutral-700">
          {p}
        </p>
      ))}
    </div>
  );
}
