// ── Link Preview Component ──────────────────────────────────────────────────────

import { toast } from "sonner";
import { Button } from "#/components/ui/button.tsx";
import { Checkbox } from "#/components/ui/checkbox.tsx";
import { Label } from "#/components/ui/label.tsx";

/**
 * Props for the LinkPreview component.
 */
interface LinkPreviewProps {
  url: string;
  showFigures: boolean;
  setShowFigures: (v: boolean) => void;
  showDebug: boolean;
  setShowDebug: (v: boolean) => void;
  idPrefix: string;
}

/**
 * Renders a preview of the generated task URL with copy/open buttons
 * and diagnostic options for piloting.
 */
export function LinkPreview({
  url,
  showFigures,
  setShowFigures,
  showDebug,
  setShowDebug,
  idPrefix,
}: LinkPreviewProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleOpen = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold">Generated Link</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleOpen}>
            Open Link
          </Button>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            Copy to Clipboard
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Replace <code className="font-mono">CHANGEME</code> with the actual
        participant identifier before deploying.
      </p>
      <code className="select-all rounded border bg-background px-3 py-2 font-mono text-xs text-muted-foreground break-all">
        {url}
      </code>
      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
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
        <p className="w-full text-xs text-muted-foreground">
          Diagnostic options are for piloting only — disable before live data
          collection.
        </p>
      </div>
    </div>
  );
}
