"use client";

import "chart.js/auto";

import { useState, useEffect } from "react";
import { ChartArea } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useCoinContext } from "@/app/hooks/useCoinContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { ScriptableContext } from "chart.js";
import { ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const ComparisonChart = ({ id1, id2 }: { id1: string; id2: string }) => {
  const [comparisonData, setComparisonData] = useState({
    selectedCoin1Data: [],
    selectedCoin2Data: [],
    volumeData1: [],
    volumeData2: [],
    timeData: [],
  });

  const { debouncedCurrency } = useCoinContext();

  type ChartType = "line" | "bar";

  type TimeRange = "7d" | "30d" | "365d";
  const intervals: Record<TimeRange, { days: number; interval: string }> = {
    "7d": { days: 7, interval: "daily" },
    "30d": { days: 30, interval: "daily" },
    "365d": { days: 365, interval: "daily" },
  };
  const [isClicked, setClicked] = useState("365d");
  async function getData(time: TimeRange, coinId1: string, coinId2: string) {
    const { days, interval } = intervals[time];

    const data1 = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId1}/market_chart?vs_currency=${debouncedCurrency}&days=${days}&interval=${interval}`
    );
    const jsonData1 = await data1.json();

    const timeArray = jsonData1?.prices?.map((price: [number, number]) =>
      new Date(price[0] * 1000).getDate()
    );

    const priceData1 = jsonData1?.prices?.map(
      (price: [number, number]) => price[1]
    );

    const volumeArray1 = jsonData1.total_volumes.map(
      (volume: [number, number]) => volume[1]
    );

    const data2 = await fetch(
      `https://corsproxy.io/?url=https://api.coingecko.com/api/v3/coins/${coinId2}/market_chart?vs_currency=${debouncedCurrency}&days=${days}&interval=${interval}`
    );
    const jsonData2 = await data2.json();

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
  }

  //   getData("30d", fromCoin?.id, toCoin?.id);

  useEffect(() => {
    getData("365d", id1, id2);
  }, [id1, id2]);

  function createGradient(
    ctx: CanvasRenderingContext2D,
    chartArea: ChartArea | undefined,
    rgb: string
  ) {
    if (!chartArea) return `rgba(${rgb},1)`; // fallback solid color
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );
    gradient.addColorStop(0, `rgba(${rgb}, 1)`);
    gradient.addColorStop(0.6, `rgba(${rgb}, 0.8)`);
    gradient.addColorStop(1, `rgba(${rgb}, 0.4)`);
    return gradient;
  }

  const label = comparisonData.timeData;
  const options: ChartOptions<"line" | "bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
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
          callback: function (
            tickValue: string | number,
            index: number,
            ticks: any[]
          ): string | number {
            // Get the label from Chart.js
            const label = this.getLabelForValue(tickValue as number) as string;

            // If label is like "Jan 14" -> keep just 14
            if (typeof label === "string" && label.includes(" ")) {
              return label.split(" ")[1];
            }

            // If ISO date -> return just day number
            const date = new Date(label);
            if (!isNaN(date.getTime())) {
              return date.getDate().toString();
            }

            // fallback: return original label
            return label;
          },
        },
        grid: {
          drawTicks: false,
          display: false,
        },
      },
    },
  };

  const baseOptions: ChartOptions<ChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
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
          callback: function (
            tickValue: string | number,
            index: number,
            ticks: any[]
          ): string | number {
            // Get the label from Chart.js
            const label = this.getLabelForValue(tickValue as number) as string;

            // If label is like "Jan 14" -> keep just 14
            if (typeof label === "string" && label.includes(" ")) {
              return label.split(" ")[1];
            }

            // If ISO date -> return just day number
            const date = new Date(label);
            if (!isNaN(date.getTime())) {
              return date.getDate().toString();
            }

            // fallback: return original label
            return label;
          },
        },
        grid: {
          drawTicks: false,
          display: false,
        },
      },
    },
  };
  const lineOptions: ChartOptions<"line"> = {
    ...baseOptions,
    elements: {
      line: { tension: 0.4 },
    },
  };

  const barOptions = {
    ...baseOptions,
    barPercentage: 0.8,
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
          return createGradient(ctx, chartArea, "120, 120, 250");
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
          return createGradient(ctx, chartArea, "157,98,217");
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
          return createGradient(ctx, chartArea, "120, 120, 250");
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
          return createGradient(ctx, chartArea, "157,98,217");
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

  return (
    <div className="w-full mt-5 flex flex-col gap-5">
      <div className="flex gap-5 justify-between  mt-10 mb-10 w-full">
        <div className="w-full h-[350px] dark:bg-[#191932] bg-white p-2 rounded-lg box-border flex justify-center">
          <Line data={lineData} options={lineOptions}></Line>
        </div>
        <div className="w-full h-[350px] dark:bg-[#191932] bg-white p-2 box-border flex justify-center rounded-lg">
          <Bar data={barData} options={options}></Bar>
        </div>
      </div>

      <div className="w-64 p-2 rounded-lg  bg-[#CCCCFA66] dark:bg-[#232336] flex gap-3 justify-between m-10 text-[#424286]  dark:text-white">
        <button
          className={`${
            isClicked === "7d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } w-16 h-10 rounded-lg p-2`}
          onClick={() => {
            getData("7d", id1, id2);
            setClicked("7d");
          }}
        >
          7D
        </button>
        <button
          className={`${
            isClicked === "30d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } w-16 h-10 rounded-lg p-2`}
          onClick={() => {
            getData("30d", id1, id2);
            setClicked("30d");
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
          }}
        >
          365D
        </button>
      </div>
    </div>
  );
};
export default ComparisonChart;
