import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  getRoutineById,
  deleteRoutine,
  addSetToRoutine,
  deleteSetFromRoutine,
} from "../api/routines";
import { getActivities } from "../api/activities";

export default function RoutineDetails() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [routine, setRoutine] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activityId, setActivityId] = useState("");
  const [count, setCount] = useState("");
  const [error, setError] = useState(null);

  // Load routine and activities
  useEffect(() => {
    async function fetchData() {
      try {
        const routineData = await getRoutineById(routineId);
        setRoutine(routineData);
        const activityData = await getActivities();
        setActivities(activityData);
      } catch {
        setError("Failed to load routine details.");
      }
    }
    fetchData();
  }, [routineId]);

  // Delete routine
  async function handleDeleteRoutine() {
    try {
      await deleteRoutine(routineId, token);
      navigate("/routines");
    } catch (err) {
      setError(err.message);
    }
  }

  // Add set
  async function handleAddSet(event) {
    event.preventDefault();
    setError(null);

    try {
      await addSetToRoutine(token, {
        activityId: Number(activityId),
        routineId: Number(routineId),
        count: Number(count),
      });
      const updated = await getRoutineById(routineId);
      setRoutine(updated);
      setActivityId("");
      setCount("");
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete set
  async function handleDeleteSet(setId) {
    try {
      await deleteSetFromRoutine(setId, token);
      const updated = await getRoutineById(routineId);
      setRoutine(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <p>{error}</p>;
  if (!routine) return <p>Loading...</p>;

  return (
    <main>
      <h2>{routine.name}</h2>
      <p><strong>Goal:</strong> {routine.goal}</p>
      <p><strong>Created by:</strong> {routine.creatorName}</p>

      {token && (
        <button onClick={handleDeleteRoutine}>Delete Routine</button>
      )}

      <h3>Sets</h3>
      {routine.sets && routine.sets.length > 0 ? (
        <ul>
          {routine.sets.map((set) => (
            <li key={set.id}>
              Activity ID {set.activityId} – Reps: {set.count}
              {token && (
                <button onClick={() => handleDeleteSet(set.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No sets yet — add one below!</p>
      )}

      {token && (
        <form onSubmit={handleAddSet}>
          <h3>Add a Set</h3>
          <label>
            Activity:
            <select
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
              required
            >
              <option value="">Select an activity</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Reps:
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              required
            />
          </label>
          <button type="submit">Add Set</button>
        </form>
      )}
    </main>
  );
}
