import { useState } from "react";
import { AlgorithmThreshold } from "#/types/survey.ts";
import PageWrapper from "#/components/layout/page-wrapper.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import { Checkbox } from "#/components/ui/checkbox.tsx";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "#/components/ui/tabs.tsx";

// ── Shared helpers ────────────────────────────────────────────────────────────

const PLACEHOLDER_ID = "CHANGEME";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus:ring-3 focus:ring-ring/50 dark:bg-input/30";

function buildDemandUrl(
  reinforcer: string,
  showFigures: boolean,
  showDebug: boolean,
  algorithm: AlgorithmThreshold,
  maxTrials: string,
  beta: string,
  compound: boolean,
  prices: string,
): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const params = new URLSearchParams();

  if (reinforcer.trim()) params.set("reinforcer", reinforcer.trim());
  if (showFigures) params.set("figures", "true");
  if (showDebug) params.set("debug", "true");
  params.set("algo", algorithm);
  const betaNum = Math.min(0.95, Math.max(0.01, parseFloat(beta)));
  if (!isNaN(betaNum)) params.set("beta", String(betaNum));
  if (compound) params.set("compound", "true");
  if (algorithm === AlgorithmThreshold.MaximumIteration) {
    const n = parseInt(maxTrials, 10);
    if (!isNaN(n) && n !== 20) params.set("maxTrials", String(n));
  }
  if (prices.trim()) params.set("prices", prices.trim());

  return `${origin}/demand/${PLACEHOLDER_ID}?${params.toString()}`;
}

function buildDiscountingUrl(
  reinforcer: string,
  showFigures: boolean,
  showDebug: boolean,
  algorithm: AlgorithmThreshold,
  maxTrials: string,
  beta: string,
  compound: boolean,
  ssr: string,
  llr: string,
  delays: string,
): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const params = new URLSearchParams();

  if (reinforcer.trim()) params.set("reinforcer", reinforcer.trim());
  if (showFigures) params.set("figures", "true");
  if (showDebug) params.set("debug", "true");
  params.set("algo", algorithm);
  const betaNum = Math.min(0.95, Math.max(0.01, parseFloat(beta)));
  if (!isNaN(betaNum)) params.set("beta", String(betaNum));
  if (compound) params.set("compound", "true");
  if (algorithm === AlgorithmThreshold.MaximumIteration) {
    const n = parseInt(maxTrials, 10);
    if (!isNaN(n) && n !== 20) params.set("maxTrials", String(n));
  }
  const ssrNum = parseInt(ssr, 10);
  const llrNum = parseInt(llr, 10);
  if (!isNaN(ssrNum)) params.set("ssr", String(ssrNum));
  if (!isNaN(llrNum)) params.set("llr", String(llrNum));
  if (delays.trim()) params.set("delays", delays.trim());

  return `${origin}/discounting/${PLACEHOLDER_ID}/posm?${params.toString()}`;
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
      {children}
    </h3>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}

type AlgorithmSectionProps = {
  algorithm: AlgorithmThreshold;
  setAlgorithm: (v: AlgorithmThreshold) => void;
  maxTrials: string;
  setMaxTrials: (v: string) => void;
  beta: string;
  setBeta: (v: string) => void;
  compound: boolean;
  setCompound: (v: boolean) => void;
  idPrefix: string;
};

function AlgorithmSection({
  algorithm,
  setAlgorithm,
  maxTrials,
  setMaxTrials,
  beta,
  setBeta,
  compound,
  setCompound,
  idPrefix,
}: AlgorithmSectionProps) {
  return (
    <>
      <SectionHeading>Algorithm</SectionHeading>

      <FieldRow>
        <Label htmlFor={`${idPrefix}-algo`}>Stopping Rule</Label>
        <select
          id={`${idPrefix}-algo`}
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as AlgorithmThreshold)}
          className={selectClass}
        >
          <option value={AlgorithmThreshold.MaximumIteration}>
            Maximum Iterations (fixed trial count)
          </option>
          <option value={AlgorithmThreshold.RegretMin}>
            Entropy Plateau (adaptive stopping)
          </option>
        </select>
      </FieldRow>

      {algorithm === AlgorithmThreshold.MaximumIteration && (
        <FieldRow>
          <Label htmlFor={`${idPrefix}-maxtrials`}>Maximum Trials</Label>
          <Input
            id={`${idPrefix}-maxtrials`}
            type="number"
            min="4"
            max="100"
            step="1"
            value={maxTrials}
            onChange={(e) => setMaxTrials(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Default: 20. Minimum: 4.
          </p>
        </FieldRow>
      )}

      <FieldRow>
        <Label htmlFor={`${idPrefix}-beta`}>
          Beta{" "}
          <span className="font-normal text-muted-foreground">
            (suppression rate)
          </span>
        </Label>
        <Input
          id={`${idPrefix}-beta`}
          type="number"
          min="0.01"
          max="0.95"
          step="0.05"
          value={beta}
          onChange={(e) => setBeta(e.target.value)}
          placeholder="0.5"
        />
        <p className="text-xs text-muted-foreground">
          Lower values concentrate beliefs more aggressively each trial.
        </p>
      </FieldRow>

      <div className="flex items-center gap-2">
        <Checkbox
          id={`${idPrefix}-compound`}
          checked={compound}
          onCheckedChange={(v) => setCompound(v === true)}
        />
        <Label htmlFor={`${idPrefix}-compound`}>
          Compound suppression (beta<sup>turn</sup>)
        </Label>
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        When enabled, suppression accelerates each trial rather than remaining
        fixed.
      </p>
    </>
  );
}

