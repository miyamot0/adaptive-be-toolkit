import PageWrapper from "#/components/layout/page-wrapper.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Link } from "@tanstack/react-router";

type Props = {
  ShowHeader?: boolean;
  ShowFooter?: boolean;
  error?: string;
};

export default function HomePage({
  ShowHeader = true,
  ShowFooter = true,
  error,
}: Props) {
  return (
    <PageWrapper ShowHeader={ShowHeader} ShowFooter={ShowFooter}>
      <main className="">
        <section className="relative overflow-hidden flex flex-col gap-4">
          {error && (
            <div
              className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700"
              role="alert"
            >
              <span className="font-medium">Error: </span>
              {error}
            </div>
          )}

          <h1 className="text-2xl font-bold">Adaptive BE Toolkit</h1>

          <div className="flex flex-col gap-4">
            <p>
              Welcome to the Adaptive BE Toolkit. This platform allows you to
              explore various decision-making tasks and their applications in
              behavioral economics. Specifically, this site provides a static
              implementation of various types of decision-making tasks which can
              be loaded into existing survey-based platforms such as Qualtrics.
            </p>

            <p>
              Each task is intended to be loaded via an iframe with a
              specialized listener included on respective pages to facilitate
              communication between the iframe and the parent survey platform.
              The tasks presented here are hosted statically, with no data every
              cached or recorded. Respective identifiers are supplied by an ID
              value supplied in the link used and neither the ID or values
              produced will ever be saved.
            </p>

            <p>
              Information related to the task implementation, settings, and
              other relevant parameters can be found within the respective task
              documentation. A link to the relevant GitHub repository is
              provided{" "}
              <a
                className="font-bold underline"
                href="https://github.com/miyamot0/adaptive-be-toolkit"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4 mt-8">
          <h2 className="text-xl font-bold">Testing: Available Tasks</h2>

          <Button variant="outline" asChild>
            <Link
              className="text-sm font-medium text-primary hover:underline"
              to="/discounting/$id/$method"
              params={{ id: "12345678", method: "posm" }}
              search={{
                debug: "true",
                figures: "true",
                reinforcer: "Dollars",
                ssr: "50",
                llr: "100",
                algo: "regret-min",
                beta: "0.125",
              }}
            >
              Adaptive Discounting Task
            </Link>
          </Button>
        </section>
      </main>
    </PageWrapper>
  );
}
