import apiClient from "./client";

/*
|--------------------------------------------------------------------------
| Public Footer
|--------------------------------------------------------------------------
*/

export const getFooterData = async () => {
  const response = await apiClient.get("/footer");
  return response.data;
};

export const getFooterNavigation = async (group) => {
  const url = group ? `/footer/navigation?group=${group}` : "/footer/navigation";
  const response = await apiClient.get(url);
  return response.data;
};

export const getFooterSocialLinks = async () => {
  const response = await apiClient.get("/footer/social-links");
  return response.data;
};

export const getFooterContactInfo = async () => {
  const response = await apiClient.get("/footer/contact-info");
  return response.data;
};

/*
|--------------------------------------------------------------------------
| CMS Footer (Admin)
|--------------------------------------------------------------------------
*/

export const createFooterNavigation = async (data) => {
  const response = await apiClient.post("/cms/footer/navigation", data);
  return response.data;
};

export const getAdminFooterNavigation = async () => {
  const response = await apiClient.get("/cms/footer/navigation");
  return response.data;
};

export const updateFooterNavigation = async (id, data) => {
  const response = await apiClient.put(`/cms/footer/navigation/${id}`, data);
  return response.data;
};

export const deleteFooterNavigation = async (id) => {
  await apiClient.delete(`/cms/footer/navigation/${id}`);
};

export const createFooterSocialLink = async (data) => {
  const response = await apiClient.post("/cms/footer/social-links", data);
  return response.data;
};

export const getAdminFooterSocialLinks = async () => {
  const response = await apiClient.get("/cms/footer/social-links");
  return response.data;
};

export const updateFooterSocialLink = async (id, data) => {
  const response = await apiClient.put(`/cms/footer/social-links/${id}`, data);
  return response.data;
};

export const deleteFooterSocialLink = async (id) => {
  await apiClient.delete(`/cms/footer/social-links/${id}`);
};

export const upsertFooterContactInfo = async (data) => {
  const response = await apiClient.put("/cms/footer/contact-info", data);
  return response.data;
};