import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../features/store';
import { fetchProducts, fetchCategories, setFilters } from '../features/productsSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, categories, loading, filters } = useSelector((state: RootState) => state.products);

  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() || '');

  const loadProducts = useCallback(() => {
    const params: Record<string, any> = {};
    if (searchInput) params.search = searchInput;
    if (selectedCategory) params.category = selectedCategory;
    if (minPrice) params.minPrice = Number(minPrice);
    if (maxPrice) params.maxPrice = Number(maxPrice);
    dispatch(setFilters(params));
    dispatch(fetchProducts(params));
  }, [dispatch, searchInput, selectedCategory, minPrice, maxPrice]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    dispatch(setFilters({}));
    dispatch(fetchProducts({}));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Каталог товаров</h1>
        <p className="text-gray-500">Найдите то, что вам нужно</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Поиск товаров..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Найти
            </button>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">Все категории</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[140px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена от</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="min-w-[140px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена до</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="999999"
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Сбросить
            </button>
          </div>
        </form>
      </div>

      {/* Products Grid */}
      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Нет товаров</h3>
          <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
