import { api } from "./api";

export async function uploadProfilePicture(formData: FormData) {
  const { data } = await api.post("/upload/profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.newProfilePicture;
}

export async function uploadGroupProfilePicture(formData: FormData) {
  const { data } = await api.post("/upload/group-profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.newProfilePicture;
}