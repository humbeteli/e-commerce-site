import { useEffect, useState } from "react";
import type { Product } from "../../types/product"; 
import './Search.css'

type Props = {
  onSelect: (product: Product) => void;
  onSearchSubmit?: (filteredProducts: Product[]) => void; 
   onFocus?: () => void;
};

const Search = ({ onSelect, onSearchSubmit, onFocus }: Props) => {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=194")
      .then((res) => res.json())
      .then((data) => setAllProducts(data.products || []));
  }, []);


  const results = query
    ? allProducts.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(query.toLowerCase())) ||
        p.category.toLowerCase() === query.toLowerCase()
      )
    : [];

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (results.length > 0) {
       
        if (onSearchSubmit) {
          onSearchSubmit(results);
        } else {
          
          onSelect(results[0]);
        }
        setQuery("");
      }
    }
  };

  return (
    <div className="search-wrapper">
      <input
        className="search-input"
        value={query}
        placeholder="Brands, products, category"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleEnter}
        onFocus={onFocus}
      />

      {query && (
        <div className="search-list">
          <p className="search-item-title">Relevant results</p>
          {results.length > 0 ? (
            results.slice(0, 10).map((p) => ( 
              <div
                key={p.id}
                className="search-item"
                onClick={() => {
                  onSelect(p);
                  setQuery("");
                }}
              >
                <div className="search-item-info">
                  <span className="search-title">{p.title}</span>
                  {p.brand && <span className="search-brand">in {p.brand}</span>}
                </div>
              </div>
            ))
          ) : (
            <div className="search-item">No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;