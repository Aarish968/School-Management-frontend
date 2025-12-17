import api from "./api";

export interface UserDetail {
  id: number;
  full_name: string;
  email: string;
  username: string;
  role: "student" | "teacher";
  address?: string;
  age?: number;
  image?: string;
  teacher_dept_id?: number;
  subject?: string;
  classes?: number;
  department?: string;
  institution_type?: string;
}

export const getUserById = async (userId: number): Promise<UserDetail> => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};

export const getAllUsers = async (): Promise<UserDetail[]> => {
  const res = await api.get("/users/");
  return res.data;
};
