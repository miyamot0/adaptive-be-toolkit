import type { DiscountingResponseProvided } from "./discounting";
import type { AlgorithmThreshold, ResponseProvided } from "./survey";

export type AdaptiveDemandResultBaseMessage = {
  ID: string;
  MaxExpenditure: number;
  MaxExpenditurePrice: number;
  MaxExpenditureQuantity: number;
  Beta: number;
}

export type AdaptiveDemandResultMessage = AdaptiveDemandResultBaseMessage & {
  Responses: ResponseProvided[];
  Threshold: AlgorithmThreshold;
  Turns: number;
  Levels: number[];
  Beliefs: number[];
}

export type AdaptiveDiscountingResultBaseMessage = {
  ID: string;
  MaxDelay: number;
  Beta: number;
}

export type AdaptiveDiscountingResultMessage = AdaptiveDiscountingResultBaseMessage & {
  Responses: DiscountingResponseProvided[];
  Threshold: AlgorithmThreshold;
  Turns: number;
  Levels: number[];
  Beliefs: number[];
}

export interface IframeMessage {
  type: 'ACTION_COMPLETE';
  payload: AdaptiveDemandResultBaseMessage | AdaptiveDemandResultMessage;
}

/*
// Inside Qualtrics
window.addEventListener('message', (event: MessageEvent) => {
  // 🛡️ Security: Always verify the origin!
  if (event.origin !== 'https://your-iframe-site.com') return;

  const data = event.data as IframeMessage;

  if (data.type === 'ACTION_COMPLETE') {
    handleIframeCallback(data.payload);
  }
});

function handleIframeCallback(payload: { id: number; status: string }) {
  console.log(`Callback received for ID ${payload.id}: ${payload.status}`);
}
*/