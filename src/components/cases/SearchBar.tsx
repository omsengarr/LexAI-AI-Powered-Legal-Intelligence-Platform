import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search legal cases..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 pr-14 text-white outline-none focus:border-cyan-400"
      />

      <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

export default SearchBar;