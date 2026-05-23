import type { AdaptiveDemandResultBaseMessage, AdaptiveDemandResultMessage } from "#/types/iframe-message.ts";
import type { DemandAgent } from "../../../../lib/posm/demand/demand-agent";

export function NotifyParentAdaptiveDemand(POSMObject: DemandAgent, Verbose: boolean = false) {
    if (POSMObject.id === undefined) {
        throw new Error("POSMObject.id is undefined. Ensure that the DemandAgent has a valid ID before calling NotifyParentAdaptiveDemand.");
    }

    if (Verbose) {
        const message = {
            ID: POSMObject.id,
            MaxExpenditure: POSMObject.max_expend,
            MaxExpenditurePrice: POSMObject.max_expend_price,
            MaxExpenditureQuantity: POSMObject.max_q,
            Beta: POSMObject.beta,
            Responses: POSMObject.responses,
            Threshold: POSMObject.threshhold,
            Turns: POSMObject.turn,
            Levels: POSMObject.levels,
            Beliefs: POSMObject.beliefs

        } satisfies AdaptiveDemandResultMessage;

        // TODO: In a real application, you should specify the target origin instead of using '*'.
        window.parent.postMessage(message, '*');

        return;
    }

    const message = {
        ID: POSMObject.id,
        MaxExpenditure: POSMObject.max_expend,
        MaxExpenditurePrice: POSMObject.max_expend_price,
        MaxExpenditureQuantity: POSMObject.max_q,
        Beta: POSMObject.beta,

    } satisfies AdaptiveDemandResultBaseMessage;

    // TODO: Use '*' for testing, or a specific origin for security
    window.parent.postMessage(message, 'https://your-parent-site.com');
};