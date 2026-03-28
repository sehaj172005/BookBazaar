import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? `${process.env.BACKEND_URL}/api`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000"}/api`;

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params || "");
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("bb_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally (token expired)
API.interceptors.response.use(
  (res) => {
    console.log(`[API RESPONSE] ${res.config.method?.toUpperCase()} ${res.config.url} => ${res.status}`);
    return res;
  },
  (err) => {
    console.error(`[API ERROR] ${err.config?.method?.toUpperCase()} ${err.config?.url} =>`, err.response?.status, err.message);
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("bb_token");
      localStorage.removeItem("bb_user");
      window.location.href = "/auth";
    }
    return Promise.reject(err);
  }
);

const ROOT_URL = process.env.NODE_ENV === "production"
  ? ""
  : (process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000");

export const getImageUrl = (path) => {
  if (!path) return "/placeholder-book.png";
  if (path.startsWith("http")) return path; // already absolute

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${ROOT_URL}${normalizedPath}`;
};

// ===================== AUTH =====================
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// ===================== BOOKS =====================
export const getBooks = (params) => API.get("/books", { params });
export const getBook = (id) => API.get(`/books/${id}`);
export const createBook = (formData) =>
  API.post("/books", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteBook = (id) => API.delete(`/books/${id}`);
export const getBooksBySeller = (userId) => API.get(`/books/user/${userId}`);

// ===================== REQUESTS =====================
export const sendRequest = (bookId) => API.post("/requests", { bookId });
export const getSentRequests = () => API.get("/requests/sent");
export const getReceivedRequests = () => API.get("/requests/received");
export const updateRequestStatus = (id, status) => API.put(`/requests/${id}`, { status });
export const completeRequest = (id) => API.put(`/requests/${id}/complete`);

// ===================== CHAT =====================
export const getChats = () => API.get("/chat");
export const sendMessage = (requestId, message) =>
  API.post("/chat/send", { requestId, message });
export const getMessages = (requestId) => API.get(`/chat/${requestId}`);

// ===================== PROFILE =====================
export const getProfileMe = () => API.get("/profile/me");
export const updateProfile = (data) => API.put("/profile/me", data);

// ===================== AI =====================
export const getAIPriceSuggestion = (data) => API.post("/ai/price-suggestion", data);
export const detectAICondition = (data) => API.post("/ai/detect-condition", data);
export const aiSearch = (query) => API.post("/ai/search", { query });

export default API;
