import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import { compileMDX } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";

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
        const mdx = await compileMDX(context, document, { remarkPlugins: [remarkGfm] })

        return {
            ...document,
            mdx
        }
    },
});

export default defineConfig({
    content: [documentation],
});