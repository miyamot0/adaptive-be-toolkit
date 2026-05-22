"use client";

import { POSM } from "@/lib/posm/posm";
import { shuffle_array } from "@/lib/utils";
import { createContext, useState, type ReactNode } from "react";
import { DEFAULT_FIXED_PRICES } from "#/schema/hpt-schema.ts";

const pre_tasks = ["consent", "instructions", "audit"];
const ordering_task = ["generic", "clinical"];
const demand_task = ["fixed", "adaptive"];
const post_tasks = ["intensity", "final"];

type RouteBreakdown =
    | (typeof pre_tasks)[number]
    | (typeof demand_task)[number]
    | (typeof post_tasks)[number]
    | "fixed-generic"
    | "adaptive-generic"
    | "fixed-clinical"
    | "adaptive-clinical";

type StateContextType = {
    Page: "home" | "assessment" | "results" | "error";
    setPage: (value: "home" | "assessment" | "results" | "error") => void;
    Responses: [];
    POSMGeneric: POSM;
    setPOSMGeneric: (value: POSM) => void;
    Q0Generic: number;
    setQ0Generic: (value: number) => void;
    POSMClinical: POSM;
    setPOSMClinical: (value: POSM) => void;
    Q0Clinical: number;
    setQ0Clinical: (value: number) => void;
    action: number;
    routes: RouteBreakdown[];
    route: RouteBreakdown;
    setRoute: (value: RouteBreakdown) => void;
    FixedHPTs: {
        Prices: number[];
        Generic?: number[];
        Clinical?: number[];
    };
    setFixedHPTs: (value: {
        Prices: number[];
        Generic?: number[];
        Clinical?: number[];
    }) => void;
    SurveyStart: Date;
};

const _posmGeneric = new POSM();
const _posmClinical = new POSM();

const defaultState: StateContextType = {
    Page: "home",
    setPage: () => { },
    Responses: [],
    POSMGeneric: _posmGeneric,
    setPOSMGeneric: () => { },
    Q0Generic: 0,
    setQ0Generic: () => { },
    POSMClinical: _posmClinical,
    setPOSMClinical: () => { },
    Q0Clinical: 0,
    setQ0Clinical: () => { },
    action: 0,
    routes: createDynamicRoute(),
    route: "consent",
    setRoute: () => { },
    FixedHPTs: {
        Prices: DEFAULT_FIXED_PRICES,
        Generic: [],
        Clinical: [],
    },
    setFixedHPTs: () => { },
    SurveyStart: new Date(),
};

export const StateContext = createContext<StateContextType>(defaultState);

function createDynamicRoute() {
    const demand_task_ordering_generic: RouteBreakdown[] = shuffle_array(
        demand_task
    ).map((str) => `${str}-generic`);
    const demand_task_ordering_clinical: RouteBreakdown[] = shuffle_array(
        demand_task
    ).map((str) => `${str}-clinical`);

    const task_orderings: RouteBreakdown[] =
        shuffle_array(ordering_task)[0] === "generic"
            ? [
                ...pre_tasks,
                ...demand_task_ordering_generic,
                ...demand_task_ordering_clinical,
                ...post_tasks,
            ]
            : [
                ...pre_tasks,
                ...demand_task_ordering_clinical,
                ...demand_task_ordering_generic,
                ...post_tasks,
            ];

    return task_orderings;
}

export const StateContextProvider = ({ children }: { children: ReactNode }) => {
    const [POSM_Generic, setPOSMGeneric] = useState(defaultState.POSMGeneric);
    const [POSM_Clinical, setPOSMClinical] = useState(defaultState.POSMClinical);
    const [Page, setPage] = useState(defaultState.Page);
    const [action, setAction] = useState(defaultState.action);
    const [route, setRoute] = useState(defaultState.route);
    const [fixedHPTs, setFixedHPTs] = useState(defaultState.FixedHPTs);
    const [Q0Generic, setQ0Generic] = useState(defaultState.Q0Generic);
    const [Q0Clinical, setQ0Clinical] = useState(defaultState.Q0Clinical);

    const startState: StateContextType = {
        ...defaultState,
        Page: Page,
        setPage: setPage,
        POSMGeneric: POSM_Generic,
        setPOSMGeneric: (posm: POSM) => {
            setPOSMGeneric(posm);
            setAction(action + 1);
        },
        Q0Generic: Q0Generic,
        setQ0Generic: (q0: number) => {
            setQ0Generic(q0);
        },
        POSMClinical: POSM_Clinical,
        setPOSMClinical: (posm: POSM) => {
            setPOSMClinical(posm);
            setAction(action + 1);
        },
        Q0Clinical: Q0Clinical,
        setQ0Clinical: (q0: number) => {
            setQ0Clinical(q0);
        },
        action: action,
        route,
        setRoute,
        FixedHPTs: fixedHPTs,
        setFixedHPTs: setFixedHPTs,
    };

    return (
        <StateContext.Provider value={startState}>{children}</StateContext.Provider>
    );
};