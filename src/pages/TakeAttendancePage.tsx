import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAttendance, updateAttendance } from "../api/attendanceService";

const TeacherAttendancePage = () => {
  const [records, setRecords] = useState([]);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleUpdate = async (attendanceId, status) => {
    try {
      await updateAttendance(attendanceId, status);
      fetchAttendance();
    } catch (err) {
      alert(err.detail || "Failed to update attendance");
    }
  };

  if (loading) return <p>Loading attendance requests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-25">
      <h2 className="text-xl font-bold mb-4">Student Attendance Requests</h2>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Student Name</th>
            <th className="px-4 py-2 border">Student Email</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec.id} className="border">
              <td className="px-4 py-2 border">{rec.id}</td>
              <td className="px-4 py-2 border">{rec.student.full_name}</td>
              <td className="px-4 py-2 border">{rec.student.email}</td>
              <td className="px-4 py-2 border">{rec.status}</td>
              <td className="px-4 py-2 border">
                {new Date(rec.date).toLocaleString()}
              </td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherAttendancePage;
