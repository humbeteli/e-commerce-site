import { useState, useEffect, useCallback } from "react";
import "./CategoryBar.css";

const topCategories = [
  "Mens-shirts",
  "Womens-dresses",
  "Smartphones",
  "Furniture",
  "Sports-accessories",
  "Vehicle",
  "Groceries",
];

const categoryMap: { [key: string]: string[] } = {
  fashion: [
    "Mens-shirts",
    "Mens-shoes",
    "Mens-watches",
    "Womens-dresses",
    "Womens-shoes",
    "Womens-bags",
    "Womens-jewellery",
    "Womens-watches",
    "Tops",
    "Sunglasses",
  ],
  beauty: ["Beauty", "Fragrances"],
  electronics: ["Smartphones", "Laptops", "Tablets", "Mobile-accessories"],
  home: ["Furniture", "Home-decoration", "Kitchen-accessories"],
  sports: ["Sports-accessories"],
  automotive: ["Motorcycle", "Vehicle"],
  food: ["Groceries"],
};

const categoryIcons: { [key: string]: string } = {
  fashion: "/images/fashion-black.svg",
  beauty: "/images/beauty-black.svg",
  electronics: "/images/electronics-black.svg",
  home: "/images/home-black.svg",
  sports: "/images/sports-black.svg",
  automotive: "/images/automotive-black.svg",
  food: "/images/food-black.svg",
};

type CategoryBarProps = {
  onCategorySelect: (category: string) => void;
  sidebarOpen: boolean;
  onSidebarClose: () => void;
};

const CategoryBar = ({
  onCategorySelect,
  sidebarOpen,
  onSidebarClose,
}: CategoryBarProps) => {
  const [visible, setVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [localOpen, setLocalOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const open = sidebarOpen || localOpen;

  const closeSidebar = useCallback(() => {
    setLocalOpen(false);
    onSidebarClose();
  }, [onSidebarClose]);

  useEffect(() => {
    const handleScroll = () => {
      if (open) return;

      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll, closeSidebar, open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSelect = (item: string) => {
    onCategorySelect(item.toLowerCase());
    closeSidebar();
  };

  return (
    <>
      {/* categorybar */}
      <div
        className={`category-bar ${!visible ? "hidden" : ""}`}
        onMouseLeave={() => setLocalOpen(false)}
      >
        <div
          className="category-item category-main"
          onMouseEnter={() => setLocalOpen(true)}
        >
          ☰ Categories
        </div>

        {topCategories.map((item) => (
          <div
            key={item}
            className="category-item"
            onClick={() => handleSelect(item)}
          >
            {item.replace("-", " ")}
          </div>
        ))}
      </div>

      {/* sidebar */}
      <div
        className={`sidebar ${open ? "active" : ""}`}
        onMouseEnter={() => setLocalOpen(true)}
        onMouseLeave={() => setLocalOpen(false)}
      >
        <div className="sidebar-close" onClick={closeSidebar}>
          ×
        </div>

        <div id="sidebar-categories">
          {Object.keys(categoryMap).map((key) => (
            <div key={key}>
              <div>
                <h4
                  onClick={() => setExpanded(expanded === key ? null : key)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={categoryIcons[key]}
                    alt={key}
                    className="category-icon"
                  />
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <img
                    src="/images/arrow2.svg"
                    alt=""
                    className={`sidebar-chevron ${expanded === key ? "sidebar-chevron--open" : ""}`}
                  />
                </h4>
              </div>
              <ul style={{ display: expanded === key ? "block" : "none" }}>
                {categoryMap[key].map((sub, i) => (
                  <li
                    key={i}
                    onClick={() => handleSelect(sub)}
                    style={{ cursor: "pointer" }}
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* overlay */}
      {open && <div id="overlay" className="active" onClick={closeSidebar} />}
    </>
  );
};

export default CategoryBar;
