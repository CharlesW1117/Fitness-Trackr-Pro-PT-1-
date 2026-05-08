import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getActivityById, deleteActivity } from "../api/activities";
import { useAuth } from "../auth/AuthContext";


export default function ActivityDetails() {
  const { activityId } = useParams(); // dynamic segment from URL
  const navigate = useNavigate();
  const { token } = useAuth();

  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const data = await getActivityById(activityId);
        setActivity(data);
      } catch {
        setError("Failed to load activity details.");
      }
    }

    fetchActivity();
  }, [activityId]);


  async function handleDelete() {
    try {
      await deleteActivity(activityId, token);
      navigate("/activities"); // redirect after deletion
    } catch (err) {
      alert("Error deleting activity: " + err.message);
    }
  }

  if (error) return <p>{error}</p>;
  if (!activity) return <p>Loading...</p>;

  return (
    <main>
      <h2>{activity.name}</h2>
      <p>{activity.description}</p>
      <p>
        <strong>Created by:</strong> {activity.creatorName || "Unknown"}
      </p>

      {token && (
        <button onClick={handleDelete}>Delete Activity</button>
      )}
    </main>
  );
}