type DiagnosticSectionProps = {
  showFigures: boolean;
  setShowFigures: (v: boolean) => void;
  showDebug: boolean;
  setShowDebug: (v: boolean) => void;
  idPrefix: string;
};

function DiagnosticSection({
  showFigures,
  setShowFigures,
  showDebug,
  setShowDebug,
  idPrefix,
}: DiagnosticSectionProps) {
  return (
    <>
      <SectionHeading>Diagnostic Options</SectionHeading>
      <p className="text-xs text-muted-foreground">
        Enable for piloting only — disable before live data collection.
      </p>
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${idPrefix}-figures`}
          checked={showFigures}
          onCheckedChange={(v) => setShowFigures(v === true)}
        />
        <Label htmlFor={`${idPrefix}-figures`}>Show diagnostic figures</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${idPrefix}-debug`}
          checked={showDebug}
          onCheckedChange={(v) => setShowDebug(v === true)}
        />
        <Label htmlFor={`${idPrefix}-debug`}>Show debug output</Label>
      </div>
    </>
  );
}

type LinkPreviewProps = {
  url: string;
};

function LinkPreview({ url }: LinkPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold">Generated Link</h2>
        <Button size="sm" variant="outline" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy to Clipboard"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Replace <code className="font-mono">{PLACEHOLDER_ID}</code> with the
        actual participant identifier before deploying.
      </p>
      <code className="select-all rounded border bg-background px-3 py-2 font-mono text-xs text-muted-foreground break-all">
        {url}
      </code>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LinkBuilderPage() {
  // ── Demand state ──────────────────────────────────────────
  const [dReinforcer, setDReinforcer] = useState("Coffee");
  const [dShowFigures, setDShowFigures] = useState(false);
  const [dShowDebug, setDShowDebug] = useState(false);
  const [dAlgorithm, setDAlgorithm] = useState<AlgorithmThreshold>(
    AlgorithmThreshold.MaximumIteration,
  );
  const [dMaxTrials, setDMaxTrials] = useState("20");
  const [dBeta, setDBeta] = useState("0.5");
  const [dCompound, setDCompound] = useState(false);
  const [dPrices, setDPrices] = useState("");

  // ── Discounting state ─────────────────────────────────────
  const [cReinforcer, setCReinforcer] = useState("Dollars");
  const [cShowFigures, setCShowFigures] = useState(false);
  const [cShowDebug, setCShowDebug] = useState(false);
  const [cAlgorithm, setCAlgorithm] = useState<AlgorithmThreshold>(
    AlgorithmThreshold.RegretMin,
  );
  const [cMaxTrials, setCMaxTrials] = useState("20");
  const [cBeta, setCBeta] = useState("0.25");
  const [cCompound, setCCompound] = useState(false);
  const [cSsr, setCsSsr] = useState("50");
  const [cLlr, setCsLlr] = useState("100");
  const [cDelays, setCDelays] = useState("");

  const demandUrl = buildDemandUrl(
    dReinforcer,
    dShowFigures,
    dShowDebug,
    dAlgorithm,
    dMaxTrials,
    dBeta,
    dCompound,
    dPrices,
  );

  const discountingUrl = buildDiscountingUrl(
    cReinforcer,
    cShowFigures,
    cShowDebug,
    cAlgorithm,
    cMaxTrials,
    cBeta,
    cCompound,
    cSsr,
    cLlr,
    cDelays,
  );

  return (
    <PageWrapper ShowHeader ShowFooter>
      <div className="flex flex-col gap-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold">Link Builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure task parameters and copy the generated launch URL for
            embedding in your survey platform. Replace{" "}
            <code className="font-mono">{PLACEHOLDER_ID}</code> in the generated
            link with the participant's identifier before deploying.
          </p>
        </div>

        <Tabs defaultValue="demand">
          <TabsList className="w-full h-11">
            <TabsTrigger value="demand" className="flex-1">
              Adaptive Purchase Task
            </TabsTrigger>
            <TabsTrigger value="discounting" className="flex-1">
              Adaptive Discounting Task
            </TabsTrigger>
          </TabsList>

          {/* ── Demand tab ────────────────────────────────── */}
          <TabsContent value="demand">
            <div className="flex flex-col gap-5 pt-2">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Left column — algorithm */}
                <div className="flex flex-col gap-4">
                  <AlgorithmSection
                    algorithm={dAlgorithm}
                    setAlgorithm={setDAlgorithm}
                    maxTrials={dMaxTrials}
                    setMaxTrials={setDMaxTrials}
                    beta={dBeta}
                    setBeta={setDBeta}
                    compound={dCompound}
                    setCompound={setDCompound}
                    idPrefix="d"
                  />
                </div>

                {/* Right column — reinforcer + price levels + diagnostics */}
                <div className="flex flex-col gap-4">
                  <SectionHeading>Reinforcer</SectionHeading>
                  <FieldRow>
                    <Label htmlFor="d-reinforcer">Reinforcer Label</Label>
                    <Input
                      id="d-reinforcer"
                      value={dReinforcer}
                      onChange={(e) => setDReinforcer(e.target.value)}
                      placeholder="e.g. Coffee"
                    />
                  </FieldRow>

                  <SectionHeading>Price Levels</SectionHeading>
                  <FieldRow>
                    <Label htmlFor="d-prices">
                      Custom Prices{" "}
                      <span className="font-normal text-muted-foreground">
                        (comma-separated, optional)
                      </span>
                    </Label>
                    <Input
                      id="d-prices"
                      value={dPrices}
                      onChange={(e) => setDPrices(e.target.value)}
                      placeholder="Leave blank for default 63-point price ladder"
                    />
                    <p className="text-xs text-muted-foreground">
                      Must contain at least 8 values if provided. Example:{" "}
                      <code className="font-mono">0.1,0.5,1,5,10,20,30,50</code>
                    </p>
                  </FieldRow>

                  <DiagnosticSection
                    showFigures={dShowFigures}
                    setShowFigures={setDShowFigures}
                    showDebug={dShowDebug}
                    setShowDebug={setDShowDebug}
                    idPrefix="d"
                  />
                </div>
              </div>

              <LinkPreview url={demandUrl} />
            </div>
          </TabsContent>

          {/* ── Discounting tab ───────────────────────────── */}
          <TabsContent value="discounting">
            <div className="flex flex-col gap-5 pt-2">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Left column — algorithm */}
                <div className="flex flex-col gap-4">
                  <AlgorithmSection
                    algorithm={cAlgorithm}
                    setAlgorithm={setCAlgorithm}
                    maxTrials={cMaxTrials}
                    setMaxTrials={setCMaxTrials}
                    beta={cBeta}
                    setBeta={setCBeta}
                    compound={cCompound}
                    setCompound={setCCompound}
                    idPrefix="c"
                  />
                </div>

                {/* Right column — reinforcer + reward values + delay levels + diagnostics */}
                <div className="flex flex-col gap-4">
                  <SectionHeading>Reinforcer</SectionHeading>
                  <FieldRow>
                    <Label htmlFor="c-reinforcer">Reinforcer Label</Label>
                    <Input
                      id="c-reinforcer"
                      value={cReinforcer}
                      onChange={(e) => setCReinforcer(e.target.value)}
                      placeholder="e.g. Dollars"
                    />
                  </FieldRow>

                  <SectionHeading>Reward Values</SectionHeading>
                  <FieldRow>
                    <Label htmlFor="c-ssr">
                      Smaller-Sooner Reinforcer (SSR)
                    </Label>
                    <Input
                      id="c-ssr"
                      type="number"
                      min="1"
                      value={cSsr}
                      onChange={(e) => setCsSsr(e.target.value)}
                    />
                  </FieldRow>
                  <FieldRow>
                    <Label htmlFor="c-llr">Larger-Later Reinforcer (LLR)</Label>
                    <Input
                      id="c-llr"
                      type="number"
                      min="1"
                      value={cLlr}
                      onChange={(e) => setCsLlr(e.target.value)}
                    />
                  </FieldRow>

                  <SectionHeading>Delay Levels</SectionHeading>
                  <FieldRow>
                    <Label htmlFor="c-delays">
                      Custom Delays{" "}
                      <span className="font-normal text-muted-foreground">
                        (comma-separated, optional)
                      </span>
                    </Label>
                    <Input
                      id="c-delays"
                      value={cDelays}
                      onChange={(e) => setCDelays(e.target.value)}
                      placeholder="Leave blank for default multi-scale delay ladder"
                    />
                    <p className="text-xs text-muted-foreground">
                      Must contain at least 8 values (days) if provided.
                      Example:{" "}
                      <code className="font-mono">
                        1,7,14,30,90,180,365,730
                      </code>
                    </p>
                  </FieldRow>

                  <DiagnosticSection
                    showFigures={cShowFigures}
                    setShowFigures={setCShowFigures}
                    showDebug={cShowDebug}
                    setShowDebug={setCShowDebug}
                    idPrefix="c"
                  />
                </div>
              </div>

              <LinkPreview url={discountingUrl} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
}
