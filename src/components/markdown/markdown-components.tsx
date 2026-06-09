import type { MDXComponents } from "mdx/types";

export const MarkdownComponents: MDXComponents = {
  h1: (props: any) => (
    <div className="mt-0">
      <h1 className="text-4xl font-bold tracking-tight mb-4" {...props} />
    </div>
  ),

  h2: (props: any) => (
    <h2
      className="mt-6 mb-4 text-3xl font-semibold tracking-tight"
      {...props}
    />
  ),

  h3: (props: any) => (
    <h3 className="mt-4 mb-3 text-2xl font-semibold" {...props} />
  ),

  p: (props: any) => (
    <p className="leading-7 [&:not(:first-child)]:mt-2" {...props} />
  ),

  ul: (props: any) => <ul className="my-6 ml-6 list-disc" {...props} />,

  ol: (props: any) => <ol className="my-6 ml-6 list-decimal" {...props} />,

  blockquote: (props: any) => (
    <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />
  ),

  code: (props: any) => (
    <code className="rounded bg-muted px-1.5 py-0.5 text-sm" {...props} />
  ),
};
