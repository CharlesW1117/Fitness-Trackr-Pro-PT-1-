export function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function saveToken(token, rememberMe) {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");

  if (rememberMe) {
    localStorage.setItem("token", token);
  } else {
    sessionStorage.setItem("token", token);
  }
}

export function clearToken() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}
