const API_URL = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

async function request(path, options = {}) {
  if (!API_URL) {
    throw new Error(
      "REACT_APP_API_URL is not set. Add it in .env and rebuild the frontend.",
    );
  }

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed (${response.status})`);
  }

  return data;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function loginUser(username, password) {
  return request("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function registerUser(username, password) {
  return request("/api/users/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function getGoals(token) {
  return request("/api/goals", {
    headers: authHeaders(token),
  });
}

export async function addGoal(token, goalData) {
  return request("/api/goals", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      name: goalData.name,
      description: goalData.description,
      target: parseInt(goalData.target, 10),
    }),
  });
}

export async function deleteGoal(token, id) {
  return request(`/api/goals/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function editGoal(token, id, editedGoal) {
  return request(`/api/goals/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(editedGoal),
  });
}

export async function viewProgress(token, goalId) {
  return request(`/api/progress/${goalId}`, {
    headers: authHeaders(token),
  });
}

export async function addProgress(token, goalId, newProgress) {
  return request("/api/progress", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      goal_id: goalId,
      progress_value: parseInt(newProgress.progress_value, 10),
      notes: newProgress.notes,
    }),
  });
}

export async function deleteProgress(token, id) {
  return request(`/api/progress/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
