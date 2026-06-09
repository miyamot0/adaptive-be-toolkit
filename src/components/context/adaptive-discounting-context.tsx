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
            // Shallow-clone to ensure a new reference so React's useState
            // always schedules a re-render, even when the same agent instance
            // is mutated in-place before being passed here.
            setPOSM(Object.assign(Object.create(Object.getPrototypeOf(posm)), posm));
        },
    };

    return (
        <AdaptiveDiscountingContext.Provider value={startState}>{children}</AdaptiveDiscountingContext.Provider>
    );
};