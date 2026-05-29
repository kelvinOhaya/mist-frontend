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

export interface Message {
  _id?: string;
  sender: Pick<User, "username" | "profilePicture"> & {
    _id?: string;
  };
  chatRoom?: string;
  content: string;
  createdAt?: string | number;
  updatedAt?: string;
}

export interface Credentials {
  username: string;
  password: string;
}
