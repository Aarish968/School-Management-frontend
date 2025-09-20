import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createAttendance,
  getAttendance,
  updateAttendance,
} from "../api/attendanceService";
import { getTeachers } from "../api/authService"; // your teachers API

const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const role = currentUser?.role ?? null;
  const institutionType = currentUser?.institution_type ?? null;

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAttendance();
      setRecords(data);
    } catch (err) {
      setError(err.detail || "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const openModal = async () => {
    try {
      const data = await getTeachers();
      // Filter based on institution type
      if (institutionType === "school") {
        setTeachers(data.school_teachers);
      } else if (institutionType === "college") {
        setTeachers(data.college_teachers);
      }
      setShowModal(true);
    } catch (err) {
      alert(err.detail || "Failed to fetch teachers");
    }
  };

  const handleCreate = async () => {
    if (!selectedTeacher) {
      alert("Please select a teacher");
      return;
    }
    try {
      await createAttendance(selectedTeacher);
      setShowModal(false);
      setSelectedTeacher("");
      fetchAttendance();
    } catch (err) {
      alert(err.detail || "Failed to create attendance");
    }
  };

  const handleUpdate = async (attendanceId, status) => {
    try {
      await updateAttendance(attendanceId, status);
      fetchAttendance();
    } catch (err) {
      alert(err.detail || "Failed to update attendance");
    }
  };

  if (loading) return <p>Loading attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Attendance</h2>

      {/* Student: create attendance */}
      {role === "student" && (
        <div className="mb-10">
          <button
            onClick={openModal}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Mark Attendance
          </button>
        </div>
      )}

      {/* Attendance list */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Student</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Date</th>
            {role === "teacher" && (
              <th className="px-4 py-2 border">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec.id} className="border">
              <td className="px-4 py-2 border">{rec.id}</td>
              <td className="px-4 py-2 border">{rec.student_id}</td>
              <td className="px-4 py-2 border">{rec.status}</td>
              <td className="px-4 py-2 border">
                {new Date(rec.date).toLocaleString()}
              </td>
              {role === "teacher" && (
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleUpdate(rec.id, "present")}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdate(rec.id, "absent")}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Select Teacher</h3>
            <select
              className="w-full border px-3 py-2 mb-4"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="">-- Select a teacher --</option>
              {teachers.map((t, i) => (
                <option key={i} value={t.id}>
                  {t.full_name} ({t.email})
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
