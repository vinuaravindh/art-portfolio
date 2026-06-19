type Props = {
  name: string;
  subtitle: string;
};

export function IntroBlock({ name, subtitle }: Props) {
  return (
    <div className="flex h-full w-[60vw] max-w-md flex-col justify-end pb-24 pl-2">
      <h1 className="font-serif text-4xl tracking-tight text-neutral-900">
        {name}
      </h1>
      <p className="mt-2 text-xs tracking-wide text-neutral-500">{subtitle}</p>
    </div>
  );
}
