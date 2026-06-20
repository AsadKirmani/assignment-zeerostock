import { useState, useEffect } from "react";
import Table from "./components/Table";
import type { Column, SortConfig } from "@shared/types";
import type { Student } from "@shared/types";
import type { Marks } from "@shared/types";
import api from "./api";
import SearchInput from "./components/SearchInput";
import Pagination from "./components/Pagination";
import StudentModal from "./components/StudentModal";
import { Header } from "./layout/Header";
import { Toast } from "./components/Toast";
import { LucidePlus, LucideTrash } from "lucide-react";

type ModalType = "create" | "view" | "edit" | "delete" | null;

export default function App() {
  const [students, setStudent] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Marks[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig<Student>>({
    key: "id",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    rollNumber: "" as string | number,
    grade: "",
    age: "" as string | number,
    subject: "",
    score: "",
  });
  const id = selectedStudent?.id || "";

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          _page: String(currentPage),
          _limit: String(itemsPerPage),
          _sort: String(sortConfig.key || "id"),
          _order: sortConfig.direction,
          q: searchTerm,
        });

        const response = await api.get(`/students?${queryParams}`);
        const studentList: Student[] = await response.data.data;
        const countHeader = response.headers["x-total-count"] || "0";

        setStudent(studentList);
        setTotalItems(Number(countHeader));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchMarks = async () => {
      try {
        const response = await api.get(`/students/${id}/marks`);
        const marksData: Marks[] = await response.data.data;
        setMarks(marksData);
      } catch (error) {
        console.error("Error fetching marks:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
      if (id && (modalType === "view" || modalType === "edit")) {
        fetchMarks();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm, sortConfig, id]);

  const handleSort = (key: keyof Student) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedStudent(null);
    setEditForm({
      name: "",
      rollNumber: "" as string | number,
      grade: "",
      age: "" as string | number,
      subject: "",
      score: "",
    });
    setMarks([]);
  };
  const handleOpenAddModal = () => {
    setSelectedStudent({
      id: "",
      name: "",
      grade: "",
      rollNumber: 0,
      age: null,
    });

    setEditForm({
      name: "",
      rollNumber: "",
      grade: "",
      age: "",
      subject: "",
      score: "",
    });
    setModalType("create");
  };

  const handleSaveStudent = async (
    updatedStudent: Student,
    updatedMarks: Marks[],
    freshMarksToCreate?: { subject: string; score: number }[],
  ) => {
    setLoading(true);
    try {
      if (modalType === "create") {
        const response = await api.post(`/students`, {
          name: updatedStudent.name,
          grade: updatedStudent.grade,
          rollNumber: Number(updatedStudent.rollNumber),
          age: updatedStudent.age ? Number(updatedStudent.age) : null,
        });
        setToast({ message: "Student created successfully!", type: "success" });

        if (response.data?.data) {
          setStudent([response.data.data, ...students]);
        }
      } else if (modalType === "edit") {
        const { marks: dummy, ...studentPayload } = updatedStudent as any;
        await api.put(`/students/${updatedStudent.id}`, {
          name: studentPayload.name,
          grade: studentPayload.grade,
          rollNumber: Number(studentPayload.rollNumber),
          age: studentPayload.age ? Number(studentPayload.age) : null,
        });

        if (updatedMarks && updatedMarks.length > 0) {
          await Promise.all(
            updatedMarks.map((mark) =>
              api.put(`/students/${updatedStudent.id}/marks/${mark.id}`, {
                score: Number(mark.score),
                subject: mark.subject,
              }),
            ),
          );
        }
        if (freshMarksToCreate && freshMarksToCreate.length > 0) {
          await Promise.all(
            freshMarksToCreate.map((newMark) =>
              api.post(`/students/${updatedStudent.id}/marks`, {
                subject: newMark.subject,
                score: Number(newMark.score),
              }),
            ),
          );
        }

        setStudent(
          students.map((s) =>
            s.id === updatedStudent.id ? updatedStudent : s,
          ),
        );
        setToast({ message: "Student updated successfully!", type: "success" });
      }
    } catch (error) {
      setToast({
        message: "An error occurred while saving the student.",
        type: "error",
      });
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    try {
      await api.delete(`/students/${selectedStudent.id}`);
      setToast({ message: "Student deleted successfully!", type: "success" });
    } catch (error) {
      setToast({
        message: "An error occurred while deleting the student.",
        type: "error",
      });
      return;
    }
    setStudent(students.filter((s) => s.id !== selectedStudent.id));
    handleCloseModal();
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const columns: Column<Student>[] = [
    { header: "Roll Number", key: "rollNumber", sortable: true },
    { header: "Name", key: "name", sortable: true },
    { header: "Grade", key: "grade", sortable: true },
    {
      header: "Age",
      key: "age",
      sortable: true,
      render: (val) => val ?? "N/A",
    },
    {
      header: "Actions",
      key: "actions",
      render: (_, row) => (
        <div className="flex flex-col text-left">
          <button
            onClick={() => {
              setSelectedStudent(row);
              setModalType("view");
            }}
            className="w-full flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            View
          </button>
          <button
            onClick={() => {
              setSelectedStudent(row);
              setEditForm({
                name: row.name || "",
                rollNumber: String(row.rollNumber ?? ""),
                grade: row.grade || "",
                age: String(row.age ?? ""),
                subject: "",
                score: "",
              });
              setModalType("edit");
            }}
            className="w-full flex items-center px-4 py-2 text-xs hover:bg-emerald-50 transition font-medium border-b border-gray-200"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setSelectedStudent(row);
              setModalType("delete");
            }}
            className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition font-medium"
          >
            Delete
            <LucideTrash className="inline-block ml-1" size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header />
      <section className="p-4">
        <div className="p-6 max-w-6xl mx-auto font-sans antialiased text-gray-800 mt-20 border border-gray-100 rounded-lg shadow-sm">
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-2 ">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
            <button
              onClick={handleOpenAddModal}
              className="mb-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <LucidePlus className="inline-block mr-1" size={14} />
              New Student
            </button>
          </div>

          <div className="relative bg-white rounded-lg shadow border border-gray-200">
            {loading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex justify-center items-center z-10 font-semibold text-blue-600">
                Loading data...
              </div>
            )}
            <Table
              columns={columns}
              data={students}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            loading={loading}
            onPageChange={setCurrentPage}
          />

          <StudentModal
            type={modalType}
            student={selectedStudent as Student}
            marks={marks}
            editForm={editForm}
            onClose={() => setModalType(null)}
            onEditFormChange={setEditForm}
            onDelete={handleConfirmDelete}
            onSave={handleSaveStudent}
          />
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </section>
    </>
  );
}
