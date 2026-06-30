import { type SchemaTypeDefinition } from "sanity";

import { introBlock } from "./blocks/introBlock";
import { imageBlock } from "./blocks/imageBlock";
import { textBlock } from "./blocks/textBlock";
import { linksBlock } from "./blocks/linksBlock";
import { homeType } from "./homeType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homeType, introBlock, imageBlock, textBlock, linksBlock],
};
