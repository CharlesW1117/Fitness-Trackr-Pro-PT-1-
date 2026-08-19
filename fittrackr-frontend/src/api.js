// src/api.js
const API_URL = process.env.REACT_APP_API_URL;

// 🧩 LOGIN USER
export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Login failed.");
  }
  return data;
}

// 🧩 REGISTER USER
export async function registerUser(username, password) {
  const response = await fetch(`${API_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Registration failed.");
  }
  return data;
}

// 🧩 GET ALL USERS
export async function getUsers() {
  const response = await fetch(`${API_URL}/api/users`);
  if (!response.ok) {
    throw new Error(`Error fetching users: ${response.statusText}`);
  }
  return response.json();
}

// 🧩 GET ALL ROUTINES
export async function getRoutines() {
  const response = await fetch(`${API_URL}/api/routines`);
  if (!response.ok) {
    throw new Error(`Error fetching routines: ${response.statusText}`);
  }
  return response.json();
}

// 🧩 CREATE NEW ROUTINE
export async function createRoutine(token, routineData) {
  const response = await fetch(`${API_URL}/api/routines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(routineData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create routine.");
  }
  return data;
}

// === GOALS ===
export async function getGoals(token) {
  const response = await fetch(`${API_URL}/api/goals`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

export async function addGoal(token, goalData) {
  const response = await fetch(`${API_URL}/api/goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: goalData.name,
      description: goalData.description,
      target: parseInt(goalData.target),
    }),
  });
  return response;
}

export async function deleteGoal(token, id) {
  const response = await fetch(`${API_URL}/api/goals/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export async function editGoal(token, id, editedGoal) {
  const response = await fetch(`${API_URL}/api/goals/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(editedGoal),
  });
  return response;
}

// === PROGRESS ===
export async function viewProgress(token, goalId) {
  const response = await fetch(`${API_URL}/api/progress/${goalId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

export async function addProgress(token, goalId, newProgress) {
  const response = await fetch(`${API_URL}/api/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      goal_id: goalId,
      progress_value: parseInt(newProgress.progress_value),
      notes: newProgress.notes,
    }),
  });
  return response;
}

export async function deleteProgress(token, id) {
  const response = await fetch(`${API_URL}/api/progress/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}
