"use client";

import "chart.js/auto";
import dynamic from "next/dynamic";
import { useContext, useState, useEffect } from "react";
import { Coin } from "@/interfaces/Coininterface";
import { BsAspectRatio } from "react-icons/bs";
import { Line } from "react-chartjs-2";

export default function ConvertorChart({
  fromCoin,
  toCoin,
}: {
  fromCoin: Coin;
  toCoin: Coin;
}) {
  const [priceData, setPriceData] = useState({
    fromCoinData: [],
    toCoinData: [],
    timeData: [],
  });
  const intervals = {
    "7d": {
      days: 7,
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

  async function getData(time, coinId1, coinId2) {
    const { days, interval } = intervals[time];
    const data1 = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId1}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`
    );
    const jsonData1 = await data1.json();

    const timeArray = jsonData1?.prices?.map((price) =>
      new Date(price[0] * 1000).getDate()
    );

    const priceData1 = jsonData1?.prices?.map((price) => price[1]);

    const data2 = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId2}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`
    );
    const jsonData2 = await data2.json();

    const priceData2 = jsonData2?.prices?.map((price) => price[1]);

    setPriceData({
      fromCoinData: priceData1,
      toCoinData: priceData2,
      timeData: timeArray,
    });
  }

  //   getData("30d", fromCoin?.id, toCoin?.id);

  useEffect(() => {
    getData("365d", fromCoin?.id, toCoin?.id);
  }, [fromCoin.id, toCoin.id]);

  //   const Line = dynamic(
  //     () => import("react-chartjs-2").then((mod) => mod.Line),
  //     {
  //       ssr: false,
  //     }
  //   );

  const bgColor = [
    "rgba(116, 116, 242, 0.6)",
    "rgba(116, 116, 242, 0.01)",
    "rgba(127, 255, 212,1)",
    "rgba(127, 255, 212,0.1)",
  ];
  function getGradient(ctx, chartArea, color1, color2) {
    let gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  }

  const label = priceData.timeData;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
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
        label: fromCoin.id,
        data: priceData.fromCoinData,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          // This case happens on initial chart load
          if (!chartArea) return;
          return getGradient(ctx, chartArea, bgColor[0], bgColor[1]);
        },
        borderColor: "rgba(120, 120, 250, 1)",

        // borderWidth: 2, removed so getting the default border width

        tension: 0.4, //to create a curved chart instead of a straight line
        pointRadius: 0, // to remove the dots
        hoverPointRadius: 0, // to remove the values appearing on hover
        fill: true,
      },
      {
        label: toCoin.id,
        data: priceData.toCoinData,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          // This case happens on initial chart load
          if (!chartArea) return;
          return getGradient(ctx, chartArea, bgColor[2], bgColor[3]);
        },
        borderColor: "rgb(127, 255, 212,1)",

        // borderWidth: 2, removed so getting the default border width

        tension: 0.4, //to create a curved chart instead of a straight line
        pointRadius: 0, // to remove the dots
        hoverPointRadius: 0, // to remove the values appearing on hover
        fill: true,
      },
    ],
  };

  return (
    <div className="w-full mt-5 flex flex-col gap-5">
      <div className=" w-full h-[300px]">
        <Line data={data} options={options}></Line>
      </div>
      <div className="flex gap-3">
        <button
          className="w-14 h-10 bg-red-200 rounded-lg p-3"
          onClick={() => getData("7d", fromCoin?.id, toCoin?.id)}
        >
          7D
        </button>
        <button
          className="w-14 h-10 bg-red-200 rounded-lg p-3 "
          onClick={() => getData("30d", fromCoin?.id, toCoin?.id)}
        >
          30D
        </button>
        <button
          className="w-14 h-10 bg-red-200 rounded-lg p-3"
          onClick={() => getData("365d", fromCoin?.id, toCoin?.id)}
        >
          365D
        </button>
      </div>
    </div>
  );
}
