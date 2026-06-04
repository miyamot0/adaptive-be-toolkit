export const DynamicDiscountingInstructions = ({
  Reinforcer,
  LLR,
  SSR,
  children,
}: {
  Reinforcer: string;
  LLR: number;
  SSR: number;
  children: React.ReactNode;
}) => {
  return (
    <>
      <p className="w-full">
        Questions in this section of the survey inquires about your preferences
        for receiving{" "}
        <span>
          immediate and delayed rewards in the form of{" "}
          <span className="font-bold underline">{Reinforcer}</span>
        </span>
        . This task consists of answering various questions related to your
        preference of immediate and delayed rewards that vary in reward size. In
        the questions present, select your select which option best represents
        your current preferences.
      </p>

      <p className="w-full">
        In this task, you will be presented with a series of choices consisting
        of a smaller, more immediate reward (shown on the left) and a larger,
        but delayed reward (shown on the right).{" "}
        <span className="font-bold underline">
          The smaller reward will always be {SSR} {Reinforcer}
        </span>{" "}
        and{" "}
        <span className="font-bold underline">
          the larger reward will always be {LLR} {Reinforcer}
        </span>
        . Although the size of the rewards with remain the same, the amount of
        delay to receiving the larger reward will vary from
        questions-to-question. It is possible that you may be asked the same
        question more than once and the task will cease after a certain number
        of questions are asked.{" "}
      </p>

      <p className="w-full">
        If you understand the instructions, please click the "I Understand the
        Task" button below to begin the assessment.
      </p>

      <p className="w-full">Please answer as accurately as you can.</p>

      {children}
    </>
  );
};
