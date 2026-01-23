import api from "./api";

// ---------------------- ✅ Report Card APIs ----------------------

export const getStudentReportCardSummary = async (
  studentId: number,
  academicYear: string,
  semester?: string,
  term?: string
): Promise<any> => {
  const params = new URLSearchParams({ academic_year: academicYear });
  if (semester) params.append("semester", semester);
  if (term) params.append("term", term);
  
  const res = await api.get(`/report-cards/student/${studentId}/summary?${params.toString()}`);
  return res.data;
};

export const getReportCards = async (filters: any = {}): Promise<any[]> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  
  const res = await api.get(`/report-cards/?${params.toString()}`);
  return res.data;
};

export const createReportCard = async (reportCardData: any): Promise<any> => {
  const res = await api.post("/report-cards/", reportCardData);
  return res.data;
};

export const updateReportCard = async (reportCardId: number, reportCardData: any): Promise<any> => {
  const res = await api.put(`/report-cards/${reportCardId}`, reportCardData);
  return res.data;
};

export const deleteReportCard = async (reportCardId: number): Promise<void> => {
  await api.delete(`/report-cards/${reportCardId}`);
};

export const getClassReportSummary = async (filters: any): Promise<any> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  
  const res = await api.get(`/report-cards/class/summary?${params.toString()}`);
  return res.data;
};

export const publishReportCards = async (reportCardIds: number[]): Promise<any> => {
  const res = await api.post("/report-cards/publish", reportCardIds);
  return res.data;
};