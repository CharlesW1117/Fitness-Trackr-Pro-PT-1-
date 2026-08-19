import { useEffect, useState } from "react";
import "./Dashboard.css";
import Toast from "./Toast";
import ProgressChart from "./ProgressChart";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must log in first.");
      return;
    }

    fetch("http://localhost:3000/api/goals", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setGoals(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => setMessage("Failed to load goals"));
  }, []);

  const handleAddGoal = async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:3000/api/goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newGoal.name,
        description: newGoal.description,
        target: parseInt(newGoal.target),
      }),
    });
    window.location.reload();
  };

  const handleDeleteGoal = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/api/goals/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    window.location.reload();
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
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/api/goals/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedGoal),
    });
    setEditingGoal(null);
    window.location.reload();
  };

  const handleViewProgress = async (goalId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/progress/${goalId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProgressData(data);
    setSelectedGoal(goalId);
  };

  const handleAddProgress = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        goal_id: selectedGoal,
        progress_value: parseInt(newProgress.progress_value),
        notes: newProgress.notes,
      }),
    });

    if (res.ok) {
      setToast({
        message: "🔥 Progress logged! Keep pushing forward!",
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
    }

    setNewProgress({ progress_value: "", notes: "" });
    handleViewProgress(selectedGoal);
  };

  const handleDeleteProgress = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/progress/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setToast({
        message: "🗑️ Progress entry deleted successfully!",
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
    }

    handleViewProgress(selectedGoal);
  };

  return (
    <div className="dashboard-container">
      {/* === FITNESS BACKGROUND ELEMENTS === */}
      <div className="heartbeat-line"></div>
      <div className="dumbbell"></div>
      <div className="dumbbell"></div>
      <div className="dumbbell"></div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      <h2 className="dashboard-title">Dashboard</h2>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        className="btn btn-red logout-btn"
      >
        Logout
      </button>

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

      <ul className="goal-list">
        {goals.map((goal) => (
          <li key={goal.id} className="goal-item">
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
                <strong>{goal.name}</strong> — {goal.description}
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
              </>
            )}
          </li>
        ))}
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
