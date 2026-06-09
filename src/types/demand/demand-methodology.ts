// Methods

export const DemandMethodologyTypes = ['posm'] as const;

export type DemandMethodology = typeof DemandMethodologyTypes[number];