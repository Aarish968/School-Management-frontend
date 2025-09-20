import api from "./api";

export const createAttendance = async (teacherId) => {
  try {
    const res = await api.post("/attendance/", { teacher_id: teacherId });
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Error creating attendance" };
  }
};

export const getAttendance = async () => {
  try {
    const res = await api.get("/attendance/");
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Error fetching attendance" };
  }
};

export const updateAttendance = async (attendanceId, status) => {
  try {
    const res = await api.put(`/attendance/${attendanceId}/accept`, null, {
      params: { status },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Error updating attendance" };
  }
};
