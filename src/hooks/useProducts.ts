import { useQuery } from "@tanstack/react-query";
import type { Product } from "../types/product";

type ApiResponse = {
  products: Product[];
  total: number;
};

const fetchProducts = async (
  category: string | null,
  page: number,
  limit = 28
): Promise<ApiResponse> => {
  let url = `https://dummyjson.com/products?limit=${limit}&skip=${
    (page - 1) * limit
  }`;

  if (category) {
    const apiCategory =
      category.toLowerCase() === "skin-care"
        ? "skincare"
        : category.toLowerCase();

    url = `https://dummyjson.com/products/category/${apiCategory}?limit=${limit}&skip=${
      (page - 1) * limit
    }`;
  }

  const res = await fetch(url);
  return res.json();
};

export const useProducts = (category: string | null, page: number) => {
  return useQuery({
    queryKey: ["products", category, page],
    queryFn: () => fetchProducts(category, page),
    staleTime: 1000 * 60 * 5,
  });
};