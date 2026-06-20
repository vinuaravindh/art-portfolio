import { BasketIcon } from "@/components/BasketIcon";

type Props = {
  name: string;
  subtitle: string;
};

export function IntroBlock({ name, subtitle }: Props) {
  return (
    <div className="relative flex h-full w-[40vw] max-w-md flex-col justify-end pb-[30vh] pl-[5vw]">
      <BasketIcon className="absolute top-[28vh] h-8 w-8 text-neutral-700" />
      <h1 className="font-serif text-6xl leading-tight text-neutral-900">
        {name}
      </h1>
      <p className="mt-2 font-serif text-xs uppercase tracking-[0.2em] text-neutral-600">{subtitle}</p>
    </div>
  );
}
