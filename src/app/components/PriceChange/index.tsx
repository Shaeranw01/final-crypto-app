import React from "react";
import { MdArrowDropUp } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";

const PriceChange = ({ value }: { value: number }) => {
  const valueType: boolean = value >= 0;
  return (
    <div
      className={`hidden sm:flex items-center  ${
        valueType ? "text-teal-400" : "text-red-500"
      }`}
    >
      {valueType ? (
        <MdArrowDropUp className="w-8 h-8 fill-teal-400 " />
      ) : (
        <MdArrowDropDown className="w-8 h-8 fill-red-500" />
      )}
      {value?.toFixed(2)}%
    </div>
  );
};

export default PriceChange;
