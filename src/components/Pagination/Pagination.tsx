import { useState } from "react";
import "./Pagination.css";

type Props = {
  page: number;
  setPage: (page: number) => void;
  total: number;
  limit: number;
};

const Pagination = ({ page, setPage, total, limit }: Props) => {
  const totalPages = Math.ceil(total / limit);
  const [open, setOpen] = useState(false);

  let visiblePages: number[] = [];

  if (page === 1) {
    visiblePages = [1, 2, 3];
  } else if (page === totalPages) {
    visiblePages = [totalPages - 2, totalPages - 1, totalPages];
  } else {
    visiblePages = [page - 1, page, page + 1];
  }

  visiblePages = visiblePages.filter((p) => p > 0 && p <= totalPages);

  return (
    <div id="pagination">
      {page > 1 && (
        <button title="Prev" onClick={() => setPage(page - 1)}>
          {"←"}
        </button>
      )}
      {visiblePages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={page === p ? "active" : ""}
        >
          {p}
        </button>
      ))}

      {page < totalPages && (
        <button title="Next" onClick={() => setPage(page + 1)}>
          {"→"}
        </button>
      )}

      <div className="pagination-more">
        <button title="More pages" onClick={() => setOpen(!open)}>
          •••
        </button>

        {open && (
          <div className="pagination-dropdown">
            {Array.from({ length: totalPages }, (_, i) => {
              const p = i + 1;
              return (
                <div
                  key={p}
                  className={`dropdown-item ${page === p ? "active" : ""}`}
                  onClick={() => {
                    setPage(p);
                    setOpen(false);
                  }}
                >
                  {p}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
