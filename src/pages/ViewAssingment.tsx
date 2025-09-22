// src/pages/AssignmentsList.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignments } from "../api/assignmentApi";
import type { Assignment } from "../api/assignmentApi";

export default function AssignmentsList() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAssignments()
      .then(setAssignments)
      .catch((err) => console.error("Failed to fetch assignments", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Assignments</h1>
      <div className="grid gap-4">
        {assignments.map((a) => (
          <div
            key={a.id}
            className="bg-white shadow-md p-4 rounded-xl cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/assignments/${a.id}`)}
          >
            <h2 className="text-lg font-semibold">{a.title}</h2>
            <p className="text-gray-600">{a.description}</p>
            <p className="text-sm text-gray-500">
              Due: {a.due_date} {a.due_time || ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
