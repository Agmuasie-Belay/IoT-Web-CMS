import apiClient from "./client";

export const getAboutOverview = async () => {
  const response = await apiClient.get("/cms/about/overview");
  return response.data;
};

export const createAboutOverview = async (data) => {
  const response = await apiClient.post("/cms/about/overview", data);
  return response.data;
};

export const updateAboutOverview = async (id, data) => {
  const response = await apiClient.put(
    `/cms/about/overview/${id}`,
    data
  );

  return response.data;
};

export const deleteAboutOverview = async (id) => {
  await apiClient.delete(`/cms/about/overview/${id}`);
};