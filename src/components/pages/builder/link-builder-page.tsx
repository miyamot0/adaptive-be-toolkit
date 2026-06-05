import { useState } from "react";
import { AlgorithmThreshold } from "#/types/survey.ts";
import PageWrapper from "#/components/layout/page-wrapper.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import { Checkbox } from "#/components/ui/checkbox.tsx";

type TaskType = "demand" | "discounting";

function buildUrl(
  task: TaskType,
  participantId: string,
  reinforcer: string,
  showFigures: boolean,
  showDebug: boolean,
  algorithm: AlgorithmThreshold,
  beta: string,
  compound: boolean,
  prices: string,
  ssr: string,
  llr: string,
): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  const params = new URLSearchParams();

  if (reinforcer.trim()) params.set("reinforcer", reinforcer.trim());
  if (showFigures) params.set("figures", "true");
  if (showDebug) params.set("debug", "true");
  params.set("algo", algorithm);
  const betaNum = parseFloat(beta);
  if (!isNaN(betaNum)) params.set("beta", String(betaNum));
  if (compound) params.set("compound", "true");

  if (task === "discounting") {
    const ssrNum = parseInt(ssr, 10);
    const llrNum = parseInt(llr, 10);
    if (!isNaN(ssrNum)) params.set("ssr", String(ssrNum));
    if (!isNaN(llrNum)) params.set("llr", String(llrNum));
    return `${origin}/discounting/${participantId}/posm?${params.toString()}`;
  } else {
    if (prices.trim()) params.set("prices", prices.trim());
    return `${origin}/demand/${participantId}?${params.toString()}`;
  }
}

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus:ring-3 focus:ring-ring/50 dark:bg-input/30";

