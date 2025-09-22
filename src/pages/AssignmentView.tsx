// src/pages/AssignmentView.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssignmentById } from "../api/assignmentApi";
export type { Assignment } from "../api/assignmentApi";

export default function AssignmentView() {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getAssignmentById(Number(id))
      .then(setAssignment)
      .catch((err) => console.error("Failed to fetch assignment", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!assignment) return <div className="p-6 text-center text-red-500">Not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">{assignment.title}</h1>
        <p className="text-gray-600">{assignment.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Type:</span> {assignment.type || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Teacher ID:</span> {assignment.assigned_teacher_id}
          </div>
          <div>
            <span className="font-semibold">Due Date:</span> {assignment.due_date}
          </div>
          <div>
            <span className="font-semibold">Due Time:</span> {assignment.due_time || "N/A"}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mt-4">Students</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {assignment.students.map((s) => (
              <span
                key={s}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                Student {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mt-4">Attachments</h2>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {assignment.attachments.map((att) => (
              <div key={att.id} className="border rounded-lg overflow-hidden shadow-sm">
                {att.filename.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img
                    src={att.filepath}
                    alt={att.filename}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="p-4 text-sm text-gray-600">
                    📄 <a href={att.filepath} target="_blank" rel="noreferrer">{att.filename}</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
