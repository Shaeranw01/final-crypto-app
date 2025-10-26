"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "chart.js/auto";
import getLabelArray from "@/utlis/getLabelArray";
import { ChartArea } from "chart.js/auto";
import { ScriptableContext } from "chart.js/auto";
import { ChartOptions } from "chart.js/auto";

const Chart = ({ priceArray }: { priceArray: number[] }) => {
  const [priceData, setData] = useState(priceArray);

  const Line = dynamic(
    () => import("react-chartjs-2").then((mod) => mod.Line),
    {
      ssr: false,
    }
  );

  const labelArray = getLabelArray(priceArray.length);

  const bgColor = [
    "rgba(3,253,252, 0.8)",
    "rgba(252,129,129, 0.8)",
    "rgba(33,253,252, 0.6)",
    "rgba(252,129,129, 0.6)",
    "rgba(3,253,252, 0.1)",
    "rgba(252,129,129, 0.1)",
  ];

  function getGradient(
    ctx: CanvasRenderingContext2D,
    chartArea: ChartArea,
    color1: string,
    color2: string,
    color3: string
  ) {
    let gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );
    gradient.addColorStop(0, color1); // bright
    // Middle (medium)
    gradient.addColorStop(0.5, color2); // mid tone
    // Bottom (darkest)
    gradient.addColorStop(1, color3); // darker
    return gradient;
  }

  const data = {
    labels: labelArray,
    datasets: [
      {
        data: priceData,

        backgroundColor: function (context: ScriptableContext<"line">) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          // This case happens on initial chart load
          if (!chartArea) return;
          return getGradient(
            ctx,
            chartArea,
            priceData[0] < priceData[priceData.length - 1]
              ? bgColor[0]
              : bgColor[1],
            priceData[0] < priceData[priceData.length - 1]
              ? bgColor[2]
              : bgColor[3],
            priceData[0] < priceData[priceData.length - 1]
              ? bgColor[4]
              : bgColor[5]
          );
        },
        borderColor:
          priceData[0] < priceData[priceData.length - 1]
            ? "rgba(3,253,252, 1)"
            : "rgba(252,129,129, 1)",

        borderWidth: 1,

        tension: 0.4, //to create a curved chart instead of a straight line
        pointRadius: 0, // to remove the dots
        hoverPointRadius: 0, // to remove the values appearing on hover
        fill: true,
      },
    ],
  };
  const options: ChartOptions<"line"> = {
    plugins: {
      legend: {
        display: false,
      }, // Hide legend
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
        display: false,
        grid: {
          drawTicks: false,
          display: false,
        },
      },
    },
  };

  return (
    <div>
      <div className="w-36 h-10">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Chart;
