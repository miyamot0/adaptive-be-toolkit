import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

const documentation = defineCollection({
    name: "documentation",
    directory: "content/docs",
    include: "**/*.mdx",
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        content: z.string(),
        index: z.number(),
        date: z.string().transform((str) => new Date(str)),
    }),
    transform: async (document, context) => {
        const mdx = await compileMDX(context, document, {});
        return {
            ...document,
            mdx,
        };
    },
});

export default defineConfig({
    content: [documentation],
});