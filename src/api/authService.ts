import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/auth"; // backend URL - TypeScript file

export interface User {
  id: number;
  full_name: string;
  email: string;
  username: string;
  role: "student" | "teacher";
  address?: string;
  age?: number;
  image?: string;
  teacher_dept_id?: number; // only for teachers
}

export interface SignupData {
  full_name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
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


// Students and Teachers interfaces
export interface SchoolStudent {
  full_name: string;
  classes: number;
  email: string;
  institution_type: string;
}

export interface CollegeStudent {
  full_name: string;
  department: string;
  email: string;
  institution_type: string;
}

export interface SchoolTeacher {
  full_name: string;
  subject: string;
  email: string;
  institution_type: string;
}

export interface CollegeTeacher {
  full_name: string;
  department: string;
  email: string;
  institution_type: string;
}

export interface StudentsResponse {
  school_students: SchoolStudent[];
  college_students: CollegeStudent[];
}

export interface TeachersResponse {
  school_teachers: SchoolTeacher[];
  college_teachers: CollegeTeacher[];
}

// Signup request
export const signup = async (userData: SignupData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login request
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Logout
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("authToken");
};

// Get current user info
export const getMe = async (): Promise<User> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


// Update profile request
export const updateProfile = async (data: UpdateUser): Promise<User> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await axios.put(`${API_URL}/me/update`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


// Get all students (school + college)
export const getStudents = async (): Promise<StudentsResponse> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await axios.get(`${API_URL}/students`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get all teachers (school + college)
export const getTeachers = async (): Promise<TeachersResponse> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await axios.get(`${API_URL}/teachers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};