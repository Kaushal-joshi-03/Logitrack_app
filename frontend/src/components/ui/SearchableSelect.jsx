import { useState, useRef, useEffect } from "react";

export default function SearchableSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select or search city...",
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const containerRef = useRef(null);

  // Sync internal search term when external value changes
  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        // If user typed something not selected, restore value
        setSearchTerm(value || "");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value]);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes((searchTerm || "").toLowerCase().trim())
  );

  const handleSelect = (city) => {
    setSearchTerm(city);
    setIsOpen(false);
    if (onChange) {
      onChange({
        target: {
          name,
          value: city,
        },
      });
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="relative mt-2">
        <input
          type="text"
          name={name}
          value={isOpen ? searchTerm : value || ""}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className="
            h-12
            w-full
            border
            border-slate-200
            bg-slate-50
            px-4
            pr-10
            text-sm
            text-slate-900
            outline-none
            placeholder:text-slate-400
            focus:border-red-500/50
            focus:bg-white
            dark:border-white/10
            dark:bg-black/30
            dark:text-white
            dark:placeholder:text-slate-500
            dark:focus:border-red-500/50
          "
        />

        {/* Dropdown Chevron / Clear indicator */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-red-500" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1.5 shadow-xl backdrop-blur-md dark:border-white/15 dark:bg-[#0e0e0e] dark:shadow-[0_12px_32px_rgba(0,0,0,0.8)]">
          {filteredOptions.length > 0 ? (
            filteredOptions.slice(0, 100).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`
                  flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition
                  ${
                    opt.toLowerCase() === (value || "").toLowerCase()
                      ? "bg-red-500/10 text-red-600 font-bold dark:bg-red-500/15 dark:text-[#ff2438]"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                  }
                `}
              >
                <span>{opt}</span>
                {opt.toLowerCase() === (value || "").toLowerCase() && (
                  <span className="text-xs text-red-500">✓</span>
                )}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-center text-xs text-slate-600 dark:text-slate-400">
              No cities found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
