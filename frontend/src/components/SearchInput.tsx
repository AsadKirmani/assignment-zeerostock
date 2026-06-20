import type { SearchInputProps } from "@shared/types";
export default function SearchInput({ value, onChange }: SearchInputProps) {
    return (
        <div className="mb-4">
        <input
          type="text"
          placeholder="Search students..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-4 py-2 w-full md:w-80 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
    );
}