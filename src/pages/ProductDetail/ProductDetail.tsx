import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "../../types/product";
import "./ProductDetail.css";
import { useAddToCartFeedBack } from "../../hooks/useAddToCartFeedBack";
import { useStore } from "../../store/useStore";
import Spinner from "../../components/Spinner/Spinner";

type UserReview = {
  id: string;
  name: string;
  comment: string;
  rating: number;
  date: string;
};

type ReviewLikes = {
  [reviewId: string]: number;
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, favorites } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const { added, trigger } = useAddToCartFeedBack();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [reviewLikes, setReviewLikes] = useState<ReviewLikes>({});
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [commentHover, setCommentHover] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prevImg = () =>
    setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () =>
    setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

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

          const savedReviews = localStorage.getItem(`reviews-${id}`);
          setUserReviews(savedReviews ? JSON.parse(savedReviews) : []);

          const savedLikes = localStorage.getItem(`review-likes-${id}`);
          setReviewLikes(savedLikes ? JSON.parse(savedLikes) : {});

          const savedLiked = localStorage.getItem(`review-liked-${id}`);
          setLikedReviews(savedLiked ? JSON.parse(savedLiked) : []);
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

    const newReview: UserReview = {
      id: Date.now().toString(),
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

  const handleDeleteReview = (reviewId: string) => {
    setDeleteTargetId(reviewId);
  };

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    const updated = userReviews.filter((r) => r.id !== deleteTargetId);
    setUserReviews(updated);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updated));
    setDeleteTargetId(null);
  };

  const cancelDelete = () => {
    setDeleteTargetId(null);
  };

  const handleLike = (reviewId: string) => {
    const alreadyLiked = likedReviews.includes(reviewId);

    const updatedLikes = {
      ...reviewLikes,
      [reviewId]: alreadyLiked
        ? Math.max(0, (reviewLikes[reviewId] ?? 0) - 1)
        : (reviewLikes[reviewId] ?? 0) + 1,
    };
    const updatedLiked = alreadyLiked
      ? likedReviews.filter((r) => r !== reviewId)
      : [...likedReviews, reviewId];

    setReviewLikes(updatedLikes);
    setLikedReviews(updatedLiked);
    localStorage.setItem(`review-likes-${id}`, JSON.stringify(updatedLikes));
    localStorage.setItem(`review-liked-${id}`, JSON.stringify(updatedLiked));
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
      {/* delete modal */}
      {deleteTargetId && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h4 className="modal-title">Delete Review</h4>
            <p className="modal-text">
              Are you sure you want to delete this review?
            </p>
            <div className="modal-actions">
              <button
                className="modal-btn modal-btn--cancel"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="modal-btn modal-btn--confirm"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
          <button
            className="lightbox-arrow lightbox-arrow--left"
            onClick={(e) => {
              e.stopPropagation();
              prevImg();
            }}
          >
            ‹
          </button>
          <img
            src={images[activeImg]}
            alt=""
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-arrow lightbox-arrow--right"
            onClick={(e) => {
              e.stopPropagation();
              nextImg();
            }}
          >
            ›
          </button>
          <button className="lightbox-close" onClick={() => setLightbox(false)}>
            ×
          </button>
        </div>
      )}
      <div className="detail-container">
        <button className="detail-back-btn" onClick={() => navigate(-1)}>
          <img src="/images/back.svg" alt="" />
          Back
        </button>

        <div className="details">
          {/* gallery */}
          <div className="detail-gallery">
            <div className="gallery-main">
              <button
                className="gallery-arrow gallery-arrow--left"
                onClick={prevImg}
              >
                ‹
              </button>
              <img
                src={images[activeImg]}
                alt={product.title}
                className="gallery-main-img"
                onClick={() => setLightbox(true)}
              />
              <button
                className="gallery-arrow gallery-arrow--right"
                onClick={nextImg}
              >
                ›
              </button>
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

            <div className="detail-rating-row">
              <img src="/images/star.svg" className="detail-rating-star" />
              <span className="detail-rating-val">{product.rating}</span>
              <span className="detail-rating-label">Rating</span>
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

              {/* user reviews */}
              {userReviews.length > 0 && (
                <div className="review-section">
                  <h4>Your Reviews</h4>
                  {userReviews.map((review) => (
                    <div
                      key={review.id}
                      className="review-card review-card--user"
                    >
                      <div className="review-top">
                        <span className="review-name">{review.name}</span>
                        <span className="review-stars">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                        <button
                          className="review-delete-btn"
                          onClick={() => handleDeleteReview(review.id)}
                          title="Delete review"
                        >
                          <img src="/images/remove-comment.svg" alt="" />
                        </button>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <div className="review-bottom">
                        <small className="review-date">
                          {new Date(review.date).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* all reviews */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="review-section">
                  <h4>All Reviews</h4>
                  {product.reviews.map((review, i) => {
                    const likeKey = `api-${i}`;
                    return (
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
                        <div className="review-bottom">
                          <small className="review-date">
                            {new Date(review.date).toLocaleDateString()}
                          </small>
                          <button
                            className={`review-like-btn ${likedReviews.includes(likeKey) ? "review-like-btn--liked" : ""}`}
                            onClick={() => handleLike(likeKey)}
                          >
                            <img
                              src={
                                likedReviews.includes(likeKey)
                                  ? "/images/like-active.svg"
                                  : "/images/like.svg"
                              }
                              alt=""
                              className="like-icon"
                            />
                            {reviewLikes[likeKey] ?? 0}
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
