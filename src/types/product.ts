export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  category: string;
  brand?: string;
  rating: number;
  discountPercentage?: number;
  stock: number;
  images: string[];
  reviews: {
    rating: number;
    comment: string;
    reviewerName: string;
    date: string;
  }[];
};

export type CartItem = Product & {
  quantity: number;
};
