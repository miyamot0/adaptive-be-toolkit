"use client";

import { DemandAgent } from "#/lib/posm/demand/demand-agent.ts";
import { createContext, useState, type ReactNode } from "react";

type AdaptiveDemandContextType = {
    POSM: DemandAgent;
    setPOSM: (value: DemandAgent) => void;
    SurveyStart: Date;
    ResponseCount: number;
    setResponseCount: (value: number) => void;
};

const _posmGeneric = new DemandAgent();

const defaultState: AdaptiveDemandContextType = {
    POSM: _posmGeneric,
    setPOSM: () => { },
    SurveyStart: new Date(),
    ResponseCount: -1,
    setResponseCount: () => { },
};

export const AdaptiveDemandContext = createContext<AdaptiveDemandContextType>(defaultState);

export const AdaptiveDemandContextProvider = ({ children }: { children: ReactNode }) => {
    const [demandAgent, setPOSM] = useState(defaultState.POSM);
    const [ResponseCount, setResponseCount] = useState(0);

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
    };

    return (
        <AdaptiveDemandContext.Provider value={startState}>{children}</AdaptiveDemandContext.Provider>
    );
};