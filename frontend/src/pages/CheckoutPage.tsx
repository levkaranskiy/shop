import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../features/store';
import { fetchCart } from '../features/cartSlice';
import { createOrder } from '../features/ordersSlice';
import Loader from '../components/Loader';

const CheckoutPage: React.FC = () => {
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error('Укажите адрес доставки');
      return;
    }
    if (items.length === 0) {
      toast.error('Корзина пуста');
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(createOrder(address.trim())).unwrap();
      toast.success('Заказ успешно оформлен!');
      navigate('/orders');
    } catch (error: any) {
      toast.error(typeof error === 'string' ? error : 'Ошибка оформления заказа');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Корзина пуста</h2>
        <p className="text-gray-500 mb-6">Добавьте товары перед оформлением заказа</p>
        <button
          onClick={() => navigate('/')}
          className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Перейти в каталог
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Оформление заказа</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Address Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Адрес доставки</h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Укажите полный адрес доставки: город, улица, дом, квартира"
                rows={4}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ваш заказ</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-gray-900 font-medium flex-shrink-0">
                      {(item.product.price * item.quantity).toLocaleString('ru-RU')} сом.
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg text-gray-600">Итого:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {total.toLocaleString('ru-RU')} сом.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white py-3.5 rounded-lg font-medium transition-colors"
              >
                {submitting ? 'Оформление...' : 'Подтвердить заказ'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
