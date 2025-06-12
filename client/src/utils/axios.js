
import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

// Main Axios instance (with interceptors)
const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Separate plain Axios instance (no interceptors) for refresh
const plainAxios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Add token to all outgoing requests
Axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("AccessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors globally with refresh logic, except for COD endpoint
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if it's already retried once
    if (error.response && error.response.status === 401 && !originalRequest._retry) {

      // Don't retry on specific endpoints like COD
      if (originalRequest.url.includes("/order/create/cod")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("RefreshToken");

      if (!refreshToken) {
        console.warn("❌ No refresh token found — logging out");
        logoutUser();
        return Promise.reject(error); // Stop the loop
      }

      try {
        console.log("🔁 Attempting token refresh...");
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {
          console.log("✅ Token refreshed. Retrying original request...");
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Axios(originalRequest);
        } else {
          console.warn("❌ Failed to refresh token — logging out");
          logoutUser();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error("❌ Refresh attempt failed:", refreshError);
        logoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


// Function to refresh access token
const refreshAccessToken = async (refreshToken) => {
  try {
    const res = await plainAxios({
      ...SummaryApi.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    console.log("🧪 Refresh response:", res.data);

    const { AccessToken } = res.data.data;

    if (AccessToken) {
      localStorage.setItem("AccessToken", AccessToken);
      return AccessToken;
    }

    return null;
  } catch (error) {
    console.error("❌ Failed to refresh access token:", error);
    return null;
  }
};

// Handle logout: clear storage + redirect
const logoutUser = () => {
  console.warn("🚪 Logging out user...");
  localStorage.removeItem("AccessToken");
  localStorage.removeItem("RefreshToken");
  window.location.href = "/login";
};

export default Axios;
