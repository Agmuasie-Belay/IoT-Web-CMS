import apiClient from "./client";

/*
|--------------------------------------------------------------------------
| Public Contact
|--------------------------------------------------------------------------
*/

export const getContactPage = async () => {
  const response = await apiClient.get("/contact");
  return response.data;
};

export const getMainOffice = async () => {
  const response = await apiClient.get("/contact/main-office");
  return response.data;
};

export const getDepartments = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/contact/departments?${query}` : "/contact/departments";
  const response = await apiClient.get(url);
  return response.data;
};

export const getQuickCards = async () => {
  const response = await apiClient.get("/contact/quick-cards");
  return response.data;
};

export const getContactSocialLinks = async () => {
  const response = await apiClient.get("/contact/social-links");
  return response.data;
};

export const getCampusAddress = async () => {
  const response = await apiClient.get("/contact/campus-address");
  return response.data;
};

export const getOfficeHours = async () => {
  const response = await apiClient.get("/contact/office-hours");
  return response.data;
};

export const submitContactForm = async (data) => {
  const response = await apiClient.post("/contact/submit", data);
  return response.data;
};

/*
|--------------------------------------------------------------------------
| CMS Contact (Admin)
|--------------------------------------------------------------------------
*/

export const upsertMainOffice = async (data) => {
  const response = await apiClient.put("/cms/contact/main-office", data);
  return response.data;
};

export const createDepartment = async (data) => {
  const response = await apiClient.post("/cms/contact/departments", data);
  return response.data;
};

export const getAdminDepartments = async () => {
  const response = await apiClient.get("/cms/contact/departments");
  return response.data;
};

export const updateDepartment = async (id, data) => {
  const response = await apiClient.put(`/cms/contact/departments/${id}`, data);
  return response.data;
};

export const deleteDepartment = async (id) => {
  await apiClient.delete(`/cms/contact/departments/${id}`);
};

export const createQuickCard = async (data) => {
  const response = await apiClient.post("/cms/contact/quick-cards", data);
  return response.data;
};

export const getAdminQuickCards = async () => {
  const response = await apiClient.get("/cms/contact/quick-cards");
  return response.data;
};

export const updateQuickCard = async (id, data) => {
  const response = await apiClient.put(`/cms/contact/quick-cards/${id}`, data);
  return response.data;
};

export const deleteQuickCard = async (id) => {
  await apiClient.delete(`/cms/contact/quick-cards/${id}`);
};

export const upsertCampusAddress = async (data) => {
  const response = await apiClient.put("/cms/contact/campus-address", data);
  return response.data;
};

export const createOfficeHour = async (data) => {
  const response = await apiClient.post("/cms/contact/office-hours", data);
  return response.data;
};

export const getAdminOfficeHours = async () => {
  const response = await apiClient.get("/cms/contact/office-hours");
  return response.data;
};

export const updateOfficeHour = async (id, data) => {
  const response = await apiClient.put(`/cms/contact/office-hours/${id}`, data);
  return response.data;
};

export const deleteOfficeHour = async (id) => {
  await apiClient.delete(`/cms/contact/office-hours/${id}`);
};

export const getSubmissions = async () => {
  const response = await apiClient.get("/cms/contact/submissions");
  return response.data;
};

export const updateSubmissionStatus = async (id, status) => {
  const response = await apiClient.patch(
    `/cms/contact/submissions/${id}/status`,
    { status }
  );
  return response.data;
};