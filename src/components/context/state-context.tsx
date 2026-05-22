"use client";

import { POSM } from "@/lib/posm/posm";
import { createContext, useState, type ReactNode } from "react";

type StateContextType = {
    POSMGeneric: POSM;
    setPOSMGeneric: (value: POSM) => void;
    Q0Generic: number;
    setQ0Generic: (value: number) => void;
    SurveyStart: Date;
    ResponseCount: number;
    setResponseCount: (value: number) => void;
    SurveyUpdate: Date;
    SetSurveyUpdate: (value: Date) => void;
};

const _posmGeneric = new POSM();

const defaultState: StateContextType = {
    POSMGeneric: _posmGeneric,
    setPOSMGeneric: () => { },
    Q0Generic: 0,
    setQ0Generic: () => { },
    SurveyStart: new Date(),
    ResponseCount: -1,
    setResponseCount: () => { },
    SurveyUpdate: new Date(),
    SetSurveyUpdate: () => { },
};

export const StateContext = createContext<StateContextType>(defaultState);

export const StateContextProvider = ({ children }: { children: ReactNode }) => {
    const [POSM_Generic, setPOSMGeneric] = useState(defaultState.POSMGeneric);
    const [Q0Generic, setQ0Generic] = useState(defaultState.Q0Generic);
    const [ResponseCount, setResponseCount] = useState(0);
    const [SurveyUpdate, SetSurveyUpdate] = useState(new Date());

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
        ResponseCount: ResponseCount,
        setResponseCount: (count: number) => {
            setResponseCount(count);
        },
        SurveyStart: new Date(),
        SurveyUpdate: SurveyUpdate,
        SetSurveyUpdate: (date: Date) => {
            SetSurveyUpdate(date);
        },
    };

    return (
        <StateContext.Provider value={startState}>{children}</StateContext.Provider>
    );
};