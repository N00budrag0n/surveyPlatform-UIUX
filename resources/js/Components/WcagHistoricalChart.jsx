import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function WcagHistoricalChart({ chartData }) {
    if (!chartData || !chartData.labels || chartData.labels.length === 0) {
        return (
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">
                        Accessibility Performance Over Time
                    </h5>
                </div>
                <div className="card-body">
                    <div className="alert alert-info">
                        No historical data available. Run tests over time to see
                        your progress.
                    </div>
                </div>
            </div>
        );
    }

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: "Compliance Score (%)",
                data: chartData.scores,
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.1,
                yAxisID: "y",
            },
        ],
    };

    const options = {
        responsive: true,
        interaction: {
            mode: "index",
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: "Accessibility Compliance Score Over Time",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || "";
                        const value = context.parsed.y || 0;
                        const index = context.dataIndex;
                        const level = chartData.levels[index];

                        return [`${label}: ${value}%`, `WCAG Level: ${level}`];
                    },
                },
            },
        },
        scales: {
            y: {
                type: "linear",
                display: true,
                position: "left",
                min: 0,
                max: 100,
                title: {
                    display: true,
                    text: "Compliance Score (%)",
                },
            },
        },
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">Accessibility Performance Over Time</h5>
            </div>
            <div className="card-body">
                {chartData.labels.length > 1 ? (
                    <Line data={data} options={options} />
                ) : (
                    <div className="alert alert-info">
                        Not enough historical data to display a trend chart. Run
                        multiple tests over time to see your progress.
                    </div>
                )}
            </div>
        </div>
    );
}
