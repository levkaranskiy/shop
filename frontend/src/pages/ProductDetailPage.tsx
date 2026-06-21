import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../features/store';
import { fetchProduct, clearCurrentProduct } from '../features/productsSlice';
import { addToCart } from '../features/cartSlice';
import Loader from '../components/Loader';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentProduct, loading } = useSelector((state: RootState) => state.products);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Войдите, чтобы добавлять товары в корзину');
      return;
    }
    if (!currentProduct) return;
    try {
      await dispatch(addToCart({ productId: currentProduct.id, quantity })).unwrap();
      toast.success(`${currentProduct.name} добавлен в корзину`);
    } catch (error: any) {
      toast.error(typeof error === 'string' ? error : 'Ошибка добавления в корзину');
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!currentProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Товар не найден</h2>
        <Link to="/" className="text-teal-500 hover:text-teal-600 font-medium">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/" className="text-teal-500 hover:text-teal-600 font-medium text-sm">
          &larr; Вернуться в каталог
        </Link>
      </nav>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            {currentProduct.imageUrl ? (
              <img
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>

          {/* Info */}
          <div className="p-8 lg:p-10 flex flex-col">
            {currentProduct.category && (
              <span className="inline-block bg-teal-50 text-teal-700 text-sm font-medium px-3 py-1 rounded-full self-start mb-4">
                {currentProduct.category}
              </span>
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {currentProduct.name}
            </h1>

            <p className="text-gray-600 text-base leading-relaxed mb-6 flex-1">
              {currentProduct.description}
            </p>

            <div className="border-t border-gray-100 pt-6">
              <div className="text-3xl font-bold text-gray-900 mb-6">
                {currentProduct.price.toLocaleString('ru-RU')} сом.
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Количество:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-medium min-w-[48px] text-center border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3.5 rounded-lg font-medium text-lg transition-colors"
              >
                Добавить в корзину
              </button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  <Link to="/login" className="text-teal-500 hover:text-teal-600">Войдите</Link>, чтобы добавлять товары в корзину
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
