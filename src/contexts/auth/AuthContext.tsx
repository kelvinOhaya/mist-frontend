import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Credentials, User } from "../../types";

export interface AuthContextValue {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  login: (
    credentials: { username: string; password: string },
    rememberMe: boolean,
  ) => Promise<number | undefined>;
  signUp: (credentials: Credentials, rememberMe: boolean) => Promise<number>;
  logout: () => Promise<void>;
  fetchUser: (token: string) => Promise<User | null | undefined>;
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
  refreshToken: string | null;
  setRefreshToken: Dispatch<SetStateAction<string | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoggingOut: boolean;
  setIsLoggingOut: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default AuthContext;