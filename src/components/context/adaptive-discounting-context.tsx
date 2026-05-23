"use client";

import { DiscountingAgent } from "#/lib/posm/discounting/discounting-agent.ts";
import { createContext, useState, type ReactNode } from "react";

type AdaptiveDiscountingContextType = {
    POSM: DiscountingAgent;
    setPOSM: (value: DiscountingAgent) => void;
    SurveyStart: Date;
    ResponseCount: number;
    setResponseCount: (value: number) => void;
};

const _posmGeneric = new DiscountingAgent();

const defaultState: AdaptiveDiscountingContextType = {
    POSM: _posmGeneric,
    setPOSM: () => { },
    SurveyStart: new Date(),
    ResponseCount: -1,
    setResponseCount: () => { },
};

export const AdaptiveDiscountingContext = createContext<AdaptiveDiscountingContextType>(defaultState);

export const AdaptiveDiscountingContextProvider = ({ children }: { children: ReactNode }) => {
    const [discountingAgent, setPOSM] = useState(defaultState.POSM);
    const [ResponseCount, setResponseCount] = useState(0);

    const startState: AdaptiveDiscountingContextType = {
        ...defaultState,
        POSM: discountingAgent,
        setPOSM: (posm: DiscountingAgent) => {
            setPOSM(posm);
        },
        ResponseCount: ResponseCount,
        setResponseCount: (count: number) => {
            setResponseCount(count);
        },
        SurveyStart: new Date(),
    };

    return (
        <AdaptiveDiscountingContext.Provider value={startState}>{children}</AdaptiveDiscountingContext.Provider>
    );
};