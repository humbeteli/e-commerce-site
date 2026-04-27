import { useState, useMemo, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "../../components/Pagination/Pagination";
import SearchFilterBar from "../../components/SearchFilterBar/SearchFilterBar";
import { SORT_OPTIONS } from "../../components/sortOptions";
import type { SortOption } from "../../components/sortOptions";
import { useProducts } from "../../hooks/useProducts";
import type { Product } from "../../types/product";
import "./MainMenu.css";

type Props = {
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  searchResults: Product[] | null;
  setSearchResults: (p: Product[] | null) => void;
  onAddToCart: (p: Product) => void;
  onToggleFavorite: (id: number) => void;
  favorites: number[];
};

const MainMenu = ({
  selectedCategory,
  searchResults,
  setSearchResults,
  onAddToCart,
  onToggleFavorite,
  favorites,
}: Props) => {
  const [page, setPage] = useState(1);
  const [activeSort, setActiveSort] = useState<SortOption>(SORT_OPTIONS[0]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading, isError } = useProducts(selectedCategory, page);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [selectedCategory, page]);

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const limit = 28;

  const sortedSearchResults = useMemo(() => {
    if (!searchResults) return null;
    if (!activeSort.sortBy) return searchResults;

    return [...searchResults].sort((a, b) => {
      const key = activeSort.sortBy as keyof Product;
      const valA = a[key] as number;
      const valB = b[key] as number;

      if (activeSort.order === "asc") return valA - valB;
      return valB - valA;
    });
  }, [searchResults, activeSort]);

  const displayProducts = sortedSearchResults ?? products;

  const handleBack = () => {
    setSearchResults(null);
    setActiveSort(SORT_OPTIONS[0]);
  };

  if (isError) {
    return <p style={{ textAlign: "center" }}>Error loading products</p>;
  }

  return (
    <div className="sfrbar">
      {searchResults && (
        <SearchFilterBar
          resultCount={searchResults.length}
          activeSort={activeSort}
          onSortChange={setActiveSort}
          viewMode={viewMode}
          onViewChange={setViewMode}
          onBack={handleBack}
        />
      )}

      {isLoading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="sk-img shimmer"></div>
              <div className="sk-brand shimmer"></div>
              <div className="sk-title shimmer"></div>
              <div className="sk-title2 shimmer"></div>
              <div className="sk-rating shimmer"></div>
              <div className="sk-price shimmer"></div>
              <div className="sk-btn shimmer"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div
            className={`products ${viewMode === "list" ? "products--list" : ""}`}
          >
            {displayProducts.length > 0 ? (
              displayProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={onAddToCart}
                  onFavorite={() => onToggleFavorite(p.id)}
                  isFav={favorites.includes(p.id)}
                />
              ))
            ) : (
              <p style={{ textAlign: "center" }}>No products found</p>
            )}
          </div>

          {!searchResults && total > limit && (
            <Pagination
              page={page}
              setPage={setPage}
              total={total}
              limit={limit}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MainMenu;