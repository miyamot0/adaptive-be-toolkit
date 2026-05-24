import { Link } from "@tanstack/react-router";
import { buttonVariants } from "../ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) backdrop-blur-lg">
      <nav className="flex flex-wrap items-center gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 shrink-0 text-base font-semibold tracking-tight">
          Applied Behavioral Economics Toolkit
        </h2>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Link to="/documentation" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Documentation
          </Link>
        </div>
      </nav>
    </header>
  )
}
