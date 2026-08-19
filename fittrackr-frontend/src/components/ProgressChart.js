import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

function ProgressChart({ progressData, target }) {
  if (!progressData || progressData.length === 0) {
    return <p>No progress logged yet.</p>;
  }

  const chartData = progressData.map((p) => ({
    value: p.progress_value,
    date: new Date(p.created_at).toLocaleString(),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#33363d" />
        <XAxis dataKey="date" stroke="#e6e6e6" />
        <YAxis stroke="#e6e6e6" />
        <Tooltip />

        {/* Progress Line */}
        <Line
          type="monotone"
          dataKey="value"
          stroke="#4A90E2"
          strokeWidth={3}
          dot={{ r: 4, fill: "#4A90E2" }}
        />

        {/* Target Line */}
        {target && (
          <ReferenceLine
            y={target}
            stroke="#FF3B3B"
            strokeWidth={2}
            label={{
              value: `Target: ${target}`,
              position: "right",
              fill: "#e6e6e6",
            }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ProgressChart;
