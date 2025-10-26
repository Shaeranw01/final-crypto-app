"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import "chart.js/auto";
import { setRequestMeta } from "next/dist/server/request-meta";
import gradient from "chartjs-plugin-gradient";
import { Bar, Line } from "react-chartjs-2";
import { ChartArea } from "chart.js";
import { ScriptableContext } from "chart.js";
import { Chart } from "chart.js";
import { useCoinContext } from "@/app/hooks/useCoinContext";

const HomeChart = () => {
  const { debouncedCurrency } = useCoinContext();
  const [chartData, setChartData] = useState({
    datesData: [],
    priceData: [],
    volumeData: [],
  });
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
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
  const fetchChartData = useCallback(
    async (time: TimeRange) => {
      setChartLoading(true);
      setChartError(null);

      try {
        const { days, interval } = intervals[time];
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${debouncedCurrency}&days=${days}&interval=${interval}`
        );

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("Too many requests. Please try again later!");
          } else {
            throw new Error(`Server error (${response.status})`);
          }
        }
        const jsonData3 = await response.json();
        if (!jsonData3?.prices || !jsonData3?.total_volumes) {
          throw new Error("Invalid data format");
        }

        const dateArray = jsonData3.prices.map((price: [number, number]) =>
          new Date(price[0] * 1000).getDate()
        );

        const priceArray = jsonData3.prices.map(
          (price: [number, number]) => price[1]
        );

        const volumeArray = jsonData3.total_volumes.map(
          (volume: [number, number]) => volume[1]
        );

        setChartData({
          datesData: dateArray,
          priceData: priceArray,
          volumeData: volumeArray,
        });
      } catch (err: any) {
        const message = err.message.includes("Failed to fetch")
          ? "Network or server blocked request — maybe too many requests"
          : err.message;

        setChartError(message);
        setChartData({ datesData: [], priceData: [], volumeData: [] });
      } finally {
        setChartLoading(false);
      }
    },
    [debouncedCurrency]
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 0,
        left: 0,
      },
    },
    scales: {
      y: {
        display: false,
        ticks: { display: false },
        grid: {
          drawTicks: false,
          display: false,
        },
      },

      x: {
        display: true,
        border: {
          display: false,
        },
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

  const data = useMemo(() => {
    return {
      labels: chartData.datesData,
      datasets: [
        {
          label: "Price",
          data: chartData.priceData,
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
  }, [chartData]);

  const data2 = useMemo(() => {
    return {
      labels: chartData.datesData,
      datasets: [
        {
          label: "Volume",
          data: chartData.volumeData,
          backgroundColor: function (context: ScriptableContext<"bar">) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;

            // This case happens on initial chart load
            if (!chartArea) return;
            return getGradient(ctx, chartArea, "#9D62D9");
          },
          // borderColor: "rgba(120, 120, 250, 1)",

          // borderWidth: 2, removed so getting the default border width

          tension: 0.4, //to create a curved chart instead of a straight line
          pointRadius: 0, // to remove the dots
          hoverPointRadius: 0, // to remove the values appearing on hover
          fill: true,
        },
      ],
    };
  }, [chartData]);

  useEffect(() => {
    fetchChartData(timeRange);
  }, [fetchChartData, timeRange]);
  return (
    <div className="flex flex-col gap-5 ">
      <div className="flex flex-col sm:flex-row mb-5 gap-5  ">
        <div className="flex-1 h-64 sm:h-[350px] dark:bg-[#191932] bg-white rounded-lg p-2">
          <div className="w-full h-full flex items-center justify-center">
            {chartLoading ? (
              <p className="text-gray-500 dark:text-gray-300">
                Loading chart...
              </p>
            ) : chartError ? (
              <p className="text-gray-500 dark:text-gray-300 ">{chartError}</p>
            ) : (
              <Line data={data} options={options} />
            )}
          </div>
        </div>
        <div className="flex-1 h-64 sm:h-[350px] dark:bg-[#191932] bg-white rounded-lg p-2">
          <div className="w-full h-full flex items-center justify-center">
            {chartLoading ? (
              <p className="text-gray-500 dark:text-gray-300">
                Loading chart...
              </p>
            ) : chartError ? (
              <p className="text-gray-500 dark:text-gray-300">{chartError}</p>
            ) : (
              <Bar data={data2} options={options}></Bar>
            )}
          </div>
        </div>
      </div>

      <div className="w-full sm:w-80 p-2 flex gap-3 justify-between rounded-lg  bg-[#CCCCFA66] dark:bg-[#232336] my-5 text-[#424286]  dark:text-white">
        <button
          className={`${
            timeRange === "1d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } flex-1 h-10 rounded-lg p-2`}
          onClick={() => {
            fetchChartData("1d");
            setTimeRange("1d");
          }}
        >
          1D
        </button>
        <button
          className={`${
            timeRange === "7d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } flex-1 h-10 rounded-lg p-2`}
          onClick={() => {
            fetchChartData("7d");
            setTimeRange("7d");
          }}
        >
          7D
        </button>
        <button
          className={`${
            timeRange === "14d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } flex-1 h-10 rounded-lg p-2`}
          onClick={() => {
            fetchChartData("14d");
            setTimeRange("14d");
          }}
        >
          14D
        </button>
        <button
          className={`${
            timeRange === "30d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } flex-1 h-10 rounded-lg p-2`}
          onClick={() => {
            fetchChartData("30d");
            setTimeRange("30d");
          }}
        >
          1M
        </button>
        <button
          className={`${
            timeRange === "365d" &&
            "bg-[#6161D680] text-[#424286]  dark:text-white dark:bg-[#6161D680] "
          } flex-1 h-10 rounded-lg p-2`}
          onClick={() => {
            fetchChartData("365d");
            setTimeRange("365d");
          }}
        >
          1Y
        </button>
      </div>
    </div>
  );
};
export default HomeChart;
