import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getToken } from "../authStorage";
import { addMeasurement, getMeasurements, deleteMeasurement } from "../api";
import "./BodyMeasurements.css";

const EMPTY_FORM = {
  weight: "",
  body_fat: "",
  chest: "",
  waist: "",
  hips: "",
  arms: "",
  notes: "",
};

const OPTIONAL_FIELDS = [
  { key: "body_fat", label: "Body fat %" },
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "arms", label: "Arms" },
];

function BodyMeasurements() {
  const [measurements, setMeasurements] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState("");

  const load = async () => {
    const token = getToken();
    try {
      const data = await getMeasurements(token);
      setMeasurements(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message || "Failed to load measurements");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const weight = parseFloat(form.weight);
    if (!Number.isFinite(weight) || weight <= 0) {
      setMessage("Weight is required and must be a positive number.");
      return;
    }
    setMessage("");
    const token = getToken();
    try {
      await addMeasurement(token, form);
      setForm(EMPTY_FORM);
      await load();
    } catch (error) {
      setMessage(error.message || "Failed to save measurement");
    }
  };

  const handleDelete = async (id) => {
    const token = getToken();
    try {
      await deleteMeasurement(token, id);
      await load();
    } catch (error) {
      setMessage(error.message || "Failed to delete measurement");
    }
  };

  const chartData = measurements.map((m) => ({
    date: new Date(m.measured_at).toLocaleDateString(),
    weight: Number(m.weight),
  }));

  // Newest first for the table.
  const rows = [...measurements].reverse();

  return (
    <div className="page-container">
      <h2>Body Measurements &amp; Weight Log</h2>

      {message && <p className="error-text">{message}</p>}

      <form className="measurement-form" onSubmit={handleSubmit}>
        <div className="measurement-fields">
          <label className="measurement-field">
            <span>Weight *</span>
            <input
              type="number"
              step="0.1"
              className="input-field"
              placeholder="kg"
              value={form.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
            />
          </label>

          {OPTIONAL_FIELDS.map((field) => (
            <label className="measurement-field" key={field.key}>
              <span>{field.label}</span>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={form[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </label>
          ))}

          <label className="measurement-field measurement-notes">
            <span>Notes</span>
            <input
              className="input-field"
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </label>
        </div>

        <button type="submit" className="btn btn-green">
          Save measurement
        </button>
      </form>

      <h3 className="measurement-section-title">Weight over time</h3>
      {chartData.length === 0 ? (
        <p>No measurements logged yet.</p>
      ) : (
        <div className="measurement-chart">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#33363d" />
              <XAxis dataKey="date" stroke="#e6e6e6" />
              <YAxis stroke="#e6e6e6" domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1d23",
                  border: "1px solid #2a2d33",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#4CAF50"
                strokeWidth={3}
                dot={{ r: 4, fill: "#4CAF50" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <h3 className="measurement-section-title">History</h3>
      {rows.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <div className="measurement-table-wrap">
          <table className="measurement-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>Body fat %</th>
                <th>Chest</th>
                <th>Waist</th>
                <th>Hips</th>
                <th>Arms</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td>{new Date(m.measured_at).toLocaleDateString()}</td>
                  <td>{m.weight}</td>
                  <td>{m.body_fat ?? "—"}</td>
                  <td>{m.chest ?? "—"}</td>
                  <td>{m.waist ?? "—"}</td>
                  <td>{m.hips ?? "—"}</td>
                  <td>{m.arms ?? "—"}</td>
                  <td>{m.notes || "—"}</td>
                  <td>
                    <button
                      className="btn btn-red"
                      onClick={() => handleDelete(m.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BodyMeasurements;
