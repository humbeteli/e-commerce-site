import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Footer.css";

type Props = {
  onMenuClick: () => void;
  onFavClick: () => void;
  onCartClick: () => void;
  sidebarOpen: boolean;
  onCategorySelect: (cat: string) => void;
};

const Footer = ({
  onMenuClick,
  onFavClick,
  onCartClick,
  sidebarOpen,
  onCategorySelect,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState<string[]>([]);

  const isHome = location.pathname === "/";
  const isFav = location.pathname === "/favorites";
  const isCart = location.pathname === "/cart";

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((r) => r.json())
      .then((data) => {
        const names = data.map((c: { slug: string }) => c.slug);
        setCategories(names);
      });
  }, []);

  return (
    <footer>
      {/* desktop footer */}
      <div className="footer-main">
        <div className="footer-grid">
          {/* about */}
          <div className="footer-col">
            <div className="footer-logo">
              <img
                src="/images/logo.svg"
                alt="Vendo"
                className="footer-logo-img"
              />
              <span>Vendo</span>
            </div>
            <p className="footer-about">
              Vendo is your one-stop shop for everything you love. Quality
              products, great prices, fast delivery.
            </p>
            <div className="footer-socials">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/hq.rbnw/"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
              >
                <img src="/images/instagram.svg" alt="Instagram" />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1FRVJfgyWr/"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
              >
                <img src="/images/facebook.svg" alt="Facebook" />
              </a>

              {/* Linkedin */}
              <a
                href="https://www.linkedin.com/in/humbeteli-qurbanov-805999361"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
              >
                <img src="/images/linkedin.svg" alt="LinkedIn" />
              </a>

              {/* Whatsapp */}
              <a
                href="https://wa.me/message/2HIKGPYXAYX2I1"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
              >
                <img src="/images/whatsapp.svg" alt="WhatsApp" />
              </a>
            </div>
          </div>

          {/* categories */}
          <div className="footer-col">
            <h4 className="footer-col-title">Categories</h4>
            <ul className="footer-links">
              {categories.slice(0, 10).map((cat) => (
                <li key={cat}>
                  <button
                    className="footer-link-btn"
                    onClick={() => {
                      onCategorySelect(cat);
                      navigate("/");
                      setTimeout(() => {
                        document.body.scrollTop = 0;
                      }, 0);
                    }}
                  >
                    {cat.replace(/-/g, " ")}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">More Categories</h4>
            <ul className="footer-links">
              {categories.slice(10).map((cat) => (
                <li key={cat}>
                  <button
                    className="footer-link-btn"
                    onClick={() => {
                      onCategorySelect(cat);
                      navigate("/");
                      setTimeout(() => {
                        document.body.scrollTop = 0;
                      }, 0);
                    }}
                  >
                    {cat.replace(/-/g, " ")}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-contact-list">
              <li>
                <img src="/images/location.svg" alt="location" /> Sumgait,
                Azerbaijan
              </li>
              <li>
                <img src="/images/email.svg" alt="email" />{" "}
                humbeteliqurbanov@gmail.com
              </li>
              <li>
                <img src="/images/phone.svg" alt="phone" /> +994 50 865 28 79
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Vendo.com — All rights reserved.</p>
          <p>Made with in Azerbaijan</p>
        </div>
      </div>

      {/* mobile bottom nav */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-item ${isHome ? "mobile-nav-item--active" : ""}`}
          onClick={() => navigate("/")}
        >
          <img
            src={isHome ? "/images/home-line2.svg" : "/images/home-line1.svg"}
            className="mobile-nav-icon"
          />
          <span className="mobile-nav-label">Main Menu</span>
        </button>

        <button
          className={`mobile-nav-item ${sidebarOpen ? "mobile-nav-item--active" : ""}`}
          onClick={onMenuClick}
        >
          <img
            src={
              sidebarOpen
                ? "/images/category_line2.svg"
                : "/images/category_line1.svg"
            }
            className="mobile-nav-icon"
          />
          <span className="mobile-nav-label">Categories</span>
        </button>

        <button
          className={`mobile-nav-item ${isFav ? "mobile-nav-item--active" : ""}`}
          onClick={onFavClick}
        >
          <img
            src={
              isFav ? "/images/heart-mobile2.svg" : "/images/heart-mobile1.svg"
            }
            className="mobile-nav-icon"
          />
          <span className="mobile-nav-label">Favorites</span>
        </button>

        <button
          className={`mobile-nav-item ${isCart ? "mobile-nav-item--active" : ""}`}
          onClick={onCartClick}
        >
          <img
            src={
              isCart ? "/images/cart-mobile3.svg" : "/images/cart-mobile2.svg"
            }
            className="mobile-nav-icon"
          />
          <span className="mobile-nav-label">Cart</span>
        </button>
      </nav>
    </footer>
  );
};

export default Footer;
