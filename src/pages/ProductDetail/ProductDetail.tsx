import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "../../types/product";
import "./ProductDetail.css";
import { useAddToCartFeedBack } from "../../hooks/useAddToCartFeedBack";
import { useStore } from "../../store/useStore";
import Spinner from "../../components/Spinner/Spinner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, favorites } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const { added, trigger } = useAddToCartFeedBack();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const [userReviews, setUserReviews] = useState<
    {
      name: string;
      comment: string;
      rating: number;
      date: string;
    }[]
  >([]);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [commentHover, setCommentHover] = useState(0);

  useEffect(() => {
    if (!id) return;
    let ignore = false;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data: Product = await res.json();
        if (!ignore) {
          setProduct(data);
          setActiveImg(0);
          setQty(1);

          const savedRating = localStorage.getItem(`rating-${id}`);
          setUserRating(savedRating ? Number(savedRating) : 0);

          const savedReviews = localStorage.getItem(`reviews-${id}`);
          setUserReviews(savedReviews ? JSON.parse(savedReviews) : []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleRating = (star: number) => {
    setUserRating(star);
    localStorage.setItem(`rating-${id}`, String(star));
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    trigger();
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim() || !commentName.trim() || commentRating === 0)
      return;

    const newReview = {
      name: commentName,
      comment: commentText,
      rating: commentRating,
      date: new Date().toISOString(),
    };

    const updated = [newReview, ...userReviews];
    setUserReviews(updated);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updated));

    setCommentName("");
    setCommentText("");
    setCommentRating(0);
  };

  if (!product) return <Spinner />;

  const isFav = favorites.includes(product.id);
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];

  const stockPercent = Math.min((product.stock / 100) * 100, 100);
  const stockColor =
    product.stock > 50 ? "#16a34a" : product.stock > 20 ? "#f59e0b" : "#e74c3c";

  return (
    <>
      <div className="detail-container">
        <button className="detail-back-btn" onClick={() => navigate(-1)}>
          <img src="/images/back.svg" alt="" />
          Back
        </button>

        <div className="details">
          {/* galery */}
          <div className="detail-gallery">
            <div className="gallery-main">
              <img
                src={images[activeImg]}
                alt={product.title}
                className="gallery-main-img"
              />
            </div>

            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className={`gallery-thumb ${activeImg === i ? "gallery-thumb--active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* info */}
          <div className="details-title">
            {product.brand && (
              <span className="detail-brand">{product.brand}</span>
            )}

            <h1>{product.title}</h1>

            {/* rating */}
            <div className="detail-rating-row">
              <img src="/images/star.svg" className="detail-rating-star"></img>
              <span className="detail-rating-val">{product.rating}</span>
              <span className="detail-rating-label">Rating</span>
            </div>

            {/* user rating */}
            <div className="detail-user-rating">
              <span className="detail-user-rating-label">Your rating:</span>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star-icon ${(hoverRating || userRating) >= star ? "star-icon--active" : ""}`}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
              {userRating > 0 && (
                <span className="detail-user-rating-val">{userRating}/5</span>
              )}
            </div>

            <h2 className="detail-price">{product.price} $</h2>

            <p className="detail-desc">{product.description}</p>

            {/* stock */}
            <div className="detail-stock">
              <div className="detail-stock-label">
                <span>Stock</span>
                <span style={{ color: stockColor }}>{product.stock} pcs.</span>
              </div>
              <div className="detail-stock-bar">
                <div
                  className="detail-stock-fill"
                  style={{ width: `${stockPercent}%`, background: stockColor }}
                />
              </div>
              {product.stock < 10 && (
                <small className="detail-stock-warn">
                  Hurry up, only a few left!
                </small>
              )}
            </div>

            {/* quantity */}
            <div className="detail-qty">
              <span className="detail-qty-label">Quantity:</span>
              <div className="qty-box">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <img src="/images/minus.svg" alt="-" />
                </button>
                <span>{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                >
                  <img src="/images/plus.svg" alt="+" />
                </button>
              </div>
            </div>

            <div className="detail-buttons">
              {added && <span className="added-text1">Added to Cart!</span>}
              <button className="addToCartBtn" onClick={handleAddToCart}>
                <img src="/images/cart2.svg" alt="add to cart" />
                Add to Cart ({qty})
              </button>
              <button
                className="addFavBtn"
                onClick={() => toggleFavorite(product.id)}
              >
                <img src="/images/heart2.svg" alt="favorite" />
                {isFav ? "Remove Favorite" : "Add Favorite"}
              </button>
            </div>

            {/* reviews */}
            <div className="detail-reviews">
              <h3>Reviews</h3>

              <div className="review-form">
                <h4>Leave a review</h4>

                <div className="review-form-rating">
                  <span>Your rating:</span>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star-icon ${(commentHover || commentRating) >= star ? "star-icon--active" : ""}`}
                        onClick={() => setCommentRating(star)}
                        onMouseEnter={() => setCommentHover(star)}
                        onMouseLeave={() => setCommentHover(0)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <input
                  className="review-input"
                  placeholder="Your name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                />

                <textarea
                  className="review-textarea"
                  placeholder="Write your review..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                />

                <button
                  className="review-submit"
                  onClick={handleCommentSubmit}
                  disabled={
                    !commentText.trim() ||
                    !commentName.trim() ||
                    commentRating === 0
                  }
                >
                  Submit Review
                </button>
              </div>

              {userReviews.length > 0 && (
                <div className="review-section">
                  <h4>Your Reviews</h4>
                  {userReviews.map((review, i) => (
                    <div key={i} className="review-card review-card--user">
                      <div className="review-top">
                        <span className="review-name">{review.name}</span>
                        <span className="review-stars">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <small className="review-date">
                        {new Date(review.date).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}

              {/* rating */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="review-section">
                  <h4>All Reviews</h4>
                  {product.reviews.map((review, i) => (
                    <div key={i} className="review-card">
                      <div className="review-top">
                        <span className="review-name">
                          {review.reviewerName}
                        </span>
                        <span className="review-stars">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <small className="review-date">
                        {new Date(review.date).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* mobile fixed bar */}
      <div className="detail-mobile-bar">
        <div className="detail-mobile-price">
          {(product.price * qty).toFixed(2)} $
        </div>
        <div className="detail-mobile-actions">
          <button
            className="detail-mobile-fav"
            onClick={() => toggleFavorite(product.id)}
          >
            <img
              src={
                isFav
                  ? "/images/heart-mobile2.svg"
                  : "/images/heart-mobile1.svg"
              }
              alt="favorite"
              style={{ width: "24px", height: "24px" }}
            />
          </button>
          <button
            className={`detail-mobile-cart ${added ? "detail-mobile-cart--added" : ""}`}
            onClick={handleAddToCart}
          >
            <img src="/images/cart2.svg" alt="" />
            {added ? "Added" : `Add to Cart (${qty})`}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;