"use client";

import { createContext, useState, type ReactNode } from "react";

type CommonTaskContext = {
    SurveyStart: Date;
    ResponseCount: number;
    setResponseCount: (value: number) => void;
    HasFinished: boolean;
    setHasFinished: (value: boolean) => void;
    HasConfirmed: boolean;
    setHasConfirmed: (value: boolean) => void;
};

const defaultState: CommonTaskContext = {
    SurveyStart: new Date(),
    ResponseCount: -1,
    setResponseCount: () => { },
    HasFinished: false,
    setHasFinished: () => { },
    HasConfirmed: false,
    setHasConfirmed: () => { },
};

export const CommonTaskContext = createContext<CommonTaskContext>(defaultState);

export const CommonTaskContextProvider = ({ children }: { children: ReactNode }) => {
    const [ResponseCount, setResponseCount] = useState(0);
    const [hasFinished, setHasFinished] = useState(false);
    const [hasConfirmed, setHasConfirmed] = useState(false);

    const startState: CommonTaskContext = {
        ...defaultState,
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
        <CommonTaskContext.Provider value={startState}>{children}</CommonTaskContext.Provider>
    );
};