import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../features/store';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../features/cartSlice';
import Loader from '../components/Loader';

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await dispatch(updateCartItem({ id, quantity })).unwrap();
    } catch (error: any) {
      toast.error(typeof error === 'string' ? error : 'Ошибка обновления');
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await dispatch(removeCartItem(id)).unwrap();
      toast.success('Товар удалён из корзины');
    } catch (error: any) {
      toast.error(typeof error === 'string' ? error : 'Ошибка удаления');
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      toast.success('Корзина очищена');
    } catch (error: any) {
      toast.error(typeof error === 'string' ? error : 'Ошибка очистки корзины');
    }
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) {
    return <Loader />;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Корзина пуста</h2>
        <p className="text-gray-500 mb-6">Добавьте товары из каталога</p>
        <Link
          to="/"
          className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Корзина</h1>
        <button
          onClick={handleClearCart}
          className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
        >
          Очистить корзину
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 flex gap-4 sm:gap-6"
          >
            {/* Image */}
            <Link to={`/products/${item.product.id}`} className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gray-100 overflow-hidden">
                {item.product.imageUrl ? (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link to={`/products/${item.product.id}`}>
                <h3 className="text-gray-900 font-semibold hover:text-teal-600 transition-colors truncate">
                  {item.product.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 mt-1">{item.product.price.toLocaleString('ru-RU')} сом. / шт.</p>

              <div className="flex items-center justify-between mt-3">
                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors text-sm"
                  >
                    −
                  </button>
                  <span className="px-3 py-1.5 text-gray-900 font-medium text-sm min-w-[36px] text-center border-x border-gray-300">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors text-sm"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Subtotal */}
                  <span className="text-lg font-bold text-gray-900">
                    {(item.product.price * item.quantity).toLocaleString('ru-RU')} сом.
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total and Checkout */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg text-gray-600">Итого:</span>
          <span className="text-2xl font-bold text-gray-900">
            {total.toLocaleString('ru-RU')} сом.
          </span>
        </div>
        <Link
          to="/checkout"
          className="block w-full bg-teal-500 hover:bg-teal-600 text-white py-3.5 rounded-lg font-medium text-center text-lg transition-colors"
        >
          Оформить заказ
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
