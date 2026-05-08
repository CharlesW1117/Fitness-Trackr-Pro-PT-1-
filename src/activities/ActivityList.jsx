import { useState } from "react";
import { deleteActivity } from "../api/activities";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function ActivityList({ activities }) {
  return (
    <ul>
      {activities.map((activity) => (
  <div key={activity.id}>
    <h3>
      <Link to={`/activities/${activity.id}`}>{activity.name}</Link>
    </h3>
    <p>{activity.description}</p>
  </div>
))}
    </ul>
  );
}

function ActivityListItem({ activity, syncActivities }) {
  const { token } = useAuth();

  const [error, setError] = useState(null);

  const tryDelete = async () => {
    setError(null);

    try {
      await deleteActivity(token, activity.id);
      syncActivities();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <li>
      <p>{activity.name}</p>
      {token && <button onClick={tryDelete}>Delete</button>}
      {error && <p role="alert">{error}</p>}
    </li>
  );
}
