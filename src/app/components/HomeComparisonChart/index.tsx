"use client";

import "chart.js/auto";

import { useState, useEffect } from "react";

import { ChartArea } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { ScriptableContext } from "chart.js";
import { ChartOptions } from "chart.js";

import { useCoinContext } from "@/app/hooks/useCoinContext";
const HomeComparisonChart = ({ id1, id2 }: { id1: string; id2: string }) => {
  const [comparisonData, setComparisonData] = useState({
    selectedCoin1Data: [] as number[],
    selectedCoin2Data: [] as number[],
    volumeData1: [] as number[],
    volumeData2: [] as number[],
    timeData: [] as string[],
  });

  const { debouncedCurrency } = useCoinContext();
  const [isClicked, setClicked] = useState("30d");
  const [time, setTime] = useState<TimeRange>("30d");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
  async function getData(time: TimeRange, coinId1: string, coinId2: string) {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { days, interval } = intervals[time];
      const [res1, res2] = await Promise.all([
        fetch(
          `https://corsproxy.io/?url=https://api.coingecko.com/api/v3/coins/${coinId1}/market_chart?vs_currency=${debouncedCurrency}&days=${days}&interval=${interval}`
        ),
        fetch(
          `https://corsproxy.io/?url=https://api.coingecko.com/api/v3/coins/${coinId2}/market_chart?vs_currency=${debouncedCurrency}&days=${days}&interval=${interval}`
        ),
      ]);

      if (!res1.ok || !res2.ok) {
        throw new Error("Too many requests. Please try again later!");
      }

      const jsonData1 = await res1.json();
      const jsonData2 = await res2.json();
      if (
        !jsonData1?.prices?.length ||
        !jsonData2?.prices?.length ||
        !jsonData1?.total_volumes?.length ||
        !jsonData2?.total_volumes?.length
      ) {
        throw new Error("Incomplete or invalid chart data received.");
      }

      const timeArray = jsonData1?.prices?.map((price: [number, number]) =>
        new Date(price[0] * 1000).getDate()
      );

      const priceData1 = jsonData1?.prices?.map(
        (price: [number, number]) => price[1]
      );

      const volumeArray1 = jsonData1.total_volumes.map(
        (volume: [number, number]) => volume[1]
      );

      const priceData2 = jsonData2?.prices?.map(
        (price: [number, number]) => price[1]
      );
      const volumeArray2 = jsonData2.total_volumes.map(
        (volume: [number, number]) => volume[1]
      );

      setComparisonData({
        selectedCoin1Data: priceData1,
        selectedCoin2Data: priceData2,
        volumeData1: volumeArray1,
        volumeData2: volumeArray2,
        timeData: timeArray,
      });
    } catch (err: any) {
      setErrorMessage(err.message);
      setComparisonData({
        selectedCoin1Data: [],
        selectedCoin2Data: [],
        volumeData1: [],
        volumeData2: [],
        timeData: [],
      });
    } finally {
      setLoading(false);
    }
  }

  const label = comparisonData.timeData;

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        display: false,
        ticks: { display: false },
        grid: {
          drawTicks: false,
          display: false,
        },
      },

      x: {
        ticks: {
          display: true,
          padding: 0,
          minRotation: 0, // 👈 prevent slant
          maxRotation: 0, // 👈 prevent slant
          autoSkip: true, // ✅ automatically skips labels to avoid crowding
          maxTicksLimit: 18, // max number of ticks shown
        },
        grid: {
          drawTicks: false,
          display: false,
        },
      },
    },
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        display: false,
        ticks: { display: false },
        grid: {
          drawTicks: false,
          display: false,
        },
      },

      x: {
        ticks: {
          display: true,
          padding: 0,
          minRotation: 0, // 👈 prevent slant
          maxRotation: 0, // 👈 prevent slant
          autoSkip: true, // ✅ automatically skips labels to avoid crowding
          maxTicksLimit: 18, // max number of ticks shown
        },
        grid: {
          drawTicks: false,
          display: false,
        },
      },
    },
  };

  const lineData = {
    labels: label,
    datasets: [
      {
        label: id1,
        order: 2,
        data: comparisonData.selectedCoin1Data,
        backgroundColor: function (context: ScriptableContext<"line">) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          // This case happens on initial chart load
          if (!chartArea) return;
          return getGradient(ctx, chartArea, "#7878FA");
        },

        borderColor: "#7878FA",

        borderWidth: 2, //removed so getting the default border width

        tension: 0.4, //to create a curved chart instead of a straight line
        pointRadius: 0, // to remove the dots
        hoverPointRadius: 0, // to remove the values appearing on hover
        fill: true,
      },
      {
        label: id2,
        order: 1,
        data: comparisonData.selectedCoin2Data,
        backgroundColor: function (context: ScriptableContext<"line">) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          // This case happens on initial chart load
          if (!chartArea) return;
          return getGradient(ctx, chartArea, "#9D62D9");
        },
        borderColor: "#9D62D9",

        borderWidth: 2, //removed so getting the default border width

        tension: 0.4, //to create a curved chart instead of a straight line
        pointRadius: 0, // to remove the dots
        hoverPointRadius: 0, // to remove the values appearing on hover
        fill: true,
      },
    ],
  };
  const barData = {
    labels: label,
    datasets: [
      {
        label: id1,
        order: 2,
        data: comparisonData.volumeData1,
        backgroundColor: function (context: ScriptableContext<"bar">) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          // This case happens on initial chart load
          if (!chartArea) return "#7878FA";
          return getGradient(ctx, chartArea, "#7878FA");
        },

        borderColor: "#7878FA",

        borderWidth: 2,

        tension: 0.4, //to create a curved chart instead of a straight line
        pointRadius: 0, // to remove the dots
        hoverPointRadius: 0, // to remove the values appearing on hover
        fill: true,
      },
      {
        label: id2,
        order: 1,

        data: comparisonData.volumeData2,
        backgroundColor: function (context: ScriptableContext<"bar">) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          // This case happens on initial chart load
          if (!chartArea) return "#9D62D9";
          return getGradient(ctx, chartArea, "#9D62D9");
        },

        borderColor: "#9D62D9",

        borderWidth: 2,

        tension: 0.4, //to create a curved chart instead of a straight line
        pointRadius: 0, // to remove the dots
        hoverPointRadius: 0, // to remove the values appearing on hover
        fill: true,
      },
    ],
  };
  useEffect(() => {
    getData(time, id1, id2);
  }, [time]);
  return (
    <div className="w-full my-5 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-5 my-5">
        <div className="flex-1 h-[350px] dark:bg-[#191932] bg-white p-2 rounded-lg box-border flex justify-center">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-300">Loading chart...</p>
          ) : errorMessage ? (
            <p className="text-gray-500 dark:text-gray-300 text-center m-auto">
              {errorMessage}
            </p>
          ) : (
            <Line data={lineData} options={lineOptions} />
          )}
        </div>
        <div className="flex-1 h-[350px] dark:bg-[#191932] bg-white p-2 box-border flex justify-center rounded-lg">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-300">Loading chart...</p>
          ) : errorMessage ? (
            <p className="text-gray-500 dark:text-gray-300 text-center m-auto">
              {errorMessage}
            </p>
          ) : (
            <Bar data={barData} options={barOptions} />
          )}
        </div>
      </div>
      <div className="w-full sm:w-80 p-2 flex gap-3 justify-between rounded-lg  bg-[#CCCCFA66] dark:bg-[#232336] my-5 text-[#424286]  dark:text-white">
        <button
          className={`${
            isClicked === "1d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } w-16 h-10 rounded-lg p-2`}
          onClick={() => {
            getData("1d", id1, id2);
            setClicked("1d");
            setTime("1d");
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
            getData("7d", id1, id2);
            setClicked("7d");
            setTime("7d");
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
            getData("14d", id1, id2);
            setClicked("14d");
            setTime("14d");
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
            getData("30d", id1, id2);
            setClicked("30d");
            setTime("30d");
          }}
        >
          30D
        </button>
        <button
          className={`${
            isClicked === "365d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } w-16 h-10 rounded-lg p-2`}
          onClick={() => {
            getData("365d", id1, id2);
            setClicked("365d");
            setTime("365d");
          }}
        >
          365D
        </button>
      </div>
    </div>
  );
};
export default HomeComparisonChart;
