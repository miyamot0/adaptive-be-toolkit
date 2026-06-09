import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import { compileMDX } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";

import rehypeSlug from "rehype-slug";
import rehypeExtractToc from "@stefanprobst/rehype-extract-toc";
import rehypeExtractTocExport from "@stefanprobst/rehype-extract-toc/mdx";
import { createSlugger } from "#/lib/utils.ts";

export type TOCEntry = {
  id: string;
  text: string;
  depth: number;
};

const slugify = (text: string, index: number) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const documentation = defineCollection({
  name: "documentation",
  directory: "content/docs",
  include: "**/*.mdx",
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    summary: z.string(),
    content: z.string(),
    index: z.number(),
    type: z.enum(["general", "discounting", "demand"]),
    date: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, rehypeExtractToc, rehypeExtractTocExport],
    });
    const slugger = createSlugger();

    const headingLines = document.content.match(/^#{2,3}\s+(.*)$/gm) || [];

    /*
    const toc = headingLines.map((line, index) => {
      const depth = line.match(/^#+/)?.[0].length || 2;
      const text = line.replace(/^#+\s+/, "");
      return { id: slugify(text, index), text, depth } satisfies TOCEntry;
    } );
    */

    const toc = headingLines.map((line) => {
      const depth = line.match(/^#+/)?.[0].length || 2;
      const text = line.replace(/^#+\s+/, "");

      return {
        id: slugger(text), // Automatically generates 'my-heading', 'my-heading-1', etc.
        text,
        depth,
      };
    });

    return {
      ...document,
      mdx,
      toc,
    };
  },
});

export default defineConfig({
  content: [documentation],
});
