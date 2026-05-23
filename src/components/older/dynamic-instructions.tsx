export const DynamicInstructions = ({
  content,
  duration,
}: {
  content: string;
  duration: string;
}) => {
  return (
    <>
      <p className="w-full">
        Questions in this section of the survey inquire about your purchasing of{" "}
        <b>{content}</b>. In the questions provided, please provide responses as
        they relate to <b>{duration}</b>.
      </p>

      <p className="w-full">
        Each of the lines presented below asks <i>how many</i> of {content} you
        would buy over a certain period of time. For each line, please enter the
        amount you would consume <i>specific to that price</i>?
      </p>

      <p className="w-full">
        Sometimes the price asked will increase, sometimes it will decrease, and
        sometimes the program will ask the same question once more.
      </p>

      <p className="w-full">Please answer as accurately as you can.</p>
    </>
  );
};