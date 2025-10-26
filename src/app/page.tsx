"use client";
import { useContext } from "react";
import InfiniteScrollComponent from "./components/InfiniteScroll";
import { CoinDataContext } from "./context/coinDataContext";
import Convertor from "./components/Convertor";
import Link from "next/link";
import Carousel from "./components/Carousel";
import ChartContainer from "./components/ChartContainer";

export default function Home() {
  const { showConvertor, setShowConvertor } = useContext(CoinDataContext);

  return (
    <div>
      <div className="dark:bg-[#13121A] bg-[#F3F5F9] box-border px-4 sm:px-8 md:px-12 lg:px-20 py-5">
        <div className="hidden sm:flex justify-start  p-2 box-border w-1/4  bg-[#e4e4e7]  rounded-lg dark:bg-[#191925]">
          <div
            className={`${
              showConvertor === false
                ? "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680]"
                : "bg-white dark:bg-[#232336] text-[#424286]  dark:text-white"
            } w-60 h-14 flex justify-center items-center  rounded-lg`}
            onClick={() => setShowConvertor(false)}
          >
            <Link href={"/"}>Coins</Link>
          </div>
          <div
            className={`${
              showConvertor === true
                ? " bg-[#6161D680] text-[#424286] dark:bg-[#6161D680] dark:text-white"
                : "bg-white dark:bg-[#232336] text-[#424286]  dark:text-white"
            } w-60 h-14 flex justify-center items-center  rounded-lg`}
          >
            <button onClick={() => setShowConvertor(true)}>
              <Link href={"/convertor"}>Convertor</Link>
            </button>
          </div>
        </div>

        {/* {showConvertor && <Convertor />} */}

        {!showConvertor && <Carousel />}
        {!showConvertor && <ChartContainer />}
        {!showConvertor && <InfiniteScrollComponent />}
      </div>
    </div>
  );
}
