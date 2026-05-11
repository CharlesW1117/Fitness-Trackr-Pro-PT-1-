import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getRoutines, createRoutine } from "../api/routines";

export default function RoutinesPage() {
  const { token } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");

  // Load all routines when the page mounts
  useEffect(() => {
    async function fetchRoutines() {
      try {
        const data = await getRoutines();
        setRoutines(data);
      } catch {
        setError("Failed to load routines.");
      }
    }
    fetchRoutines();
  }, []);

  // Handle creating a new routine
  async function handleCreateRoutine(event) {
    event.preventDefault();
    setError(null);

    try {
      const newRoutine = await createRoutine(token, { name, goal });
      setRoutines((prev) => [...prev, newRoutine]);
      setName("");
      setGoal("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main>
      <h1>Routines</h1>

      {error && <p role="alert">{error}</p>}

      {token && (
        <form onSubmit={handleCreateRoutine}>
          <h2>Create a New Routine</h2>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Goal:
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
          </label>
          <button type="submit">Create Routine</button>
        </form>
      )}

      <ul>
        {routines.map((routine) => (
          <li key={routine.id}>
            <a href={`/routines/${routine.id}`}>{routine.name}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
