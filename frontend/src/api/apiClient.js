import axios from "axios";
import apiConstant from "./apiConstant";
import Cookies from "js-cookie";

class ApiClient {
  constructor() {
    this.endpoint = apiConstant;
    this.instance = axios.create({
      baseURL: this.endpoint.baseUrl,
      withCredentials: true,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        const token = Cookies.get("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const url = error.config?.url;

        const authEndpoints = [
          apiConstant.login,
          apiConstant.register,
          apiConstant.verifyOtp,
        ];

        const isAuthRequest = authEndpoints.some((endpoint) =>
          url?.includes(endpoint)
        );

        if (status === 401 && !isAuthRequest) {
          console.warn("Unauthorized - Token expired or invalid");

          setTimeout(() => {
            const currentToken = Cookies.get("token");
            if (!['/', '/login', '/register'].includes(window.location.pathname)) {
              Cookies.remove("token");
              window.location.replace("/login");
            }
          }, 1500);
        }

        return Promise.reject(error);
      }
    );
  }

  get(endpoint, config = {}) {
    return this.instance.get(endpoint, config);
  }
  post(endpoint, data, config = {}) {
    return this.instance.post(endpoint, data, config);
  }
  put(endpoint, data, config = {}) {
    return this.instance.put(endpoint, data, config);
  }
  delete(endpoint, config = {}) {
    return this.instance.delete(endpoint, config);
  }
}

const apiClient = new ApiClient();
export default apiClient;