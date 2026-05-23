import type { DiscountingAgent } from "#/lib/posm/discounting/discounting-agent.ts";
import type { AdaptiveDiscountingResultBaseMessage, AdaptiveDiscountingResultMessage } from "#/types/iframe-message.ts";

export function NotifyParentAdaptiveDiscounting(POSMObject: DiscountingAgent, Verbose: boolean = false) {
    if (POSMObject.id === undefined) {
        throw new Error("POSMObject.id is undefined. Ensure that the DiscountingAgent has a valid ID before calling NotifyParentAdaptiveDiscounting.");
    }

    if (Verbose) {
        const message = {
            ID: POSMObject.id,
            MaxDelay: POSMObject.max_wait,
            Beta: POSMObject.beta,
            Responses: POSMObject.responses,
            Threshold: POSMObject.threshhold,
            Turns: POSMObject.turn,
            Levels: POSMObject.levels,
            Beliefs: POSMObject.beliefs

        } satisfies AdaptiveDiscountingResultMessage;

        // TODO: In a real application, you should specify the target origin instead of using '*'.
        window.parent.postMessage(message, '*');

        return;
    }

    const message = {
        ID: POSMObject.id,
        MaxDelay: POSMObject.max_wait,
        Beta: POSMObject.beta,

    } satisfies AdaptiveDiscountingResultBaseMessage;

    // TODO: Use '*' for testing, or a specific origin for security
    window.parent.postMessage(message, 'https://your-parent-site.com');
};