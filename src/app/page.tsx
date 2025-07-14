"use client";
import { useContext, useState } from "react";

import HomeCharts from "./components/HomeChart";
import InfiniteScrollComponent from "./components/InfiniteScroll";
import { CoinDataContext } from "./context/coinDataContext";
import Convertor from "./components/Convertor";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import Carousel from "./components/Carousel";
import ComparisonChart from "./components/HomeComparison";
import ChartContainer from "./components/ChartContainer";

export default function Home() {
  // const [showConvertor, setShowConvertor] = useState<boolean>(false);
  const { showConvertor, setShowConvertor } = useContext(CoinDataContext);

  return (
    <div>
      <ThemeProvider attribute="class">
        <div className="dark:bg-[#13121A] bg-[#F3F5F9] pt-4 pl-20 pr-20 box-border">
          {/* <Navbar /> */}

          <div className="flex justify-start  p-2 box-border w-1/4  bg-[#e4e4e7]  rounded-lg dark:bg-[#191925]">
            <div
              className={`${
                !showConvertor
                  ? "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680]"
                  : "bg-white dark:bg-[#232336] text-[#424286]  dark:text-white"
              } w-60 h-14 flex justify-center items-center  rounded-lg`}
              onClick={() => setShowConvertor(!showConvertor)}
            >
              <Link href={"/"}>Coins</Link>
            </div>
            <div
              className={`${
                showConvertor
                  ? " bg-[#6161D680] text-[#424286] dark:bg-[#6161D680] dark:text-white"
                  : "bg-white dark:bg-[#232336] text-[#424286]  dark:text-white"
              } w-60 h-14 flex justify-center items-center  rounded-lg`}
            >
              <button onClick={() => setShowConvertor(!showConvertor)}>
                Convertor
              </button>
            </div>
          </div>

          {showConvertor && <Convertor />}

          {!showConvertor && <Carousel />}
          {!showConvertor && <ChartContainer />}
          {!showConvertor && <InfiniteScrollComponent />}
        </div>
      </ThemeProvider>
    </div>
  );
}
