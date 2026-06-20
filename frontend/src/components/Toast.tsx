import type { ToastProps } from "@shared/types";

export const Toast = ({ message, type, onClose }: ToastProps) => {
  setTimeout(onClose, 3000);
  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-md ${type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"} text-white`}
    >
      {message}
      <button onClick={onClose} className="ml-4 text-white font-bold">
        &times;
      </button>
    </div>
  );
};
