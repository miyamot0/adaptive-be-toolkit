"use client";

import { DiscountingAgent } from "#/lib/posm/discounting/discounting-agent.ts";
import { createContext, useState, type ReactNode } from "react";

type AdaptiveDiscountingContextType = {
    POSM: DiscountingAgent;
    setPOSM: (value: DiscountingAgent) => void;
    SurveyStart: Date;
    ResponseCount: number;
    setResponseCount: (value: number) => void;
    HasFinished: boolean;
    setHasFinished: (value: boolean) => void;
    HasConfirmed: boolean;
    setHasConfirmed: (value: boolean) => void;
};

const _posmGeneric = new DiscountingAgent();

const defaultState: AdaptiveDiscountingContextType = {
    POSM: _posmGeneric,
    setPOSM: () => { },
    SurveyStart: new Date(),
    ResponseCount: -1,
    setResponseCount: () => { },
    HasFinished: false,
    setHasFinished: () => { },
    HasConfirmed: false,
    setHasConfirmed: () => { },
};

export const AdaptiveDiscountingContext = createContext<AdaptiveDiscountingContextType>(defaultState);

export const AdaptiveDiscountingContextProvider = ({ children }: { children: ReactNode }) => {
    const [discountingAgent, setPOSM] = useState(defaultState.POSM);
    const [ResponseCount, setResponseCount] = useState(0);
    const [hasFinished, setHasFinished] = useState(false);
    const [hasConfirmed, setHasConfirmed] = useState(false);

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
        HasFinished: hasFinished,
        setHasFinished: (value: boolean) => {
            setHasFinished(value);
        },
        HasConfirmed: hasConfirmed,
        setHasConfirmed: (value: boolean) => {
            setHasConfirmed(value);
        },
    };

    return (
        <AdaptiveDiscountingContext.Provider value={startState}>{children}</AdaptiveDiscountingContext.Provider>
    );
};