"use client";

import { DemandAgent } from "#/lib/posm/demand/demand-agent.ts";
import { createContext, useState } from "react";
import type { ReactNode } from "react";

type AdaptiveDemandContextType = {
  POSM: DemandAgent;
  setPOSM: (value: DemandAgent) => void;
};

const _posmGeneric = new DemandAgent();

const defaultState: AdaptiveDemandContextType = {
  POSM: _posmGeneric,
  setPOSM: () => {},
};

export const AdaptiveDemandContext =
  createContext<AdaptiveDemandContextType>(defaultState);

export const AdaptiveDemandContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [demandAgent, setPOSM] = useState(defaultState.POSM);

  const startState: AdaptiveDemandContextType = {
    ...defaultState,
    POSM: demandAgent,
    setPOSM: (posm: DemandAgent) => {
      setPOSM(posm);
    },
  };

  return (
    <AdaptiveDemandContext.Provider value={startState}>
      {children}
    </AdaptiveDemandContext.Provider>
  );
};
