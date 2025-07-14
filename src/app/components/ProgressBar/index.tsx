import { getPercentage } from "@/utlis/getPercentage";

const ProgressBar = ({
  dividend,
  divisor,
  fillColor,
}: {
  dividend: number;
  divisor: number;
  fillColor: string;
}) => {
  const result = getPercentage(dividend, divisor);

  return (
    <div className={`w-[228px] rounded-xl h-1 ${fillColor} relative`}>
      <div
        className={`rounded-xl h-[100%] ${fillColor} w-[result%] opacity-40 absolute left-0 bottom-0`}
        // style={{ width: `${result}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
