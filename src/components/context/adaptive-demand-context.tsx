"use client";

import { DemandAgent } from "#/lib/posm/demand/demand-agent.ts";
import { createContext, useState, type ReactNode } from "react";

type AdaptiveDemandContextType = {
    POSM: DemandAgent;
    setPOSM: (value: DemandAgent) => void;
    SurveyStart: Date;
    ResponseCount: number;
    setResponseCount: (value: number) => void;
    HasFinished: boolean;
    setHasFinished: (value: boolean) => void;
    HasConfirmed: boolean;
    setHasConfirmed: (value: boolean) => void;
};

const _posmGeneric = new DemandAgent();

const defaultState: AdaptiveDemandContextType = {
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

export const AdaptiveDemandContext = createContext<AdaptiveDemandContextType>(defaultState);

export const AdaptiveDemandContextProvider = ({ children }: { children: ReactNode }) => {
    const [demandAgent, setPOSM] = useState(defaultState.POSM);
    const [ResponseCount, setResponseCount] = useState(0);
    const [hasFinished, setHasFinished] = useState(false);
    const [hasConfirmed, setHasConfirmed] = useState(false);

    const startState: AdaptiveDemandContextType = {
        ...defaultState,
        POSM: demandAgent,
        setPOSM: (posm: DemandAgent) => {
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
        <AdaptiveDemandContext.Provider value={startState}>{children}</AdaptiveDemandContext.Provider>
    );
};