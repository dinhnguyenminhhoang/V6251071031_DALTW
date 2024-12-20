import React from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const toPercent = (decimal, fixed) => `${(decimal * 100).toFixed(fixed)}%`;

const getPercent = (value, total) => {
    const ratio = total > 0 ? value / total : 0;
    return toPercent(ratio, 2);
};

const renderTooltipContent = (o) => {
    const { payload, label } = o;
    const total =
        payload && payload.reduce((result, entry) => result + entry.value, 0);

    return (
        <div className="customized-tooltip-content bg-white p-2 rounded-md">
            <p className="total">{`${label} (Total: ${total})`}</p>
            <ul className="list">
                {payload &&
                    payload.map((entry, index) => (
                        <li
                            key={`item-${index}`}
                            style={{ color: entry.color }}
                            className="capitalize"
                        >
                            {`${entry.name}: ${entry.value} (${getPercent(
                                entry.value,
                                total
                            )})`}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

const StackedBarChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={500} className="text-sm">
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="At"
                    label={{
                        value: "TIME",
                        position: "insideBottomRight",
                        offset: 0,
                    }}
                />
                <YAxis
                    label={{
                        value: "ORDER COUNT",
                        angle: -90,
                        position: "insideLeft",
                        offset: 0,
                    }}
                />
                <Tooltip
                    cursor={{ fill: "#32649666" }}
                    content={renderTooltipContent}
                />
                <Legend
                    formatter={(value) => (
                        <span className="capitalize">{value}</span>
                    )}
                />
                <Bar dataKey="Init" stackId="1" fill="#ff6767" />
                <Bar dataKey="Confirm" stackId="1" fill="#82ca9d" />
                <Bar dataKey="Served" stackId="1" fill="#8884d8" />
                <Bar dataKey="Shipping" stackId="1" fill="#ff7300" />
                <Bar dataKey="Shipped" stackId="1" fill="#ffb74d" />
                <Bar dataKey="Completed" stackId="1" fill="#4caf50" />
                <Bar dataKey="Canceled" stackId="1" fill="#f44336" />
                <Bar dataKey="Failed" stackId="1" fill="#9e9e9e" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StackedBarChart;
