const prices_under_1 = [0.1, 0.5];
const prices_under_10 = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9];
const prices_above_10 = Array.from({ length: 15 }, (_, i) => i + 10);

export const DEFAULT_PRICES = [
  ...prices_under_1,
  ...prices_under_10,
  ...prices_above_10,
];

export const SURVEY_TITLE = "Study of Adaptive Decision-making Methods";
export const SURVEY_FOOTER =
  "Please direct questions to Dr. Shawn P. Gilroy (sgilroy1@lsu.edu)";
