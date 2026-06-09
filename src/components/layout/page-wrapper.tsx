import { cn } from "#/lib/utils.ts";
import Footer from "./footer";
import Header from "./header";

type PageWrapperProps = {
  ShowHeader?: boolean;
  ShowFooter?: boolean;
  ShowWider?: boolean;
  children: React.ReactNode;
};

const DEV = process.env.NODE_ENV === "development";

export default function PageWrapper({
  ShowHeader = false,
  ShowFooter = false,
  ShowWider = false,
  children,
}: PageWrapperProps) {
  return (
    <div
      className={cn(
        "flex flex-col w-full mx-auto gap-4",
        ShowWider ? "w-full" : "max-w-5xl",
      )}
    >
      {(DEV || ShowHeader) && <Header />}
      {children}
      {(DEV || ShowFooter) && <Footer />}
    </div>
  );
}
