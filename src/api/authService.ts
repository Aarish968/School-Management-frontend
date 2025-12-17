import api from "./api";




// ---------------------- ✅ Types ----------------------
export interface User {
  id: number;
  full_name: string;
  email: string;
  username: string;
  role: "student" | "teacher";
  institution_type?: "school" | "college";
  address?: string;
  age?: number;
  image?: string;
  teacher_dept_id?: number;
}

export interface SignupData {
  full_name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  username?: string;
  institution_type?: "school" | "college";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user?: User;
  message?: string;
}

export interface UpdateUser {
  full_name?: string;
  address?: string;
  age?: number;
  image?: string;
  teacher_dept_id?: number;
}

export interface StudentsResponse {
  school_students: Array<{ id: number; full_name: string; classes: number; email: string; institution_type: string }>;
  college_students: Array<{ id: number; full_name: string; department: string; email: string; institution_type: string }>;
}

export interface TeachersResponse {
  school_teachers: Array<{ id: number; full_name: string; subject: string; email: string; institution_type: string }>;
  college_teachers: Array<{ id: number; full_name: string; department: string; email: string; institution_type: string }>;
}

// ---------------------- ✅ Auth APIs ----------------------

export const signup = async (userData: SignupData): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

export const login = async ({ email, password }: LoginData): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // return backend response as-is
};

export const getMe = async (): Promise<User> => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const updateProfile = async (data: UpdateUser | FormData): Promise<User> => {
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
  const res = await api.put("/auth/me/update", data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return res.data;
};

export const getStudents = async (): Promise<StudentsResponse> => {
  const res = await api.get("/auth/students");
  return res.data;
};

export const getTeachers = async (): Promise<TeachersResponse> => {
  const res = await api.get("/auth/teachers");
  return res.data;
};

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
};