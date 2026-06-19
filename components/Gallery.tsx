import type { Block } from "@/content/home";
import { IntroBlock } from "@/components/blocks/IntroBlock";
import { ImageBlock } from "@/components/blocks/ImageBlock";
import { TextBlock } from "@/components/blocks/TextBlock";
import { LinksBlock } from "@/components/blocks/LinksBlock";

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "intro":
      return <IntroBlock name={block.name} subtitle={block.subtitle} />;
    case "image":
      return (
        <ImageBlock
          src={block.src}
          alt={block.alt}
          size={block.size}
          caption={block.caption}
        />
      );
    case "text":
      return <TextBlock paragraphs={block.paragraphs} />;
    case "links":
      return <LinksBlock links={block.links} />;
    default: {
      // Exhaustiveness guard: if a new block type is added to the union
      // without a case here, TypeScript will flag it.
      const _never: never = block;
      return _never;
    }
  }
}

export function Gallery({ blocks }: { blocks: Block[] }) {
  return (
    <main
      className="flex h-screen snap-x snap-mandatory items-stretch gap-16 overflow-x-auto overflow-y-hidden px-16"
      aria-label="Painting gallery"
    >
      {blocks.map((block, index) => (
        <section
          key={index}
          className="flex shrink-0 snap-start items-center"
        >
          {renderBlock(block, index)}
        </section>
      ))}
    </main>
  );
}
