import type { Product } from "../../types/product"; 
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useAddToCartFeedBack } from "../../hooks/useAddToCartFeedBack"; 

type Props = {
  product: Product;
  onAdd: (p: Product) => void;
  onFavorite: () => void;
  isFav: boolean;
};

const ProductCard = ({ product, onAdd, onFavorite, isFav }: Props) => {
  const navigate = useNavigate();
  const {added, trigger} = useAddToCartFeedBack()

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite();
  };

  const hasDiscount =
    product.discountPercentage && product.discountPercentage > 0;
  const oldPrice = hasDiscount
    ? Math.round(product.price / (1 - (product.discountPercentage || 0) / 100))
    : null;

  return (
    <div className="card" onClick={() => navigate(`/product/${product.id}`)}>
      {hasDiscount && (
        <div className="discount-badge">
          -{Math.round(product.discountPercentage || 0)}%
        </div>
      )}

      <div
        className={`favorite-icon ${isFav ? "active" : ""}`}
        onClick={toggleFavorite}
      >
        <img
          src="/images/heart-product.svg"
          alt="favorite"
          className="icon-normal"
        />
        <img
          src="/images/heart-mouse-over.svg"
          alt="favorite hover"
          className="icon-hover"
        />
        <img
          src="/images/heart-fav-active.svg"
          alt="favorite active"
          className="icon-active"
        />
      </div>

      <img
        src={product.thumbnail}
        alt={product.title}
        className="product-img"
      />

      <div className="product-info">
        {product.brand && <span className="brand-name">{product.brand}</span>}
        <h3>{product.title}</h3>

        {product.rating && (
          <div className="rating">
            <span className="star">★</span> {product.rating}
          </div>
        )}

        <div className="price-container">
          <span className="current-price">{product.price} $</span>
          {oldPrice && <span className="old-price">{oldPrice} $</span>}
        </div>

        {product.stock && product.stock < 10 && (
          <p className="low-stock">
            Hurry up! Only {product.stock} left in stock!
          </p>
        )}
      </div>
      {added && <span className="added-text">Added to Cart!</span>}
      <button
        className="add-btn"
        onClick={(e) => {
          e.stopPropagation();
          onAdd(product);
          trigger()
        }}
      >
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;
