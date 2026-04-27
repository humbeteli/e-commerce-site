import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { useStore } from "../../store/useStore";
import type { Product } from "../../types/product";
import ProductCard from "../../components/ProductCard/ProductCard";
import Spinner from "../../components/Spinner/Spinner";

type CartItem = Product & {
  quantity: number;
};

type Props = {
  items: CartItem[];
  allProducts: Product[];
};

const Cart = ({ items, allProducts }: Props) => {
  const navigate = useNavigate();

  const {
    removeFromCart,
    increaseQty,
    decreaseQty,
    addToCart,
    favorites,
    toggleFavorite,
  } = useStore();

  const [selectedItems, setSelectedItems] = useState<number[]>(() =>
    items.map((item) => item.id),
  );

  const prevItemIdsRef = useRef<number[]>(items.map((i) => i.id));

  useEffect(() => {
    const prevIds = prevItemIdsRef.current;
    const currentIds = items.map((i) => i.id);
    const newIds = currentIds.filter((id) => !prevIds.includes(id));
    if (newIds.length > 0) {
      setSelectedItems((prev) => [...prev, ...newIds]);
    }
    setSelectedItems((prev) => prev.filter((id) => currentIds.includes(id)));
    prevItemIdsRef.current = currentIds;
  }, [items]);

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const selectedCartItems = items.filter((item) =>
    selectedItems.includes(item.id),
  );

  const subtotal = selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shipping = subtotal < 100 && subtotal > 0 ? 5 : 0;
  const totalPrice = subtotal + shipping;
  const remainingForFree = 100 - subtotal;

  const handleCheckout = () => {
    alert("Order placed successfully!");
  };

  const recommended = allProducts
    .filter((product) =>
      items.some((item) => item.category === product.category),
    )
    .slice(0, 6);

  if (!allProducts || allProducts.length === 0) return <Spinner />;

  return (
    <div className="cart-page">
      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-item">
            <img src="/images/cart1.svg" alt="Cart" />
            <p>Your cart is empty.</p>
          </div>
          <button onClick={() => navigate("/")}>Start shopping!</button>
        </div>
      ) : (
        <>
          <div className="cart-container">
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="cart-checkbox"
                  />

                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="cart-item-img"
                    onClick={() => navigate(`/product/${item.id}`)}
                  />

                  <div className="cart-item-details">
                    <h4>{item.title}</h4>
                    <p>{item.price} $</p>

                    <div className="qty-box">
                      <button onClick={() => decreaseQty(item.id)}>
                        <img src="/images/minus.svg" alt="" />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)}>
                        <img src="/images/plus.svg" alt="" />
                      </button>
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <img src="/images/remove1.svg" alt="" />
                  </button>
                </div>
              ))}
            </div>

            {/* summary */}
            <div className="cart-summary-box">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <span className="subtotal-price">{subtotal.toFixed(2)} $</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span className="shipping">
                  {shipping === 0 ? "FREE" : `${shipping.toFixed(2)} $`}
                </span>
              </div>

              {subtotal < 100 && subtotal > 0 && (
                <small style={{ color: "#6b7280" }}>
                  Add {remainingForFree.toFixed(2)} $ more to get FREE shipping
                </small>
              )}

              {subtotal >= 100 && (
                <small style={{ color: "rgb(1, 194, 7)" }}>
                  You unlocked FREE shipping!
                </small>
              )}

              <hr />

              <div className="summary-row total">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)} $</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>

          {/* recommended */}
          {recommended.length > 0 && (
            <div >
              <h3 className="similar-products-title">Related products</h3>
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

          {/* mobile fixed checkout bar */}
          <div className="cart-mobile-bar">
            <div className="cart-mobile-bar-info">
              <div className="cart-mobile-total">
                {totalPrice.toFixed(2)} $
              </div>
              {shipping > 0 ? (
                <span className="cart-mobile-shipping">
                  +{shipping.toFixed(2)} $ shipping
                </span>
              ) : subtotal >= 100 ? (
                <span className="cart-mobile-shipping cart-mobile-shipping--free">
                  FREE shipping!
                </span>
              ) : null}
            </div>

            <button className="cart-mobile-checkout" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;