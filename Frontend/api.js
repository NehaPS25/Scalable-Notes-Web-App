import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor → add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ---------------- NOTES ---------------- */

// List notes
export const listNotes = (q = "") =>
  axios.get(`${API_URL}/notes`, {
    params: { q },
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// Create note
export const createNote = (data) =>
  axios.post(`${API_URL}/notes`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// Update note
export const updateNote = (id, data) =>
  axios.put(`${API_URL}/notes/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// Delete note
export const deleteNote = (id) =>
  axios.delete(`${API_URL}/notes/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });


/* ---------------- AUTH ---------------- */

// Register
export const register = ({ name, email, password }) =>
  api.post("/register", {
    name: String(name || "").trim(),
    email: String(email || "").trim(),
    password: String(password || ""),
  });

// Login
export const login = ({ email, password }) =>
  api.post("/login", {
    email: String(email || "").trim(),
    password: String(password || ""),
  });
