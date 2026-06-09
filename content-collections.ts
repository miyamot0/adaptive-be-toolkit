import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import { compileMDX } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";

import rehypeSlug from "rehype-slug";
import rehypeExtractToc from "@stefanprobst/rehype-extract-toc";
import rehypeExtractTocExport from "@stefanprobst/rehype-extract-toc/mdx";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { createSlugger } from "#/lib/utils.ts";

export type TOCEntry = {
  id: string;
  text: string;
  depth: number;
};

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
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        rehypeSlug,
        rehypeExtractToc,
        rehypeExtractTocExport,
        rehypeKatex,
      ],
    });
    const slugger = createSlugger();

    const headingLines = document.content.match(/^#{2,3}\s+(.*)$/gm) || [];

    const toc = headingLines.map((line) => {
      const depth = line.match(/^#+/)?.[0].length || 2;
      const text = line.replace(/^#+\s+/, "");

      return {
        id: slugger(text),
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
