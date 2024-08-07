export const URLS = {
    getCategory: 'https://dummyjson.com/products/categories',
    getProductsByCategory: (category: string) => `https://dummyjson.com/products/category/${category}`,
    allProducts: 'https://dummyjson.com/products'
}