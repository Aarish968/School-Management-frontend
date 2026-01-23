import api from "./api";

// ---------------------- ✅ Grade APIs ----------------------

export const getStudentGradesSummary = async (
  studentId: number,
  academicYear: string,
  semester?: string,
  term?: string
): Promise<any> => {
  const params = new URLSearchParams({ academic_year: academicYear });
  if (semester) params.append("semester", semester);
  if (term) params.append("term", term);
  
  const res = await api.get(`/grades/student/${studentId}/summary?${params.toString()}`);
  return res.data;
};

export const getGrades = async (filters: any = {}): Promise<any[]> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  
  const res = await api.get(`/grades/?${params.toString()}`);
  return res.data;
};

export const createGrade = async (gradeData: any): Promise<any> => {
  const res = await api.post("/grades/", gradeData);
  return res.data;
};

export const updateGrade = async (gradeId: number, gradeData: any): Promise<any> => {
  const res = await api.put(`/grades/${gradeId}`, gradeData);
  return res.data;
};

export const deleteGrade = async (gradeId: number): Promise<void> => {
  await api.delete(`/grades/${gradeId}`);
};

export const publishGrades = async (gradeIds: number[]): Promise<any> => {
  const res = await api.post("/grades/publish", gradeIds);
  return res.data;
};