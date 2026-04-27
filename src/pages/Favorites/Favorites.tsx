import { useMemo } from "react";
import "./Favorites.css";
import type { Product } from "../../types/product";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useStore } from "../../store/useStore";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";

type Props = {
  items: Product[];
  allProducts: Product[];
};

const Favorites = ({ items, allProducts }: Props) => {
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, favorites } = useStore();

  // recommendation
  const recommended = useMemo(() => {
    if (items.length === 0) return [];

    const favCategories = Array.from(new Set(items.map((i) => i.category)));

    return allProducts
      .filter((p) => favCategories.includes(p.category))
      .slice(0, 8);
  }, [allProducts, items]);

  // loading
  if (!allProducts || allProducts.length === 0) {
    return <Spinner />;
  }

  return (
    <div>
      {items.length === 0 ? (
        <div className="empty-fav">
          <img src="/images/heart1.svg" />
          <span className="empty-fav-title">Your favorites list is empty</span>
          <span className="empty-fav-title2">
            Start exploring and click the heart icon to save items you love!
          </span>
          <button onClick={() => navigate("/")}>Start shopping</button>
        </div>
      ) : (
        <div className="products1">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={() => addToCart(p)}
              onFavorite={() => toggleFavorite(p.id)}
              isFav={true}
            />
          ))}
        </div>
      )}

      {recommended.length > 0 && (
        <div>
          <h3 className="similar-products-title">Based on your favorites</h3>
          <div className="similar-products">
            {recommended.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={() => addToCart(p)}
                onFavorite={() => toggleFavorite(p.id)}
                isFav={favorites.includes(p.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
