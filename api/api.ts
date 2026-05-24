import axios, { type AxiosError } from "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig<D = any> {
    retry?: boolean;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

type TokenGetter = () => string | null;
type TokenSetter = (
  newAccessToken: string | null,
  newRefreshToken: string | null,
) => void;

export const registerAuthInterceptors = (
  getToken: TokenGetter,
  setTokens: TokenSetter,
  getRefreshToken: TokenGetter,
) => {
  const requestInterceptor = api.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization =
        `Bearer ${token}`;
    }

    return config;
  });

  const responseInterceptor = api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const originalRequest = error.config;

      if (
        !originalRequest ||
        error.response?.status !== 401 ||
        originalRequest.retry ||
        originalRequest.url?.includes("/auth/refresh-token") ||
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/signup")
      ) {
        return Promise.reject(error);
      }

      originalRequest.retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await api.post("/auth/refresh-token", {
          refreshToken,
        });

        setTokens(data.accessToken, data.refreshToken);

        const headers = originalRequest.headers ?? {};
        (headers as Record<string, string>).Authorization =
          `Bearer ${data.accessToken}`;
        originalRequest.headers = headers;

        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    },
  );

  return () => {
    api.interceptors.request.eject(requestInterceptor);
    api.interceptors.response.eject(responseInterceptor);
  };
};
