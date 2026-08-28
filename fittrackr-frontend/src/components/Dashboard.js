import { useEffect, useState } from "react";
import "./Dashboard.css";
import Toast from "./Toast";
import ProgressChart from "./ProgressChart";
import {
  getGoals,
  addGoal,
  deleteGoal,
  editGoal,
  viewProgress,
  addProgress,
  deleteProgress,
} from "../api";
import { getToken } from "../authStorage";

// Derives at-a-glance completion info for a goal from its target and the
// latest logged progress value (returned by GET /api/goals as latest_progress).
function computeGoalStats(goal) {
  const target = Number(goal.target) || 0;
  const hasProgress =
    goal.latest_progress !== null && goal.latest_progress !== undefined;
  const latest = hasProgress ? Number(goal.latest_progress) : 0;
  const percent =
    target > 0 ? Math.min(100, Math.round((latest / target) * 100)) : 0;
  const completed = hasProgress && target > 0 && latest >= target;
  return { target, latest, hasProgress, percent, completed };
}

function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [message, setMessage] = useState("");
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    target: "",
  });
  const [editingGoal, setEditingGoal] = useState(null);
  const [editedGoal, setEditedGoal] = useState({
    name: "",
    description: "",
    target: "",
  });
  const [progressData, setProgressData] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newProgress, setNewProgress] = useState({
    progress_value: "",
    notes: "",
  });
  const [toast, setToast] = useState(null);

  const loadGoals = async () => {
    const token = getToken();
    if (!token) {
      setMessage("You must log in first.");
      return;
    }

    try {
      const data = await getGoals(token);
      setGoals(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message || "Failed to load goals");
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleAddGoal = async () => {
    try {
      const token = getToken();
      await addGoal(token, newGoal);
      setNewGoal({ name: "", description: "", target: "" });
      await loadGoals();
    } catch (error) {
      setMessage(error.message || "Failed to add goal");
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      const token = getToken();
      await deleteGoal(token, id);
      await loadGoals();
    } catch (error) {
      setMessage(error.message || "Failed to delete goal");
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal.id);
    setEditedGoal({
      name: goal.name,
      description: goal.description,
      target: goal.target,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const token = getToken();
      await editGoal(token, id, editedGoal);
      setEditingGoal(null);
      await loadGoals();
    } catch (error) {
      setMessage(error.message || "Failed to save goal");
    }
  };

  const handleViewProgress = async (goalId) => {
    try {
      const token = getToken();
      const data = await viewProgress(token, goalId);
      setProgressData(Array.isArray(data) ? data : []);
      setSelectedGoal(goalId);
    } catch (error) {
      setMessage(error.message || "Failed to load progress");
    }
  };

  const handleAddProgress = async () => {
    try {
      const token = getToken();
      await addProgress(token, selectedGoal, newProgress);

      const goal = goals.find((g) => g.id === selectedGoal);
      const target = Number(goal?.target) || 0;
      const justCompleted =
        target > 0 && Number(newProgress.progress_value) >= target;

      setToast({
        message: justCompleted
          ? "🏆 Goal complete! Amazing work — you hit your target!"
          : "🔥 Progress logged! Keep pushing forward!",
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
      setNewProgress({ progress_value: "", notes: "" });
      await handleViewProgress(selectedGoal);
      await loadGoals();
    } catch (error) {
      setMessage(error.message || "Failed to log progress");
    }
  };

  const handleDeleteProgress = async (id) => {
    try {
      const token = getToken();
      await deleteProgress(token, id);
      setToast({
        message: "🗑️ Progress entry deleted successfully!",
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
      await handleViewProgress(selectedGoal);
      await loadGoals();
    } catch (error) {
      setMessage(error.message || "Failed to delete progress");
    }
  };

  const totalGoals = goals.length;
  const completedCount = goals.filter(
    (g) => computeGoalStats(g).completed,
  ).length;
  const activeCount = totalGoals - completedCount;
  const avgProgress =
    totalGoals === 0
      ? 0
      : Math.round(
          goals.reduce((sum, g) => sum + computeGoalStats(g).percent, 0) /
            totalGoals,
        );

  return (
    <div className="dashboard-container">
      {/* === FITNESS BACKGROUND ELEMENTS === */}
      <div className="heartbeat-line"></div>
      <div className="dumbbell"></div>
      <div className="dumbbell"></div>
      <div className="dumbbell"></div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <h2 className="dashboard-title">Dashboard</h2>

      {message && <p className="error-text">{message}</p>}

      {/* Add Goal Form */}
      <div className="section">
        <input
          className="input-field"
          placeholder="Goal name"
          value={newGoal.name}
          onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
        />
        <input
          className="input-field"
          placeholder="Description"
          value={newGoal.description}
          onChange={(e) =>
            setNewGoal({ ...newGoal, description: e.target.value })
          }
        />
        <input
          type="number"
          className="input-field"
          placeholder="Target value (e.g., miles, reps, glasses)"
          value={newGoal.target || ""}
          onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
        />
        <button onClick={handleAddGoal} className="btn btn-green">
          Add Goal
        </button>
      </div>

      {totalGoals > 0 && (
        <div className="goal-summary">
          <span className="summary-stat">
            <strong>{activeCount}</strong> active
          </span>
          <span className="summary-sep">·</span>
          <span className="summary-stat">
            <strong>{completedCount}</strong> completed
          </span>
          <span className="summary-sep">·</span>
          <span className="summary-stat">
            <strong>{avgProgress}%</strong> avg progress
          </span>
        </div>
      )}

      <ul className="goal-list">
        {goals.map((goal) => {
          const stats = computeGoalStats(goal);
          return (
            <li
              key={goal.id}
              className={`goal-item${stats.completed ? " completed" : ""}`}
            >
              {editingGoal === goal.id ? (
                <>
                  <input
                    className="input-field"
                    value={editedGoal.name}
                    onChange={(e) =>
                      setEditedGoal({ ...editedGoal, name: e.target.value })
                    }
                  />
                  <input
                    className="input-field"
                    value={editedGoal.description}
                    onChange={(e) =>
                      setEditedGoal({
                        ...editedGoal,
                        description: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    className="input-field"
                    value={editedGoal.target}
                    onChange={(e) =>
                      setEditedGoal({ ...editedGoal, target: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleSaveEdit(goal.id)}
                    className="btn btn-green"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingGoal(null)}
                    className="btn btn-gray"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="goal-header">
                    <span className="goal-name">
                      <strong>{goal.name}</strong>
                      {goal.description ? ` — ${goal.description}` : ""}
                    </span>
                    {stats.completed && (
                      <span className="goal-badge">✓ Completed</span>
                    )}
                  </div>

                  <div className="goal-progress">
                    <div className="progress-bar-track">
                      <div
                        className={`progress-bar-fill${
                          stats.completed ? " is-complete" : ""
                        }`}
                        style={{ width: `${stats.percent}%` }}
                      />
                    </div>
                    <span className="progress-label">
                      {stats.latest} / {stats.target || "—"} ({stats.percent}%)
                    </span>
                  </div>

                  <div className="goal-actions">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="btn btn-blue"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="btn btn-red"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewProgress(goal.id)}
                      className="btn btn-purple"
                    >
                      View Progress
                    </button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>

      {selectedGoal && (
        <div className="section">
          <h3 className="progress-title">Progress for Goal #{selectedGoal}</h3>

          <div className="chart-container">
            <ProgressChart
              progressData={progressData}
              target={goals.find((g) => g.id === selectedGoal)?.target}
            />
          </div>

          <div className="progress-form">
            <input
              type="number"
              className="input-field"
              placeholder="Progress value"
              value={newProgress.progress_value}
              onChange={(e) =>
                setNewProgress({
                  ...newProgress,
                  progress_value: e.target.value,
                })
              }
            />
            <input
              className="input-field"
              placeholder="Notes"
              value={newProgress.notes}
              onChange={(e) =>
                setNewProgress({ ...newProgress, notes: e.target.value })
              }
            />
            <button onClick={handleAddProgress} className="btn btn-green">
              Log Progress
            </button>
          </div>

          {progressData.length === 0 ? (
            <p>No progress logged yet.</p>
          ) : (
            <ul className="progress-list">
              {progressData.map((p) => (
                <li key={p.id} className="progress-item">
                  <strong>{p.progress_value}</strong> — {p.notes}
                  {p.created_at || p.timestamp ? (
                    <span className="timestamp">
                      ({new Date(p.created_at || p.timestamp).toLocaleString()})
                    </span>
                  ) : null}
                  <button
                    onClick={() => handleDeleteProgress(p.id)}
                    className="btn btn-red"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
