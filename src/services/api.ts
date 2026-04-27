export const getProducts = async (limit: number, skip: number) => {
  const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  return res.json();
};