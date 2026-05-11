const API = import.meta.env.VITE_API;

/**
 * Get all routines
 */
export async function getRoutines() {
  try {
    const response = await fetch(API + "/routines");
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * Get a single routine by id (includes sets)
 */
export async function getRoutineById(id) {
  try {
    const response = await fetch(API + "/routines");
    const routines = await response.json();

    // API doesn't have /routines/:id, so we filter client-side
    const routine = routines.find((r) => r.id === Number(id));
    if (!routine) {
      throw Error("Routine not found");
    }
    return routine;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

/**
 * Create a new routine (requires token)
 */
export async function createRoutine(token, routine) {
  if (!token) {
    throw Error("You must be signed in to create a routine.");
  }

  const response = await fetch(API + "/routines", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(routine),
  });

  const result = await response.json();

  if (!response.ok) {
    throw Error(result.message || "Failed to create routine.");
  }

  return result;
}

/**
 * Delete a routine (requires token, must be creator)
 */
export async function deleteRoutine(id, token) {
  if (!token) {
    throw Error("You must be signed in to delete a routine.");
  }

  const response = await fetch(API + "/routines/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message || "Failed to delete routine.");
  }
}

/**
 * Add a set to a routine (requires token)
 * { activityId, routineId, count }
 */
export async function addSetToRoutine(token, { activityId, routineId, count }) {
  if (!token) {
    throw Error("You must be signed in to add a set.");
  }

  const response = await fetch(API + "/sets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ activityId, routineId, count }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw Error(result.message || "Failed to add set.");
  }

  return result;
}

/**
 * Delete a set from a routine (requires token)
 */
export async function deleteSetFromRoutine(id, token) {
  if (!token) {
    throw Error("You must be signed in to delete a set.");
  }

  const response = await fetch(API + "/sets/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message || "Failed to delete set.");
  }
}
