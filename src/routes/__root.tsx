import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import Loading from "#/components/common/loading.tsx";
import Error from "#/components/common/error.tsx";
import { Toaster } from "#/components/ui/sonner.tsx";

interface MyRouterContext {}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Adaptive BE Toolkit",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  pendingComponent: Loading,
  errorComponent: Error,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere w-full flex flex-col justify-center p-2">
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
