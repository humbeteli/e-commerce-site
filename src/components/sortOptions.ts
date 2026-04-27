export type SortOption = {
  label: string;
  sortBy?: string;
  order?: "asc" | "desc";
};

export const SORT_OPTIONS: SortOption[] = [
  { label: "Default" },

  // price
  { label: "Most Expensive", sortBy: "price", order: "desc" },
  { label: "Cheapest", sortBy: "price", order: "asc" },

  // rating
  { label: "Highest Rated", sortBy: "rating", order: "desc" },

  // best sellers
  { label: "Best Selling", sortBy: "stock", order: "desc" },

  // discount
  { label: "Discounted", sortBy: "discountPercentage", order: "desc" },
];
