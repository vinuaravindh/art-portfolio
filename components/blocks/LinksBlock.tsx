type Props = {
  links: { label: string; href: string }[];
};

export function LinksBlock({ links }: Props) {
  return (
    <nav className="flex h-full w-[20vw] max-w-[180px] flex-col justify-center gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="group flex items-center gap-1 text-sm text-neutral-700 transition-colors hover:text-neutral-950"
        >
          <span aria-hidden className="text-xs text-neutral-400 group-hover:text-neutral-700">
            ↗
          </span>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
