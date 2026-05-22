import axios, { AxiosError } from "axios";
import useActiveTab from "@contexts/activeTab/useActiveTab";
declare module "axios" {
  export interface InternalAxiosRequestConfig<D = any> {
    retry?: boolean;
  }
}
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

function useApi() {
  const { navigate } = useActiveTab();

  //function that intercepts requests and tries to add an access token if needed, and will retry a request under certain conditions
  const injectAuthToken = (
    getToken: () => string | null,
    setTokens: (
      newAccessToken: string | null,
      newRefreshToken: string | null,
    ) => void,
    getRefreshToken: () => string | null,
  ) => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      //request for the object that will be sent out
      const token = getToken(); //get the LATEST token (has to be a function because javascript won't update otherwise)
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`; //if the token exists, send it in this format
      }
      return config; //let the config continue on its way
    });

    //response interceptor. if all goes well, just return the result. Otherwise, do the following function.
    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        //get the error object
        const originalRequest = error.config;

        if (
          originalRequest &&
          error.response?.status === 401 &&
          !originalRequest?.retry &&
          !originalRequest?.url?.includes("/auth/refresh-token") &&
          !originalRequest?.url?.includes("/auth/login") &&
          !originalRequest?.url?.includes("/auth/signup")
        ) {
          originalRequest.retry = true;

          try {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            const { data } = await api.post("/auth/refresh-token", {
              refreshToken: refreshToken,
            });

            const newAccessToken = data.accessToken;
            const newRefreshToken = data.refreshToken;

            setTokens(newAccessToken, newRefreshToken);

            api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
          } catch (refreshError) {
            navigate("Login");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  };

  return { api, injectAuthToken };
}

export default useApi;
