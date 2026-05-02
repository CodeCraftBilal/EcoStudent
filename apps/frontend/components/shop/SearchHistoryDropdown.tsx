import { useEffect, useState, useRef } from "react";
import { Search, X, Clock, Trash2 } from "lucide-react";
import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { useSession } from "@/context/useSession";

interface SearchHistoryDropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelectSearch: (query: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export default function SearchHistoryDropdown({
  isOpen,
  setIsOpen,
  onSelectSearch,
  inputRef,
}: SearchHistoryDropdownProps) {
  const [history, setHistory] = useState<{ searchid: number; query: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { session } = useSession();

  const fetchHistory = async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const res = await authFetch(`${BACKEND_URL}/search-history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Failed to fetch search history", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, session]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen, inputRef]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const res = await authFetch(`${BACKEND_URL}/search-history/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.searchid !== id));
      }
    } catch (error) {
      console.error("Failed to delete search history item", error);
    }
  };

  const handleClearAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await authFetch(`${BACKEND_URL}/search-history`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHistory([]);
      }
    } catch (error) {
      console.error("Failed to clear search history", error);
    }
  };

  if (!isOpen) return null;
  if (!session) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
    >
      <div className="p-3">
        <div className="flex justify-between items-center mb-2 px-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Recent Searches
          </span>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
        ) : history.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No recent searches
          </div>
        ) : (
          <ul className="max-h-60 overflow-y-auto">
            {history.map((item) => (
              <li
                key={item.searchid}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                onClick={() => {
                  onSelectSearch(item.query);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center space-x-3 text-gray-700">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{item.query}</span>
                </div>
                <button
                  onClick={(e) => handleDelete(e, item.searchid)}
                  className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-red-50"
                  title="Remove from history"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
