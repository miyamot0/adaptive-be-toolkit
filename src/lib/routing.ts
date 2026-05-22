type DemandGeneric = "fixed-generic" | "adaptive-generic";
type DemandClinical = "fixed-clinical" | "adaptive-clinical";

export type SurveyLocation =
  | "consent"
  | "instructions"
  | "audit"
  | DemandGeneric
  | DemandClinical;
