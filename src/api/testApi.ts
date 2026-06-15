import axiosInstance from "./axiosConfig";

export const getSubjectsApi = async () => {
  return await axiosInstance.get("/subjects");
};

export const getTopicsApi = async (subjectId: string) => {
  return await axiosInstance.get(`/topics/subject/${subjectId}`);
};

export const getSubTopicsApi = async (topicId: string) => {
  return await axiosInstance.get(`/sub-topics/topic/${topicId}`);
};

export const createTestApi = async (payload: any) => {
  return await axiosInstance.post("/tests", payload);
};

export const updateTestApi = async(id: string, payload: any) =>{
  return await axiosInstance.put(`/tests/${id}`, payload);
}
// In testApi.ts
export const getTestById = (id: string) => {
  if (!id) {
    return Promise.reject(new Error('Test ID is required'));
  }
  return axiosInstance.get(`/tests/${id}`);
};

// Bulk Create Questions API
export const createBulkQuestionsApi = async (questions: any[]) => {
  return axiosInstance.post("/questions/bulk", { questions });
};

// Publish Test API
export const publishTestApi = async (testId: string, payload?: any) => {
  return axiosInstance.put(`/tests/${testId}`, payload || { status: "live" });
};