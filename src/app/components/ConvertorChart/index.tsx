"use client";

import "chart.js/auto";
import dynamic from "next/dynamic";
import { useContext, useState, useEffect } from "react";
import { Coin } from "@/interfaces/Coininterface";
import { BsAspectRatio } from "react-icons/bs";
import { Line } from "react-chartjs-2";
import { useCoinContext } from "@/app/hooks/useCoinContext";
import { ScriptableContext } from "chart.js/auto";
import { ChartArea } from "chart.js/auto";

const ConvertorChart = ({
  fromCoin,
  toCoin,
}: {
  fromCoin: Coin;
  toCoin: Coin;
}) => {
  const [priceData, setPriceData] = useState({
    displayData: [] as number[],
    timeData: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { debouncedCurrency } = useCoinContext();
  const [isClicked, setClicked] = useState("30d");
  type TimeRange = "1d" | "7d" | "14d" | "30d" | "365d";

  const intervals: Record<TimeRange, { days: number; interval: string }> = {
    "1d": {
      days: 1,
      interval: "daily",
    },
    "7d": {
      days: 7,
      interval: "daily",
    },
    "14d": {
      days: 14,
      interval: "daily",
    },
    "30d": {
      days: 30,
      interval: "daily",
    },
    "365d": {
      days: 365,
      interval: "daily",
    },
  };

  async function getData(time: TimeRange, coinId1: string, coinId2: string) {
    const { days, interval } = intervals[time];
    setLoading(true);
    setError(null);

    try {
      const [res1, res2] = await Promise.all([
        fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId1}/market_chart?vs_currency=${debouncedCurrency}&days=${days}&interval=${interval}`
        ),
        fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId2}/market_chart?vs_currency=${debouncedCurrency}&days=${days}&interval=${interval}`
        ),
      ]);

      if (!res1.ok || !res2.ok) {
        throw new Error("Failed to fetch chart data. Please try again later.");
      }

      const [json1, json2] = await Promise.all([res1.json(), res2.json()]);

      if (!json1?.prices || !json2?.prices) {
        throw new Error("Incomplete data received from API.");
      }
      console.log("converrtor time", json1.prices);
      const timeArray = json1.prices.map((p: number[]) =>
        new Date(p[0]).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      );

      const priceData1 = json1.prices.map((p: number[]) => p[1]);
      const priceData2 = json2.prices.map((p: number[]) => p[1]);

      const ratioData = priceData1.map((val: number, idx: number) => {
        const denom = priceData2[idx] || 1;
        return val / denom;
      });

      setPriceData({
        displayData: ratioData,
        timeData: timeArray,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong fetching chart data.");
    } finally {
      setLoading(false);
    }
  }

  //   getData("30d", fromCoin?.id, toCoin?.id);
  useEffect(() => {
    if (fromCoin?.id && toCoin?.id) {
      getData("30d", fromCoin.id, toCoin.id);
    }
  }, [fromCoin.id, toCoin.id, debouncedCurrency]);

  const label = priceData.timeData;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        // beginAtZero: true,
        // display: false,
        beginAtZero: true,
        ticks: { display: false, min: 0 },
        grid: {
          drawTicks: false,
          display: false,
        },
      },

      x: {
        ticks: {
          display: true,
          padding: 0,
          callback: function (
            this: import("chart.js").Scale, // ✅ explicitly declare `this`
            tickValue: string | number,
            index: number,
            ticks: any[]
          ) {
            const label = this.getLabelForValue(tickValue as number) as string;

            if (label.includes(" ")) return label.split(" ")[1];

            const date = new Date(label);
            if (!isNaN(date.getTime())) return date.getDate().toString();

            return label;
          },
          minRotation: 0, // 👈 prevent slant
          maxRotation: 0, // 👈 prevent slant
          autoSkip: true, // ✅ automatically skips labels to avoid crowding
          maxTicksLimit: 25, // max number of ticks shown
        },
        grid: {
          drawTicks: false,
          display: false,
        },
      },
    },
  };

  const data = {
    labels: label,
    datasets: [
      {
        data: priceData.displayData,
        backgroundColor: function (context: ScriptableContext<"line">) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          // This case happens on initial chart load
          if (!chartArea) return;
          return getGradient(ctx, chartArea, "#7878FA");
        },
        borderColor: "#7878FA",

        borderWidth: 1,

        tension: 0.4, //to create a curved chart instead of a straight line
        pointRadius: 0, // to remove the dots
        hoverPointRadius: 0, // to remove the values appearing on hover
        fill: true,
      },
    ],
  };
  function getGradient(
    ctx: CanvasRenderingContext2D,
    chartArea: ChartArea,
    color: string
  ) {
    let gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.6, color + "99");
    gradient.addColorStop(0.8, color + "66");
    gradient.addColorStop(1, color + "00");
    return gradient;
  }
  if (loading) {
    return (
      <div className="w-full h-72 flex justify-center items-center text-gray-600 dark:text-gray-300">
        Loading chart data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-72 flex flex-col justify-center items-center text-center gap-2  text-gray-500 dark:text-gray-400">
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div className="w-full mt-10 flex flex-col gap-5">
      <div className=" w-full h-72 p-0 m-0">
        <Line data={data} options={options}></Line>
      </div>
      <div className="hidden sm:flex sm:w-80 p-2  gap-3 justify-between rounded-lg  bg-[#CCCCFA66] dark:bg-[#232336] my-5 text-[#424286]  dark:text-white">
        <button
          className={`${
            isClicked === "1d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } w-16 h-10 rounded-lg p-2`}
          onClick={() => {
            getData("1d", fromCoin?.id, toCoin?.id);
            setClicked("1d");
          }}
        >
          1D
        </button>
        <button
          className={`${
            isClicked === "7d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } w-16 h-10 rounded-lg p-2`}
          onClick={() => {
            getData("7d", fromCoin?.id, toCoin?.id);
            setClicked("7d");
          }}
        >
          7D
        </button>
        <button
          className={`${
            isClicked === "14d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } w-16 h-10 rounded-lg p-2`}
          onClick={() => {
            getData("14d", fromCoin?.id, toCoin?.id);
            setClicked("14d");
          }}
        >
          14D
        </button>
        <button
          className={`${
            isClicked === "30d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } w-16 h-10 rounded-lg p-2`}
          onClick={() => {
            getData("30d", fromCoin?.id, toCoin?.id);
            setClicked("30d");
          }}
        >
          1M
        </button>
        <button
          className={`${
            isClicked === "365d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } w-16 h-10 rounded-lg p-2`}
          onClick={() => {
            getData("365d", fromCoin?.id, toCoin?.id);
            setClicked("365d");
          }}
        >
          1Y
        </button>
      </div>
    </div>
  );
};
export default ConvertorChart;
