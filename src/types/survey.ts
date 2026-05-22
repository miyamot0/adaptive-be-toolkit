export type ResponseProvided = {
    Price: number;
    Quantity: number;
    Revenue: number;
};

export type PastQuestionType = ResponseProvided & { index: number };

export type RedCAPPayloadObject = {
    record_id: string; // This is the unique identifier for the record in REDCap
    lsu_number: string; // SONA credit id

    audit_q1: string;
    audit_q2: string;
    audit_q3: string;

    hpt_fixed_generic: string;
    hpt_dynamic_generic: string;
    hpt_dynamic_q0_generic: string;

    hpt_fixed_clinical: string;
    hpt_dynamic_clinical: string;
    hpt_dynamic_q0_clinical: string;

    duration: string;
    save_date: string;
    form_1_complete: number;
};

export type SuccessfulREDCAPResponse = {
    count: number;
};

export type UnsuccessfulREDCAPResponse = {
    error: string;
};

export type REDCAPResponse =
    | SuccessfulREDCAPResponse
    | UnsuccessfulREDCAPResponse;

export type Margins = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};

export enum AlgorithmThreshold {
    None = "None",
    MaximumIteration = "MaximumIteration",
    RegretMin = "RegretMin",
}