import { useLocation, useNavigate } from "react-router-dom";
import "./Footer.css";

type Props = {
  onMenuClick: () => void;
  onFavClick: () => void;
  onCartClick: () => void;
  sidebarOpen: boolean;
};

const Footer = ({ onMenuClick, onFavClick, onCartClick, sidebarOpen }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isFav = location.pathname === "/favorites";
  const isCart = location.pathname === "/cart";

  return (
    <footer>
      <p className="footer-text">© 2026, Vendo.com</p>

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
            src={sidebarOpen ? "/images/category_line2.svg" : "/images/category_line1.svg"}
            className="mobile-nav-icon"
          />
          <span className="mobile-nav-label">Categories</span>
        </button>

        <button
          className={`mobile-nav-item ${isFav ? "mobile-nav-item--active" : ""}`}
          onClick={onFavClick}
        >
          <img
            src={isFav ? "/images/heart-mobile2.svg" : "/images/heart-mobile1.svg"}
            className="mobile-nav-icon"
          />
          <span className="mobile-nav-label">Favorites</span>
        </button>

        <button
          className={`mobile-nav-item ${isCart ? "mobile-nav-item--active" : ""}`}
          onClick={onCartClick}
        >
          <img
            src={isCart ? "/images/cart-mobile3.svg" : "/images/cart-mobile2.svg"}
            className="mobile-nav-icon"
          />
          <span className="mobile-nav-label">Cart</span>
        </button>

      </nav>
    </footer>
  );
};

export default Footer;