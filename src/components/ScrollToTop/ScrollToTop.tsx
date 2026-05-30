import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const scrollPositions = new Map<string, number>();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const prevPathname = useRef(pathname);

  // Hər scroll hərəkətini saxla
  useEffect(() => {
    const saveScroll = () => {
      scrollPositions.set(pathname, document.body.scrollTop);
    };

    document.body.addEventListener("scroll", saveScroll, { passive: true });
    return () => document.body.removeEventListener("scroll", saveScroll);
  }, [pathname]);

  useEffect(() => {
    if (navType === "POP") {
      const saved = scrollPositions.get(pathname) ?? 0;
      console.log("POP —", pathname, "scroll:", saved);
      setTimeout(() => {
        document.body.scrollTop = saved;
      }, 600);
    } else {
      document.body.scrollTop = 0;
    }

    prevPathname.current = pathname;
  }, [pathname, navType]);

  return null;
};

export default ScrollToTop;