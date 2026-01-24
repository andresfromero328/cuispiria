"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// interface MacroData = {
//   protein: number;
//   carbs: number;
//   fat: number;
// };

const MacroPieChart = () => {
  const chartData = {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [
      {
        data: [120, 230, 70],
        backgroundColor: [
          "oklch(58% 0.20 260)",
          "oklch(56% 0.17 150)",
          "oklch(62% 0.18 55)",
        ],
        borderColor: "oklch(93.538% 0.05295 90.631)",
        borderWidth: 5,
        hoverOffset: 3,
        radius: 90,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "10%",
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        labels: {
          boxWidth: 20,
          font: { size: 12, family: "funnel display, sans-serif" },
        },
      },
      tooltip: {
        titleFont: {
          size: 14,
          family: "funnel display, sans-serif",
        },
        bodyFont: {
          size: 14,
          family: "funnel display, sans-serif",
        },
        callbacks: {
          label: (ctx: TooltipItem<"pie">) => `${ctx.label}: ${ctx.raw}g`,
        },
        borderWidth: 0,
        displayColors: false,
      },
    },
  };

  return (
    <div className="relative h-55 w-full drop-shadow-sm">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default MacroPieChart;
