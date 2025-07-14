"use client";

import "chart.js/auto";

import { useContext, useState, useEffect } from "react";
import { Coin } from "@/interfaces/Coininterface";

import { Bar, Line } from "react-chartjs-2";

export default function HomeComparisonChart({
  id1,
  id2,
}: {
  id1: string;
  id2: string;
}) {
  const [comparisonData, setComparisonData] = useState({
    selectedCoin1Data: [],
    selectedCoin2Data: [],
    volumeData1: [],
    volumeData2: [],
    timeData: [],
  });

  async function getData(coinId1, coinId2) {
    const data1 = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId1}/market_chart?vs_currency=usd&days=7&interval=daily`
    );
    const jsonData1 = await data1.json();

    const timeArray = jsonData1?.prices?.map((price) =>
      new Date(price[0] * 1000).getDate()
    );

    const priceData1 = jsonData1?.prices?.map((price) => price[1]);

    const volumeArray1 = jsonData1.total_volumes.map((volume) => volume[1]);

    const data2 = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId2}/market_chart?vs_currency=usd&days=7&interval=daily`
    );
    const jsonData2 = await data2.json();

    const priceData2 = jsonData2?.prices?.map((price) => price[1]);
    const volumeArray2 = jsonData2.total_volumes.map((volume) => volume[1]);

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
    getData(id1, id2);
  }, [id1, id2]);

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

  const label = comparisonData.timeData;
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

  const myData = [
    { id: id1, data: comparisonData.selectedCoin1Data },
    { id: id2, data: comparisonData.selectedCoin2Data },
  ];

  const myData2 = [
    { id: id1, data: comparisonData.volumeData1 },
    { id: id2, data: comparisonData.volumeData2 },
  ];

  const datasets1 = myData.map((dataset) => ({
    label: dataset.id,
    data: dataset.data,
    backgroundColor: function (context) {
      const chart = context.chart;
      const { ctx, chartArea } = chart;
      let i = 0;
      if (dataset.id === id1) {
        i = 0;
      } else if (dataset.id === id2) {
        i = 2;
      }

      // This case happens on initial chart load
      if (!chartArea) return;
      return getGradient(ctx, chartArea, bgColor[i], bgColor[i + 1]);
    },
    borderColor: "rgba(120, 120, 250, 1)",

    // borderWidth: 2, removed so getting the default border width

    tension: 0.4, //to create a curved chart instead of a straight line
    pointRadius: 0, // to remove the dots
    hoverPointRadius: 0, // to remove the values appearing on hover
    fill: true,
  }));

  const datasets2 = myData2.map((dataset) => ({
    label: dataset.id,
    data: dataset.data,
    backgroundColor: function (context) {
      const chart = context.chart;
      const { ctx, chartArea } = chart;
      let i = 0;
      if (dataset.id === id1) {
        i = 0;
      } else if (dataset.id === id2) {
        i = 2;
      }

      // This case happens on initial chart load
      if (!chartArea) return;
      return getGradient(ctx, chartArea, bgColor[i], bgColor[i + 1]);
    },
    borderColor: "rgba(120, 120, 250, 1)",

    // borderWidth: 2, removed so getting the default border width

    tension: 0.4, //to create a curved chart instead of a straight line
    pointRadius: 0, // to remove the dots
    hoverPointRadius: 0, // to remove the values appearing on hover
    fill: true,
  }));
  const data = {
    labels: label,
    datasets: datasets1,
  };
  const data2 = {
    labels: label,
    datasets: datasets2,
  };

  return (
    <div className="w-full mt-5 flex flex-col gap-5">
      <div className="flex gap-5 justify-between  mt-10 mb-10 w-full">
        <div className="w-full h-[350px] dark:bg-[#191932] bg-white p-2 rounded-lg box-border flex justify-center">
          <Line data={data} options={options}></Line>
        </div>
        <div className="w-full h-[350px] dark:bg-[#191932] bg-white p-2 box-border flex justify-center rounded-lg">
          <Bar data={data2} options={options}></Bar>
        </div>
      </div>
    </div>
  );
}
