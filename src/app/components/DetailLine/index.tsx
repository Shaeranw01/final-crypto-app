import formatCompactNumber from "@/utlis/getFormattedPrice";
import { IoAddCircleSharp } from "react-icons/io5";
import { ReactElement } from "react";

const DetailLine = ({
  text,
  value,
  symbol,
}: {
  text: string;
  value: number;
  symbol: ReactElement;
}) => {
  const safeValue =
    typeof value === "number" && !isNaN(value) ? value : undefined;
  return (
    <div className="w-96 h-6 flex gap-3">
      <IoAddCircleSharp className="w-6 h-6 fill-[#7878FA] " />

      <div className="w-44  font-normal text-base">{text}</div>
      <div className="w-44 font-medium text-lg flex items-center gap-1">
        <span>{symbol}</span>
        <span className="inline sm:hidden">
          {safeValue !== undefined ? formatCompactNumber(safeValue) : "—"}
        </span>
        <span className="hidden sm:inline">
          {" "}
          {safeValue !== undefined ? safeValue.toLocaleString() : "—"}
        </span>
      </div>
    </div>
  );
};

export default DetailLine;
