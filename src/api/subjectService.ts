import api from "./api";

// ---------------------- ✅ Subject APIs ----------------------

export const getSubjects = async (filters: any = {}): Promise<any[]> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  
  const res = await api.get(`/subjects/?${params.toString()}`);
  return res.data;
};

export const createSubject = async (subjectData: any): Promise<any> => {
  const res = await api.post("/subjects/", subjectData);
  return res.data;
};

export const getSubjectById = async (subjectId: number): Promise<any> => {
  const res = await api.get(`/subjects/${subjectId}`);
  return res.data;
};

export const updateSubject = async (subjectId: number, subjectData: any): Promise<any> => {
  const res = await api.put(`/subjects/${subjectId}`, subjectData);
  return res.data;
};

export const deleteSubject = async (subjectId: number): Promise<void> => {
  await api.delete(`/subjects/${subjectId}`);
};