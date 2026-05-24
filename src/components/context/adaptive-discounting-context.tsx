"use client";

import { DiscountingAgent } from "#/lib/posm/discounting/discounting-agent.ts";
import { createContext, useState, type ReactNode } from "react";

type AdaptiveDiscountingContextType = {
    POSM: DiscountingAgent;
    setPOSM: (value: DiscountingAgent) => void;
};

const _posmGeneric = new DiscountingAgent();

const defaultState: AdaptiveDiscountingContextType = {
    POSM: _posmGeneric,
    setPOSM: () => { },
};

export const AdaptiveDiscountingContext = createContext<AdaptiveDiscountingContextType>(defaultState);

export const AdaptiveDiscountingContextProvider = ({ children }: { children: ReactNode }) => {
    const [discountingAgent, setPOSM] = useState(defaultState.POSM);

    const startState: AdaptiveDiscountingContextType = {
        ...defaultState,
        POSM: discountingAgent,
        setPOSM: (posm: DiscountingAgent) => {
            setPOSM(posm);
        },
    };

    return (
        <AdaptiveDiscountingContext.Provider value={startState}>{children}</AdaptiveDiscountingContext.Provider>
    );
};