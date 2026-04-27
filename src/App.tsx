import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import MainMenu from "./pages/Home/MainMenu";
import Cart from "./pages/Cart/Cart";
import Favorites from "./pages/Favorites/Favorites";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Footer from "./components/Footer/Footer";
import CategoryBar from "./components/CategoryBar/CategoryBar";
import { useEffect, useState } from "react";
import type { Product } from "./types/product";
import { useStore } from "./store/useStore";

function App() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { favorites, cart, addToCart, toggleFavorite } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<Product[] | null>(null);

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, selectedCategory]);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=194")
      .then((res) => res.json())
      .then((data) => setAllProducts(data.products || []));
  }, []);

  const goHome = () => {
    setSelectedCategory(null);
    setSearchResults(null);
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar
        onLogoClick={() => {
          setSidebarOpen(false);
          goHome();
        }}
        onCartClick={() => {
          setSidebarOpen(false);
          navigate("/cart");
        }}
        onFavClick={() => {
          setSidebarOpen(false);
          navigate("/favorites");
        }}
        onSelectProduct={(p) => navigate(`/product/${p.id}`)}
        onSearchSubmit={(prods) => {
          setSearchResults(prods);
          navigate("/");
        }}
        favCount={favorites.length}
        cartCount={cart.length}
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />

      <CategoryBar
        onCategorySelect={(cat) => {
          setSelectedCategory(cat);
          navigate("/");
           window.scrollTo({ top: 0, behavior: "instant" });
        }}
        sidebarOpen={sidebarOpen}
        onSidebarClose={() => setSidebarOpen(false)}
      />

      <Routes>
        <Route
          path="/"
          element={
            <MainMenu
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              onAddToCart={addToCart}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          }
        />

        <Route path="/product/:id" element={<ProductDetail />} />

        <Route
          path="/cart"
          element={<Cart items={cart} allProducts={allProducts} />}
        />

        <Route
          path="/favorites"
          element={
            <Favorites
              items={allProducts.filter((p) => favorites.includes(p.id))}
              allProducts={allProducts}
            />
          }
        />
      </Routes>

      <Footer
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        onFavClick={() => {
          setSidebarOpen(false);
          navigate("/favorites");
        }}
        onCartClick={() => {
          setSidebarOpen(false);
          navigate("/cart");
        }}
        sidebarOpen={sidebarOpen}
      />
    </>
  );
}

export default App;
