import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createAttendance, getAttendance } from "../api/attendanceService";
import { getTeachers } from "../api/authService";

const StudentAttendancePage = () => {
  const [records, setRecords] = useState([]);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");

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

  if (loading) return <p>Loading attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-25">
      <h2 className="text-xl font-bold mb-4">My Attendance</h2>

      <div className="mb-6">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Mark Attendance
        </button>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Teacher</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec.id} className="border">
              <td className="px-4 py-2 border">{rec.id}</td>
              <td className="px-4 py-2 border">{rec.teacher.full_name}</td>
              <td className="px-4 py-2 border">{rec.status}</td>
              <td className="px-4 py-2 border">
                {new Date(rec.date).toLocaleString()}
              </td>
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

export default StudentAttendancePage;
