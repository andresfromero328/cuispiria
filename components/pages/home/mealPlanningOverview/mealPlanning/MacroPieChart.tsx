"use client";

import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
  ChartOptions,
} from "chart.js";

import { Macros } from "@/types/chartTypes";
ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  macros: Macros;
}

function toNumber(n: unknown) {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) && v >= 0 ? v : 0;
}

export default function MacroPieChart({ macros }: Props) {
  const p = toNumber(macros.percentProtein);
  const c = toNumber(macros.percentCarbs);
  const f = toNumber(macros.percentFat);

  const chartData = useMemo(
    () => ({
      labels: ["Protein", "Carbs", "Fat"],
      datasets: [
        {
          data: [p, c, f],
          // keep your existing styling
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
    }),
    [p, c, f],
  );

  const options: ChartOptions<"pie"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "10%",
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            boxWidth: 20,
            font: { size: 12, family: "funnel display, sans-serif" },
          },
        },
        tooltip: {
          titleFont: { size: 14, family: "funnel display, sans-serif" },
          bodyFont: { size: 14, family: "funnel display, sans-serif" },
          callbacks: {
            label: (ctx: TooltipItem<"pie">) => `${ctx.label}: ${ctx.raw}g`,
          },
          borderWidth: 0,
          displayColors: false,
        },
      },
    }),
    [],
  );

  const total = p + c + f;

  return (
    <div className="relative h-55 w-full drop-shadow-sm">
      {total > 0 ? (
        <Pie data={chartData} options={options} />
      ) : (
        <div className="grid h-full place-items-center">
          <small className="text-muted-foreground">No macros available</small>
        </div>
      )}
    </div>
  );
}
