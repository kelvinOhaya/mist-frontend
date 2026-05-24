export interface User {
  _id: string;
  username: string;
  currentChat: string | null;
  joinCode: string;
  profilePicture: {
    url?: string | null;
    public_Id?: string | null;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Credentials {
  username: string;
  password: string;
}
