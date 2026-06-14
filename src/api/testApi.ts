import axiosInstance from "./axiosConfig";

export const getSubjectsApi = async () => {
  return await axiosInstance.get("/api/subjects");
};

export const getTopicsApi = async (subjectId: string) => {
  return await axiosInstance.get(`/api/topics/subject/${subjectId}`);
};

export const getSubTopicsApi = async (topicId: string) => {
  return await axiosInstance.get(`/api/sub-topics/topic/${topicId}`);
};

export const createTestApi = async (payload: any) => {
  return await axiosInstance.post("/api/tests", payload);
};

export const updateTestApi = async(id: string, payload: any) =>{
  return await axiosInstance.put(`/api/tests/${id}`, payload);
}