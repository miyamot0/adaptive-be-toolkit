import { allDocumentations } from "content-collections";
import { DocumentationLayout } from "./documentation-layout.tsx";

export default function DocumentationHome() {
  return (
    <DocumentationLayout docs={allDocumentations}>
      <main className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          General Information
        </h1>

        <section className="prose max-w-none">
          <p>
            Welcome to the Adaptive BE Toolkit documentation. This section
            provides an overview of general information about the toolkit,
            including what it measures, how its adaptive methods differ from
            fixed-list procedures, and who it is designed for.
          </p>

          <h2
            id="novel-features-and-capabilities"
            className="text-3xl font-semibold mt-6 mb-4"
          >
            Novel Features and Capabilities
          </h2>
          <p>
            The defining feature of the toolkit is its use of{" "}
            <strong>agent-based adaptive algorithms</strong> for both included
            measures. Rather than presenting a predetermined sequence of prices
            or delays, each task maintains a probabilistic belief distribution
            over possible response parameter values and uses that distribution
            to select the most informative stimulus for each subsequent trial.
          </p>

          <h2
            id="researcher-customization"
            className="text-3xl font-semibold mt-6 mb-4"
          >
            Researcher Customization
          </h2>
          <p>
            Researchers can customize the Adaptive BE Toolkit by configuring URL
            query parameters. These parameters allow researchers to specify
            task-specific settings such as reinforcer names, price ranges,
            delays, and more.
          </p>

          <h2
            id="survey-platform-integration"
            className="text-3xl font-semibold mt-6 mb-4"
          >
            Survey Platform Integration
          </h2>
          <p>
            The Adaptive BE Toolkit can be easily integrated into existing
            survey platforms such as Qualtrics, REDCap, and custom web studies.
            The toolkit operates entirely within the participant's browser,
            requiring no server infrastructure or data storage by the toolkit
            itself.
          </p>

          <h3
            id="qualtrics-integration"
            className="text-2xl font-semibold mt-4 mb-3"
          >
            Qualtrics Integration
          </h3>
          <p>
            To integrate the Adaptive BE Toolkit into a Qualtrics survey, follow
            these steps:
          </p>
          <ol className="list-decimal ml-6 my-6 space-y-2">
            <li>Embed an HTML iframe element in your Qualtrics survey page.</li>
            <li>
              Add a short JavaScript event listener to capture the results and
              post them back to the parent window using <code>postMessage</code>
              .
            </li>
          </ol>

          <h3
            id="redcap-integration"
            className="text-2xl font-semibold mt-4 mb-3"
          >
            REDCap Integration
          </h3>
          <p>
            The toolkit can also be embedded in REDCap surveys using a similar
            approach. Simply add an iframe element and use JavaScript to capture
            the results.
          </p>

          <h2
            id="intended-use-cases"
            className="text-3xl font-semibold mt-6 mb-4"
          >
            Intended Use Cases
          </h2>
          <p>
            The toolkit is intended for researchers studying behavioral
            phenomena that depend on demand-side measurement. Relevant
            application areas include:
          </p>
          <ul className="list-disc ml-6 my-6 space-y-2">
            <li>
              <strong>Substance use and addiction research</strong> — estimating
              the reinforcing value of substances.
            </li>
            <li>
              <strong>Consumer and health behavior research</strong> — measuring
              hypothetical demand for food, beverages, or health-related
              commodities.
            </li>
            <li>
              <strong>Behavioral pharmacology</strong> — assessing the
              reinforcing efficacy of drug or non-drug reinforcers.
            </li>
            <li>
              <strong>Intertemporal choice research</strong> — characterizing
              individual differences in delay discounting rates.
            </li>
          </ul>

          <h2
            id="intended-user-and-analyst"
            className="text-3xl font-semibold mt-6 mb-4"
          >
            Intended User and Analyst
          </h2>
          <p>
            The toolkit is designed to be accessible to researchers who have
            little or no programming experience. Configuration is handled
            entirely through URL query parameters — no code needs to be written
            inside the toolkit itself.
          </p>
        </section>

        <div className="flex flex-row justify-between items-center pt-4 border-t">
          <span className="text-sm text-muted-foreground">
            End of General Information
          </span>
        </div>
      </main>
    </DocumentationLayout>
  );
}
