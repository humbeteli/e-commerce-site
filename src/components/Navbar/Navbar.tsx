import { useState } from "react";
import "./Navbar.css";
import Search from "../Search/Search";
import type { Product } from "../../types/product";

type Props = {
  onLogoClick: () => void;
  onCartClick: () => void;
  onFavClick: () => void;
  onSelectProduct: (product: Product) => void;
  onSearchSubmit: (products: Product[]) => void;
  favCount: number;
  cartCount: number;
  onMenuClick: () => void;
  sidebarOpen: boolean;
};

const Navbar = ({
  onLogoClick,
  onCartClick,
  onFavClick,
  onSelectProduct,
  onSearchSubmit,
  favCount,
  cartCount,
  onMenuClick,
  sidebarOpen,
}: Props) => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="navbar-container">

      <div className="logo-group" onClick={onLogoClick} style={{ cursor: "pointer" }}>
        <img src="/images/logo.svg" alt="Logo" className="logo" />
        <span className="logo-name">Vendo</span>
      </div>

      <div className="mobile-left">
        {searchFocused ? (
          <button className="nav-back-btn" onClick={() => setSearchFocused(false)}>
            <img src="/images/back2.svg" alt="back" />
          </button>
        ) : (
          <button
            className={`nav-menu-btn ${sidebarOpen ? "nav-menu-btn--open" : ""}`}
            onClick={onMenuClick}
          >
            <span /><span /><span />
          </button>
        )}
      </div>

      <div className={`search-area ${searchFocused ? "search-area--focused" : ""}`}>
        <Search
          onSelect={(p) => { onSelectProduct(p); setSearchFocused(false); }}
          onSearchSubmit={(prods) => { onSearchSubmit(prods); setSearchFocused(false); }}
          onFocus={() => setSearchFocused(true)}
        />
      </div>

      <div className="nav-icons">
        <div className="fav-wrapper" onClick={onFavClick}>
          <img
            src={favCount > 0 ? "/images/favori1-active.svg" : "/images/favori1.svg"}
            alt="Fav"
          />
          {favCount > 0 && <span className="fav-count">{favCount}</span>}
        </div>

        <div className="cart-link" onClick={onCartClick}>
          <img src="/images/cart.svg" alt="Cart" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;