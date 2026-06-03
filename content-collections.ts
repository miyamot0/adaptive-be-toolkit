import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
import { compileMDX } from "@content-collections/mdx";

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
        date: z.string().transform((str) => new Date(str)),
    }),
    transform: async (document, context) => {
        const mdx = await compileMDX(context, document)

        return {
            ...document,
            date: new Date(document.date),
            mdx
        }
    },
});

export default defineConfig({
    content: [documentation],
});