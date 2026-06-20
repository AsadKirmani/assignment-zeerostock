import type { FormEvent } from "react";
import { useState } from "react";
import type { Student } from "@shared/types";
import { studentSchema } from "@shared/schemas";
import { LucideTrash, LucideX } from "lucide-react";
import type { StudentModalProps } from "@shared/types";

export default function StudentModal({
  type,
  student,
  marks,
  editForm,
  onClose,
  onEditFormChange,
  onDelete,
  onSave,
}: StudentModalProps) {
  if (!type || !student) return null;
  const [newMarksList, setNewMarksList] = useState<
    { subject: string; score: string }[]
  >([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const handleAddFieldRow = () => {
    setNewMarksList([...newMarksList, { subject: "", score: "" }]);
  };

  const handleRemoveFieldRow = (indexToRemove: number) => {
    setNewMarksList(newMarksList.filter((_, idx) => idx !== indexToRemove));
  };

  const handleNewMarkChange = (
    index: number,
    key: "subject" | "score",
    value: string,
  ) => {
    const updatedList = [...newMarksList];
    updatedList[index] = { ...updatedList[index]!, [key]: value };
    setNewMarksList(updatedList);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = studentSchema.safeParse(editForm);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue: any) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const updatedStudent: Student = {
      ...student,
      name: result.data.name,
      rollNumber: result.data.rollNumber,
      grade: result.data.grade,
      age: result.data.age,
    };

    const formattedFreshMarks = newMarksList
      .filter((m) => m.subject.trim() !== "")
      .map((m) => ({
        subject: m.subject.trim().toLowerCase(),
        score: Number(m.score) || 0,
      }));

    onSave(updatedStudent, marks, formattedFreshMarks);
  };

  const handleMarkScoreChange = (markId: string, newScore: string) => {
    marks.forEach((m, idx) => {
      if (m.id === markId) {
        marks[idx].score = Number(newScore) || 0;
      }
    });
    onEditFormChange({ ...editForm, score: newScore });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        {type === "view" && (
          <div className="space-y-3 overflow-y-auto max-h-[90vh] pr-1 relative">
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-gray-700 p-2 flex items-center justify-center hover:bg-gray-100 rounded-full hover:text-gray-700 transition focus:outline-none"
            >
              <LucideX className="w-5 h-5" />
            </button>
            <div className="text-center border-b-2 border-gray-100 pb-4">
              <h3 className="text-xl font-black text-gray-900 tracking-wide uppercase">
                Student Progress Report
              </h3>
              <p className="text-xs text-gray-500 font-semibold tracking-widest mt-0.5">
                ACADEMIC YEAR 2026
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-bold text-gray-800">Name:</span>{" "}
                {student.name}
              </p>
              <p className="text-gray-600">
                <span className="font-bold text-gray-800">Roll Number:</span> #
                {student.rollNumber}
              </p>
              <p className="text-gray-600">
                <span className="font-bold text-gray-800">Grade/Class:</span>{" "}
                {student.grade}
              </p>
              <p className="text-gray-600">
                <span className="font-bold text-gray-800">Age:</span>{" "}
                {student.age ?? "N/A"}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Subject Performance
              </h4>
              {marks.length === 0 ? (
                <p className="text-gray-400 text-sm italic py-2">
                  No academic score entries recorded for this student instance.
                </p>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-xs overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                    <thead className="bg-gray-100 font-bold text-gray-600 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5">Subject</th>
                        <th className="px-4 py-2.5 text-center">Maximum</th>
                        <th className="px-4 py-2.5 text-center">
                          Marks Obtained
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white text-gray-700 font-medium">
                      {marks.map((mark) => (
                        <tr key={mark.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-2.5 uppercase text-gray-600 font-semibold">
                            {mark.subject}
                          </td>
                          <td className="px-4 py-2.5 text-center text-gray-400">
                            100
                          </td>
                          <td
                            className={`px-4 py-2.5 text-center font-bold ${mark.score < 40 ? "text-red-600" : "text-gray-900"}`}
                          >
                            {mark.score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {marks.length > 0 &&
              (() => {
                const totalScore = marks.reduce((sum, m) => sum + m.score, 0);
                const maxPossibleScore = marks.length * 100;
                const averageScore = Number(
                  (totalScore / marks.length).toFixed(1),
                );
                const percentage = Number(
                  ((totalScore / maxPossibleScore) * 100).toFixed(1),
                );
                const hasFailedSubject = marks.some((m) => m.score < 40);
                const passStatus =
                  !hasFailedSubject && averageScore >= 40 ? "PASSED" : "FAILED";

                return (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Total Marks
                        </p>
                        <p className="text-lg font-black text-gray-900 mt-0.5">
                          {totalScore}
                          <span className="text-xs font-normal text-gray-400">
                            /{maxPossibleScore}
                          </span>
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Average
                        </p>
                        <p className="text-lg font-black text-gray-900 mt-0.5">
                          {averageScore}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Percentage
                        </p>
                        <p className="text-lg font-black text-gray-900 mt-0.5">
                          {percentage}%
                        </p>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-lg text-center font-bold text-sm border tracking-wide transition-colors ${
                        passStatus === "PASSED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      RESULT STATUS: {passStatus}{" "}
                      {passStatus === "FAILED" && (
                        <span className="text-xs block font-medium mt-0.5 text-red-500">
                          (Contains sub-passing scores lower than 40)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
          </div>
        )}

        {(type === "edit" || type === "create") && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 max-h-[80vh] overflow-y-auto p-1 relative scrollbar-thin"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-0 right-0 text-gray-700 p-2 flex items-center justify-center hover:bg-gray-100 rounded-full hover:text-gray-700 transition focus:outline-none"
            >
              <LucideX className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900">
              {type === "create"
                ? "Register New Student Profile"
                : "Edit Student Profile"}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  onEditFormChange({ ...editForm, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              {fieldErrors.name && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Roll Number
              </label>
              <input
                type="number"
                value={editForm.rollNumber}
                onChange={(e) =>
                  onEditFormChange({ ...editForm, rollNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              {fieldErrors.rollNumber && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {fieldErrors.rollNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Grade
              </label>
              <input
                type="text"
                value={editForm.grade}
                onChange={(e) =>
                  onEditFormChange({ ...editForm, grade: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              {fieldErrors.grade && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {fieldErrors.grade}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Age
              </label>
              <input
                type="number"
                value={editForm.age}
                onChange={(e) =>
                  onEditFormChange({ ...editForm, age: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {fieldErrors.age && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {fieldErrors.age}
                </p>
              )}
            </div>

            {type === "edit" && (
              <div className="border-t border-gray-100 pt-3 mt-2 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Subject Scores
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddFieldRow}
                    className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold px-2.5 py-1 rounded transition"
                  >
                    + Add Subject
                  </button>
                </div>

                {marks.length > 0 &&
                  marks.map((mark) => (
                    <div key={mark.id}>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                        {mark.subject}
                      </label>
                      <input
                        type="number"
                        value={mark.score}
                        onChange={(e) =>
                          handleMarkScoreChange(mark.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                  ))}

                {newMarksList.map((newItem, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-end bg-gray-50 p-3 border border-dashed border-gray-200 rounded-lg relative"
                  >
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                        Subject Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Maths"
                        value={newItem.subject}
                        onChange={(e) =>
                          handleNewMarkChange(index, "subject", e.target.value)
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 bg-white rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                        Score
                      </label>
                      <input
                        type="number"
                        placeholder="0-100"
                        min="0"
                        max="100"
                        value={newItem.score}
                        onChange={(e) =>
                          handleNewMarkChange(index, "score", e.target.value)
                        }
                        className="w-full px-3 py-1.5 border border-gray-300 bg-white rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFieldRow(index)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-md bg-white border border-gray-200 transition text-sm flex items-center justify-center h-[38px] w-[38px]"
                      title="Remove row"
                    >
                      <LucideTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {marks.length === 0 && newMarksList.length === 0 && (
                  <p className="text-xs text-gray-400 italic py-1">
                    No marks entries present. Click the button above to add
                    scores.
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-md transition"
              >
                {type === "create" ? "Create Student" : "Save Form"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium py-2 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {type === "delete" && (
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Confirm Action
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to completely erase{" "}
              <strong>{student?.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-md transition"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium py-2 rounded-md transition"
              >
                Abort
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
