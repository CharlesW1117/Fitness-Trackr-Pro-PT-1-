import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getToken } from "../authStorage";
import { addWater, getWaterToday, getWaterHistory, deleteWater } from "../api";
import "./WaterTracker.css";

const DAILY_GOAL_ML = 2000;

function WaterTracker() {
  const [total, setTotal] = useState(0);
  const [entries, setEntries] = useState([]);
  const [history, setHistory] = useState([]);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const token = getToken();
    try {
      const today = await getWaterToday(token);
      setTotal(today.total_ml || 0);
      setEntries(Array.isArray(today.entries) ? today.entries : []);
      const hist = await getWaterHistory(token, 7);
      setHistory(Array.isArray(hist) ? hist : []);
    } catch (error) {
      setMessage(error.message || "Failed to load water data");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (amount) => {
    const token = getToken();
    try {
      await addWater(token, amount);
      await load();
    } catch (error) {
      setMessage(error.message || "Failed to log water");
    }
  };

  const handleAddCustom = async () => {
    const amount = parseInt(customAmount, 10);
    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Enter a positive amount in ml.");
      return;
    }
    setMessage("");
    setCustomAmount("");
    await handleAdd(amount);
  };

  const handleDelete = async (id) => {
    const token = getToken();
    try {
      await deleteWater(token, id);
      await load();
    } catch (error) {
      setMessage(error.message || "Failed to delete entry");
    }
  };

  const percent = Math.min(100, Math.round((total / DAILY_GOAL_ML) * 100));
  const goalReached = total >= DAILY_GOAL_ML;

  const chartData = history.map((row) => ({
    day: row.day.slice(5),
    total_ml: row.total_ml,
  }));

  return (
    <div className="page-container">
      <h2>Water Intake</h2>

      {message && <p className="error-text">{message}</p>}

      <div className="water-card">
        <div className="water-total">
          <span className="water-amount">{total}</span>
          <span className="water-unit"> / {DAILY_GOAL_ML} ml</span>
          <span className="water-percent">({percent}%)</span>
        </div>

        <div className="water-bar-track">
          <div
            className={`water-bar-fill${goalReached ? " is-complete" : ""}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {goalReached && (
          <p className="water-goal-note">
            💧 Daily goal reached! Great hydration today.
          </p>
        )}

        <div className="water-quick-add">
          <button className="btn btn-blue" onClick={() => handleAdd(250)}>
            + Glass (250 ml)
          </button>
          <button className="btn btn-blue" onClick={() => handleAdd(500)}>
            + Bottle (500 ml)
          </button>
        </div>

        <div className="water-custom-add">
          <input
            type="number"
            className="input-field"
            placeholder="Custom amount (ml)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
          <button className="btn btn-green" onClick={handleAddCustom}>
            Add
          </button>
        </div>
      </div>

      <h3 className="water-section-title">Today's log</h3>
      {entries.length === 0 ? (
        <p>No water logged yet today.</p>
      ) : (
        <ul className="water-list">
          {entries.map((entry) => (
            <li key={entry.id} className="water-list-item">
              <span>
                <strong>{entry.amount_ml} ml</strong>
                <span className="water-time">
                  {" "}
                  ({new Date(entry.logged_at).toLocaleTimeString()})
                </span>
              </span>
              <button
                className="btn btn-red"
                onClick={() => handleDelete(entry.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3 className="water-section-title">Last 7 days</h3>
      {chartData.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        <div className="water-chart">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#33363d" />
              <XAxis dataKey="day" stroke="#e6e6e6" />
              <YAxis stroke="#e6e6e6" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1d23",
                  border: "1px solid #2a2d33",
                }}
              />
              <Bar dataKey="total_ml" fill="#4A90E2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default WaterTracker;
