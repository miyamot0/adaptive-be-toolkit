"use client";

import { POSM } from "@/lib/posm/posm";
import { createContext, useState, type ReactNode } from "react";

type AdaptiveDemandContextType = {
    POSM: POSM;
    setPOSM: (value: POSM) => void;
    SurveyStart: Date;
    ResponseCount: number;
    setResponseCount: (value: number) => void;
};

const _posmGeneric = new POSM();

const defaultState: AdaptiveDemandContextType = {
    POSM: _posmGeneric,
    setPOSM: () => { },
    SurveyStart: new Date(),
    ResponseCount: -1,
    setResponseCount: () => { },
};

export const AdaptiveDemandContext = createContext<AdaptiveDemandContextType>(defaultState);

export const AdaptiveDemandContextProvider = ({ children }: { children: ReactNode }) => {
    const [POSM, setPOSM] = useState(defaultState.POSM);
    const [ResponseCount, setResponseCount] = useState(0);

    const startState: AdaptiveDemandContextType = {
        ...defaultState,
        POSM: POSM,
        setPOSM: (posm: POSM) => {
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