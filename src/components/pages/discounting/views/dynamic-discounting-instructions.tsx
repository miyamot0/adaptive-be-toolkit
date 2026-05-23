export const DynamicDiscountingInstructions = ({
  Reinforcer,
  children
}: {
  Reinforcer: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <p className="w-full">
        Questions in this section of the survey inquires about your preferences for receiving
        <span className="font-bold underline">{Reinforcer}</span> in spite of delay. In the questions provided, please provide responses as
        they relate to your your current and future preferences.
      </p>

      <p className="w-full">
        Each of the lines presented in the the following section asks <span className="italic">whether you prefer</span> to receive a varying levels of  {Reinforcer} that differ in terms of the amount and the delay to receiving it. For each question, please select the option that best represents your preference. The options presented will change based on your responses and you may be asked the same question more than once. The assessment will conclude when sufficient information is provided.
      </p>

      <p className="w-full">
        If you understand the instructions, please click the "Confirm" button below to begin the assessment.
      </p>

      <p className="w-full">Please answer as accurately as you can.</p>

      {children}
    </>
  );
};