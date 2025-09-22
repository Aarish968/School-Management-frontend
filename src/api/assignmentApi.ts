import api from "./api";

export type Attachment = {
  id: number;
  filename: string;
  filepath: string;
};

export type Assignment = {
  id: number;
  title: string;
  description?: string;
  type?: string;
  assigned_teacher_id: number;
  due_date: string;
  due_time?: string | null;
  students: number[];
  attachments: Attachment[];
};

export const getAssignments = async (): Promise<Assignment[]> => {
  const res = await api.get<Assignment[]>("/assignments/assignments");
  return res.data;
};

export const getAssignmentById = async (id: number): Promise<Assignment> => {
  const res = await api.get<Assignment>(`/assignments/assignments/${id}`);
  return res.data;
};