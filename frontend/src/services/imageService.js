import api from "./api";

export const uploadImage = async (imageFile) => {
  const formData = new FormData();

  formData.append("file", imageFile);

  return await api.post("/api/images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};