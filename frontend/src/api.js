// api.js

const API_URL = "http://localhost:4000";

// ------------------------------
//  Pomocnicza funkcja do fetchy
// ------------------------------
async function apiFetch(endpoint, method = "GET", body = null, token = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, options);
  return res.json();
}

// ------------------------------
//  AUTH
// ------------------------------

export async function registerRequest(name, email, password) {
  return apiFetch("/register", "POST", { name, email, password });
}

export async function loginRequest(email, password) {
  return apiFetch("/login", "POST", { email, password });
}

// ------------------------------
//  COURSES
// ------------------------------

export async function getCourses() {
  return apiFetch("/courses");
}

// ------------------------------
//  CATEGORIES
// ------------------------------

export async function getCategories() {
  return apiFetch("/categories");
}

// ------------------------------
//  BASKET
// ------------------------------

export async function getBasket(userId, token) {
  return apiFetch(`/basket/${userId}`, "GET", null, token);
}

export async function addToBasket(userId, courseId, token) {
  return apiFetch(`/basket/${userId}/add`, "POST", { courseId }, token);
}

export async function removeFromBasket(userId, courseId, token) {
  return apiFetch(`/basket/${userId}/remove/${courseId}`, "DELETE", null, token);
}

// ------------------------------
//  CHECKOUT
// ------------------------------

export async function createCheckoutSession(userId, token) {
  return apiFetch(`/create-checkout-session/${userId}`, "POST", {}, token);
}

// ------------------------------
//  MY COURSES
// ------------------------------

export async function getMyCourses(userId, token) {
  return apiFetch(`/my-courses/${userId}`, "GET", null, token);
}
