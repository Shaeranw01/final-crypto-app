"use client";


import Convertor from "../components/Convertor";

export default function ConvertorPage() {
  const todayDate: string = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div>
      <h2 className="text-[#DEDEDE]">Online Currency Converter</h2>
      <span className="text-[#DEDEDE]">{todayDate}</span>
      <Convertor />
    </div>
  );
}
