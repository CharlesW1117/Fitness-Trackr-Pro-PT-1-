import { Link } from "react-router-dom";

export default function ActivityList({ activities }) {
  return (
    <ul>
      {activities.map((activity) => (
        <li key={activity.id}>
          <h3>
            <Link to={`/activities/${activity.id}`}>{activity.name}</Link>
          </h3>
          <p>{activity.description}</p>
        </li>
      ))}
    </ul>
  );
}
