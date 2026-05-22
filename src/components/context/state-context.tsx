"use client";

import { POSM } from "@/lib/posm/posm";
import { createContext, useState, type ReactNode } from "react";

type StateContextType = {
    Responses: [];
    POSMGeneric: POSM;
    setPOSMGeneric: (value: POSM) => void;
    Q0Generic: number;
    setQ0Generic: (value: number) => void;
    SurveyStart: Date;
};

const _posmGeneric = new POSM();

const defaultState: StateContextType = {
    Responses: [],
    POSMGeneric: _posmGeneric,
    setPOSMGeneric: () => { },
    Q0Generic: 0,
    setQ0Generic: () => { },
    SurveyStart: new Date(),
};

export const StateContext = createContext<StateContextType>(defaultState);

export const StateContextProvider = ({ children }: { children: ReactNode }) => {
    const [POSM_Generic, setPOSMGeneric] = useState(defaultState.POSMGeneric);
    const [Q0Generic, setQ0Generic] = useState(defaultState.Q0Generic);

    const startState: StateContextType = {
        ...defaultState,
        POSMGeneric: POSM_Generic,
        setPOSMGeneric: (posm: POSM) => {
            setPOSMGeneric(posm);
        },
        Q0Generic: Q0Generic,
        setQ0Generic: (q0: number) => {
            setQ0Generic(q0);
        },
        SurveyStart: new Date(),
    };

    return (
        <StateContext.Provider value={startState}>{children}</StateContext.Provider>
    );
};