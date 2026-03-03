import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function SummaryChart({ categorySummary }) {

  const data = {
    labels: categorySummary.map(item => item._id),
    datasets: [
      {
        data: categorySummary.map(item => item.total),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF"
        ]
      }
    ]
  };

  return <Pie data={data} />;
}

export default SummaryChart;