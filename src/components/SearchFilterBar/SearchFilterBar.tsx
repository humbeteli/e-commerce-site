import { useState, useRef, useEffect } from "react";
import "./SearchFilterBar.css";
import { SORT_OPTIONS } from "../sortOptions"; 
import type { SortOption } from "../sortOptions"; 

type Props = {
  resultCount: number;
  activeSort: SortOption;
  onSortChange: (opt: SortOption) => void;
  viewMode: "grid" | "list";
  onViewChange: (mode: "grid" | "list") => void;
  onBack: () => void;
};

const SearchFilterBar = ({
  resultCount,
  activeSort,
  onSortChange,
  onBack,
}: Props) => {
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (opt: SortOption) => {
    onSortChange(opt);
    setOpen(false);
  };

  return (
    <div className="sfbar">
      <button className="sfbar-back" onClick={onBack}>
        <img src="/images/back.svg" alt="back" />
        Back
      </button>
      <span className="sfbar-count">
        <strong>{resultCount}</strong> Product{resultCount !== 1 ? "s" : ""}{" "}
        found
      </span>

      {/* filter */}
      <div className="sfbar-right">
        <div className="sfbar-sort" ref={dropRef}>
          <button
            className={`sfbar-sort-btn ${open ? "sfbar-sort-btn--open" : ""}`}
            onClick={() => setOpen((v) => !v)}
          >
            <img className="filter-img" src="/images/filter.svg" alt="" />
            <span>{activeSort.label}</span>
            <img className="sfbar-chevron" src="/images/arrow1.svg" alt="" />
          </button>

          {open && (
            <ul className="sfbar-dropdown">
              {SORT_OPTIONS.map((opt) => (
                <li
                  key={opt.label}
                  className={`sfbar-option ${activeSort.label === opt.label ? "sfbar-option--active" : ""}`}
                  onClick={() => handleSelect(opt)}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>        
      </div>
    </div>
  );
};

export default SearchFilterBar;
