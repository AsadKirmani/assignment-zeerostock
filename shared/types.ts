export interface SortConfig<T> {
  key: keyof T | null;
  direction: "asc" | "desc";
}

export interface Column<T> {
  header: string;
  key: keyof T | "actions";
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface User {
  id: number;
  name: string;
  email: string;
  company?: {
    name: string;
  };
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  rollNumber: number;
  age: number | null;
}
export interface Marks {
  id: string;
  studentId: string;
  subject: string;
  score: number;
}
export interface ApiResponse<T> {
  status: "success" | "error";
  data: T | null;
  message?: string;
}
export interface FetchStudentsArgs {
  page: number;
  limit: number;
  sortField: string;
  sortOrder: "asc" | "desc" | string;
  search: string;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort: (key: keyof T) => void;
  sortConfig: SortConfig<T>;
}


type ModalType = "create" | "view" | "edit" | "delete" | null;

export interface StudentModalProps {
  type: ModalType;
  student: Student;
  marks: Marks[];
  editForm: {
    name: string;
    rollNumber: string | number;
    grade: string;
    age: string | number;
    subject: string;
    score: string;
  };
  onClose: () => void;
  onEditFormChange: (form: {
    name: string;
    rollNumber: string | number;
    grade: string;
    age: string | number;
    subject: string;
    score: string;
  }) => void;
  onSave: (
    updatedStudent: Student,
    updatedMarks: Marks[],
    freshMarksToCreate?: { subject: string; score: number }[],
  ) => void;
  onDelete: () => void;
}