export default function LinkBuilderPage() {
  const [task, setTask] = useState<TaskType>("demand");
  const [participantId, setParticipantId] = useState("participant001");
  const [reinforcer, setReinforcer] = useState("Coffee");
  const [showFigures, setShowFigures] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [algorithm, setAlgorithm] = useState<AlgorithmThreshold>(
    AlgorithmThreshold.MaximumIteration,
  );
  const [beta, setBeta] = useState("0.5");
  const [compound, setCompound] = useState(false);

  // Demand-specific
  const [prices, setPrices] = useState("");

  // Discounting-specific
  const [ssr, setSsr] = useState("50");
  const [llr, setLlr] = useState("100");

  const [copied, setCopied] = useState(false);

  const idValid = participantId.length >= 6;

  const url = idValid
    ? buildUrl(
        task,
        participantId,
        reinforcer,
        showFigures,
        showDebug,
        algorithm,
        beta,
        compound,
        prices,
        ssr,
        llr,
      )
    : "";

  const handleCopy = async () => {
    if (!idValid) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageWrapper ShowHeader ShowFooter>
      <div className="flex flex-col gap-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold">Link Builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure task parameters and copy the generated launch URL for
            embedding in your survey platform.
          </p>
        </div>

        {/* Task type toggle */}
        <div className="flex flex-col gap-2">
          <Label>Task Type</Label>
          <div className="flex gap-2">
            <Button
              variant={task === "demand" ? "default" : "outline"}
              size="sm"
              onClick={() => setTask("demand")}
            >
              Adaptive Purchase Task
            </Button>
            <Button
              variant={task === "discounting" ? "default" : "outline"}
              size="sm"
              onClick={() => setTask("discounting")}
            >
              Adaptive Discounting Task
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* ── Left column ── */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold">Session</h2>

            {/* Participant ID */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pid">
                Participant ID{" "}
                <span className="font-normal text-muted-foreground">
                  (min. 6 characters)
                </span>
              </Label>
              <Input
                id="pid"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                aria-invalid={!idValid}
                placeholder="e.g. participant001"
              />
              {!idValid && (
                <p className="text-xs text-destructive">
                  ID must be at least 6 characters.
                </p>
              )}
            </div>

            {/* Reinforcer */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reinforcer">Reinforcer</Label>
              <Input
                id="reinforcer"
                value={reinforcer}
                onChange={(e) => setReinforcer(e.target.value)}
                placeholder="e.g. Coffee"
              />
            </div>

            <h2 className="mt-2 text-base font-semibold">Algorithm</h2>

            {/* Stopping rule */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="algo">Stopping Rule</Label>
              <select
                id="algo"
                value={algorithm}
                onChange={(e) =>
                  setAlgorithm(e.target.value as AlgorithmThreshold)
                }
                className={selectClass}
              >
                <option value={AlgorithmThreshold.MaximumIteration}>
                  Maximum Iterations (fixed 20 trials)
                </option>
                <option value={AlgorithmThreshold.RegretMin}>
                  Entropy Plateau (adaptive stopping)
                </option>
              </select>
            </div>

            {/* Beta */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="beta">Beta (suppression rate)</Label>
              <Input
                id="beta"
                type="number"
                min="0.01"
                max="1"
                step="0.05"
                value={beta}
                onChange={(e) => setBeta(e.target.value)}
                placeholder="0.5"
              />
              <p className="text-xs text-muted-foreground">
                Lower values focus beliefs more aggressively. Default: 0.5
                (demand), 0.25 (discounting).
              </p>
            </div>

            {/* Compound suppression */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="compound"
                checked={compound}
                onCheckedChange={(v) => setCompound(v === true)}
              />
              <Label htmlFor="compound">
                Compound suppression (beta
                <sup>turn</sup>)
              </Label>
            </div>

            {/* ── Discounting-specific ── */}
            {task === "discounting" && (
              <>
                <h2 className="mt-2 text-base font-semibold">
                  Discounting Settings
                </h2>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ssr">
                    Smaller-Sooner Reinforcer (SSR)
                  </Label>
                  <Input
                    id="ssr"
                    type="number"
                    min="1"
                    value={ssr}
                    onChange={(e) => setSsr(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="llr">
                    Larger-Later Reinforcer (LLR)
                  </Label>
                  <Input
                    id="llr"
                    type="number"
                    min="1"
                    value={llr}
                    onChange={(e) => setLlr(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ── Demand-specific ── */}
            {task === "demand" && (
              <>
                <h2 className="mt-2 text-base font-semibold">
                  Demand Settings
                </h2>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="prices">
                    Custom Prices{" "}
                    <span className="font-normal text-muted-foreground">
                      (comma-separated, optional)
                    </span>
                  </Label>
                  <Input
                    id="prices"
                    value={prices}
                    onChange={(e) => setPrices(e.target.value)}
                    placeholder="Leave blank for default 63-point price ladder"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must contain at least 8 values if provided. Example:{" "}
                    <code className="font-mono">0.1,0.5,1,5,10,20,30,50</code>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* ── Right column: diagnostic options ── */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold">Diagnostic Options</h2>
            <p className="text-xs text-muted-foreground">
              Enable for piloting and development only. Disable before live
              data collection.
            </p>

            <div className="flex items-center gap-2">
              <Checkbox
                id="figures"
                checked={showFigures}
                onCheckedChange={(v) => setShowFigures(v === true)}
              />
              <Label htmlFor="figures">Show diagnostic figures</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="debugout"
                checked={showDebug}
                onCheckedChange={(v) => setShowDebug(v === true)}
              />
              <Label htmlFor="debugout">Show debug output</Label>
            </div>
          </div>
        </div>

        {/* ── URL Preview ── */}
        <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Generated Link</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              disabled={!idValid}
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
          </div>

          <code className="select-all rounded border bg-background px-3 py-2 font-mono text-xs text-muted-foreground break-all">
            {idValid ? (
              url
            ) : (
              <span className="text-destructive">
                Enter a valid participant ID (≥ 6 characters) to generate
                the link.
              </span>
            )}
          </code>
        </div>
      </div>
    </PageWrapper>
  );
}
