// ── URL Builder Utilities ──────────────────────────────────────────────────────

import { AlgorithmThreshold } from "#/types/survey.js";

/**
 * Placeholder ID for participant identifiers in generated URLs.
 * Replace this with actual participant IDs before deployment.
 */
export const PLACEHOLDER_ID = "CHANGEME";

/**
 * Origin URL for demand task links.
 * Uses development server in DEV mode, production Vercel app otherwise.
 */
const DEMAND_ORIGIN = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://be-toolkit-testing.smallnstats.com";

/**
 * Origin URL for discounting task links (uses runtime window origin).
 */
function getDiscountingOrigin(): string {
  return typeof window !== "undefined" ? window.location.origin : "";
}

/**
 * Builds a demand task URL with query parameters.
 *
 * @param reinforcer - The label for the reinforcer (e.g., "Coffee")
 * @param showFigures - Whether to include diagnostic figures in the output
 * @param showDebug - Whether to include debug output
 * @param algorithm - The stopping rule algorithm to use
 * @param maxTrials - Number of trials (only used with MaximumIteration)
 * @param beta - Beta suppression rate parameter (0.01-0.95)
 * @param compound - Whether to use exponential belief suppression
 * @param prices - Custom comma-separated price values (optional)
 * @param entropyThreshold - Entropy threshold for stopping (0.00-0.5 range)
 * @returns The complete demand task URL with query parameters
 */
export function buildDemandUrl(
  reinforcer: string,
  showFigures: boolean,
  showDebug: boolean,
  algorithm: AlgorithmThreshold,
  maxTrials: string,
  beta: string,
  compound: boolean,
  prices: string,
  entropyThreshold: string,
): string {
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

  // Entropy threshold parameter (0.00-0.5 range)
  const entropyNum = parseFloat(entropyThreshold);
  if (!isNaN(entropyNum)) params.set("entropyThreshold", String(entropyNum));

  return `${DEMAND_ORIGIN}/demand/${PLACEHOLDER_ID}/posm?${params.toString()}`;
}

/**
 * Builds a discounting task URL with query parameters.
 *
 * @param reinforcer - The label for the reinforcer (e.g., "Dollars")
 * @param showFigures - Whether to include diagnostic figures in the output
 * @param showDebug - Whether to include debug output
 * @param algorithm - The stopping rule algorithm to use
 * @param maxTrials - Number of trials (only used with MaximumIteration)
 * @param beta - Beta suppression rate parameter (0.01-0.95)
 * @param compound - Whether to use exponential belief suppression
 * @param ssr - Smaller-Sooner reinforcer value
 * @param llr - Larger-Later reinforcer value
 * @param delays - Custom comma-separated delay values in days (optional)
 * @param entropyThreshold - Entropy threshold for stopping (0.00-0.5 range)
 * @returns The complete discounting task URL with query parameters
 */
export function buildDiscountingUrl(
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
  entropyThreshold: string,
): string {
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

  // Entropy threshold parameter (0.00-0.5 range)
  const entropyNum = parseFloat(entropyThreshold);
  if (!isNaN(entropyNum)) params.set("entropyThreshold", String(entropyNum));

  return `${getDiscountingOrigin()}/discounting/${PLACEHOLDER_ID}/posm?${params.toString()}`;
}
