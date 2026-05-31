import { useEffect, useState } from "react";
import type { Product } from "../../types/product";
import ProductCard from "../ProductCard/ProductCard";
import "./HomeSection.css";

type Props = {
  onAddToCart: (p: Product) => void;
  onToggleFavorite: (id: number) => void;
  favorites: number[];
  onCategorySelect: (cat: string) => void;
};

type GroupItem = { key: string; label: string; image: string };

type CategoryGroup = {
  label: string;
  key: string;
  image: string;
  items: GroupItem[];
};

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    label: "Fashion",
    key: "womens-dresses",
    image: "/categories/fashion.webp",
    items: [
      { key: "mens-shirts", label: "Mens Shirts", image: "/categories/mens-shirts.webp" },
      { key: "mens-shoes", label: "Mens Shoes", image: "/categories/mens-shoes.webp" },
      { key: "mens-watches", label: "Mens Watches", image: "/categories/mens-watches.webp" },
      { key: "womens-dresses", label: "Womens Dresses", image: "/categories/womens-dresses.webp" },
      { key: "womens-shoes", label: "Womens Shoes", image: "/categories/womens-shoes.webp" },
      { key: "womens-bags", label: "Womens Bags", image: "/categories/womens-bags.webp" },
      { key: "womens-jewellery", label: "Womens Jewellery", image: "/categories/womens-jewellery.webp" },
      { key: "womens-watches", label: "Womens Watches", image: "/categories/womens-watches.webp" },
      { key: "sunglasses", label: "Sunglasses", image: "/categories/sunglasses.webp" },
    ],
  },
  {
    label: "Beauty",
    key: "beauty",
    image: "/categories/beauty.webp",
    items: [
      { key: "beauty", label: "Cosmetics", image: "/categories/cosmetics.webp" },
      { key: "fragrances", label: "Fragrances", image: "/categories/fragrances.webp" },
    ],
  },
  {
    label: "Electronics",
    key: "smartphones",
    image: "/categories/electronics.webp",
    items: [
      { key: "smartphones", label: "Smartphones", image: "/categories/smartphones.webp" },
      { key: "laptops", label: "Laptops", image: "/categories/laptops.webp" },
      { key: "tablets", label: "Tablets", image: "/categories/tablets.webp" },
      { key: "mobile-accessories", label: "Mobile Accessories", image: "/categories/mobile-accessories.webp" },
    ],
  },
  {
    label: "Home",
    key: "furniture",
    image: "/categories/home.webp",
    items: [
      { key: "furniture", label: "Furniture", image: "/categories/furniture.webp" },
      { key: "home-decoration", label: "Home Decoration", image: "/categories/home-decoration.webp" },
      { key: "kitchen-accessories", label: "Kitchen Accessories", image: "/categories/kitchen-accessories.webp" },
    ],
  },
  {
    label: "Sports",
    key: "sports-accessories",
    image: "/categories/sports.webp",
    items: [
      { key: "sports-accessories", label: "Sports Accessories", image: "/categories/sports-accessories.webp" },
      { key: "sports-accessories", label: "Balls", image: "/categories/balls.webp" },
    ],
  },
  {
    label: "Automotive",
    key: "vehicle",
    image: "/categories/automotive.webp",
    items: [
      { key: "motorcycle", label: "Motorcycle", image: "/categories/motorcycle.webp" },
      { key: "vehicle", label: "Vehicle", image: "/categories/vehicle.webp" },
    ],
  },
  {
    label: "Food",
    key: "groceries",
    image: "/categories/food.webp",
    items: [
      { key: "groceries", label: "Groceries", image: "/categories/groceries.webp" },
      { key: "groceries", label: "Fruits & Vegetables", image: "/categories/fruits.webp" },
    ],
  },
];

const CategoryRow = ({
  group,
  onCategorySelect,
}: {
  group: CategoryGroup;
  onCategorySelect: (cat: string) => void;
}) => {
  const [index, setIndex] = useState(0);
  const hasMultiple = group.items.length > 1;

  const allSlides = [
    { key: group.key, label: group.label, image: group.image },
    ...group.items,
  ];

  const active = allSlides[index];

  const prev = () => setIndex((i) => (i === 0 ? allSlides.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === allSlides.length - 1 ? 0 : i + 1));

  return (
    <div
      className="cat-row"
      style={{
        backgroundImage: `url(${active.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="cat-row-overlay" />

      <button className="cat-row-arrow" onClick={prev}>
        <img src="/images/prev-pic-w.svg" alt="prev" />
      </button>

      <div className="cat-row-content">
        <span className="cat-row-label">{active.label}</span>
        <button
          className="cat-row-shop-btn"
          onClick={() => onCategorySelect(active.key)}
        >
          Shop Now
        </button>
      </div>

      <div className="cat-row-image" />

      {hasMultiple ? (
        <button className="cat-row-arrow" onClick={next}>
          <img src="/images/next-pic-w.svg" alt="next" />
        </button>
      ) : (
        <div className="cat-row-arrow-placeholder" />
      )}
    </div>
  );
};

const HomeSection = ({
  onAddToCart,
  onToggleFavorite,
  favorites,
  onCategorySelect,
}: Props) => {
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
          <button
            className="hero-btn"
            onClick={() => onCategorySelect("__all__")}
          >
            Shop Now
          </button>
        </div>
        <div className="hero-visual">
          <div className="hero-circle" />
        </div>
      </div>

      {/* category rows */}
      <div className="home-block">
        <div className="cat-rows">
          {CATEGORY_GROUPS.map((group) => (
            <CategoryRow
              key={group.label}
              group={group}
              onCategorySelect={onCategorySelect}
            />
          ))}
        </div>
      </div>

      {/* on sale */}
      {onSale.length > 0 && (
        <div className="home-block">
         <div className="sale-section">
            <h2 className="home-block-title">
              <img src="/images/sale.svg" alt="" /> On Sale
            </h2>
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

        </div>
      )}

      {/* top rated */}
      {topRated.length > 0 && (
        <div className="home-block">
          <div className="sale-section">
            <h2 className="home-block-title">
              <img src="/images/star.svg" alt="" /> Top Rated
            </h2>
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

        </div>
      )}

    </div>
  );
};

export default HomeSection;