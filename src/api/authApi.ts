import type { Credentials, User } from "../types";
import { api } from "./api";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface checkIfUsernameExistsErrors {
  fieldsAreEmpty: boolean;
  passwordsDoNotMatch: boolean;
  passwordUnderEightCharacters: boolean;
  usernameIsAlreadyTaken: boolean;
}

export async function checkIfUsernameExists(credentials: { username: string }) {
  const { data } = await api.post("/auth/verify-signup", credentials);

  return data.usernameExists;
}

export async function signUp(credentials: Credentials) {
  const { data } = await api.post<AuthTokens>("/auth/signup", credentials);
  return data;
}

export async function login(credentials: Credentials) {
  const { data } = await api.post<AuthTokens>("/auth/login", credentials);
  return data;
}

export async function refreshToken(refreshTokenValue: string) {
  const { data } = await api.post<AuthTokens>("/auth/refresh-token", {
    refreshToken: refreshTokenValue,
  });

  return data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function fetchUser(token?: string): Promise<User> {
  const previousAuthorization = api.defaults.headers.common.Authorization;

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  try {
    const { data } = await api.get<{ user: User }>("/auth/me");
    return data.user;
  } finally {
    if (previousAuthorization) {
      api.defaults.headers.common.Authorization = previousAuthorization;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }
}
