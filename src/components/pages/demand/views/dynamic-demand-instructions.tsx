export const DynamicDemandInstructions = ({
  Reinforcer,
  Duration,
  Method = "posm",
  children,
}: {
  Reinforcer: string;
  Duration: string;
  Method?: string; // For future parity with discounting routes
  children: React.ReactNode;
}) => {
  return (
    <>
      <p className="w-full">
        Questions in this section of the survey inquires about your purchasing
        and consumption of{" "}
        <span className="font-bold underline">{Reinforcer}</span>. In the
        questions provided, please provide responses as they relate to your
        habits <span className="font-bold underline">{Duration}</span>.
      </p>

      <p className="w-full">
        Each of the lines presented in the the following section asks{" "}
        <span className="italic">how many</span> {Reinforcer} you would buy over{" "}
        {"DEFAULT CONSUMPTION INTERVAL"}. For each question, please enter the
        amount you would purchase and immediately consume{" "}
        <span className="italic">at that price</span>. The price points
        presented will change based on your responses and you may be asked the
        same question more than once. The assessment will conclude when
        sufficient information is provided.
      </p>

      <p className="w-full">
        If you understand the instructions, please click the "Confirm" button
        below to begin the assessment.
      </p>

      <p className="w-full">Please answer as accurately as you can.</p>

      {children}
    </>
  );
};
