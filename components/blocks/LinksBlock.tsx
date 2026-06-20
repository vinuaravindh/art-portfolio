type Props = {
  links: { label: string; href: string }[];
};

export function LinksBlock({ links }: Props) {
  return (
    <nav className="flex h-full w-[26vw] max-w-xs flex-col justify-center gap-4">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="group flex items-center gap-2 font-serif font-semibold tracking-wide text-base text-neutral-700 transition-colors hover:text-neutral-950"
        >
          <span aria-hidden className="inline-block text-sm text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-700">
            ↗
          </span>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
