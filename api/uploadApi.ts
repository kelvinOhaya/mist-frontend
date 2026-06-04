import { api } from "./api";

export async function uploadProfilePicture(formData: FormData) {
  const { data } = await api.post("/upload/profile-picture", formData);

  return data.newProfilePicture;
}

export async function uploadGroupProfilePicture(formData: FormData) {
  const { data } = await api.post(
    "/upload/group-profile-picture",
    formData,
  );

  return data.newProfilePicture;
}