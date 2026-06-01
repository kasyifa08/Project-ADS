import api from "../api/axios";

export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const res = await api.post(
    "/tickets/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data.foto_url;
};