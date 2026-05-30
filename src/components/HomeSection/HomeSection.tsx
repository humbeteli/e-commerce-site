import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import ProductCard from "../ProductCard/ProductCard";
import "./HomeSection.css";

const CATEGORIES = [
  { key: "fashion", label: "Fashion", icon: "/images/fashion-black.svg" },
  { key: "electronics", label: "Electronics", icon: "/images/electronics-black.svg" },
  { key: "beauty", label: "Beauty", icon: "/images/beauty-black.svg" },
  { key: "home", label: "Home", icon: "/images/home-black.svg" },
  { key: "sports", label: "Sports", icon: "/images/sports-black.svg" },
  { key: "food", label: "Food", icon: "/images/food-black.svg" },
];

const CATEGORY_MAP: { [key: string]: string } = {
  fashion: "mens-shirts",
  electronics: "smartphones",
  beauty: "beauty",
  home: "furniture",
  sports: "sports-accessories",
  food: "groceries",
};

type Props = {
  onAddToCart: (p: Product) => void;
  onToggleFavorite: (id: number) => void;
  favorites: number[];
  onCategorySelect: (cat: string) => void;
  
};

const HomeSection = ({ onAddToCart, onToggleFavorite, favorites, onCategorySelect }: Props) => {
  const navigate = useNavigate();
  const [onSale, setOnSale] = useState<Product[]>([]);
  const [topRated, setTopRated] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=194")
      .then((r) => r.json())
      .then((data) => {
        const all: Product[] = data.products;

        const sale = [...all]
          .filter((p) => p.discountPercentage && p.discountPercentage > 10)
          .sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0))
          .slice(0, 10);

        const rated = [...all]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10);

        setOnSale(sale);
        setTopRated(rated);
      });
  }, []);

  return (
    <div className="home-section">

      {/* hero */}
      <div className="hero-banner">
        <div className="hero-content">
          <p className="hero-sub">New arrivals every day</p>
          <h1 className="hero-title">Shop Everything<br />You Love</h1>
          <button className="hero-btn" onClick={() => navigate("/")}>
            Shop Now
          </button>
        </div>
        <div className="hero-visual">
          <div className="hero-circle" />
        </div>
      </div>

      {/* categories */}
      <div className="home-block">
        <h2 className="home-block-title">Shop by Category</h2>
        <div className="category-cards">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className="category-card"
              onClick={() => onCategorySelect(CATEGORY_MAP[cat.key])}
            >
              <div className="category-card-icon">
                <img src={cat.icon} alt={cat.label} />
              </div>
              <span>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* on sale */}
      {onSale.length > 0 && (
        <div className="home-block">
          <h2 className="home-block-title"><img src="/images/sale.svg" alt="" /> On Sale</h2>
          <div className="home-scroll">
            {onSale.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={onAddToCart}
                onFavorite={() => onToggleFavorite(p.id)}
                isFav={favorites.includes(p.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* top rated */}
      {topRated.length > 0 && (
        <div className="home-block">
          <h2 className="home-block-title"><img src="/images/star.svg" alt="" /> Top Rated</h2>
          <div className="home-scroll">
            {topRated.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={onAddToCart}
                onFavorite={() => onToggleFavorite(p.id)}
                isFav={favorites.includes(p.id)}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default HomeSection;