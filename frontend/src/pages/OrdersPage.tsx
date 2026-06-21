import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../features/store';
import { fetchOrders } from '../features/ordersSlice';
import Loader from '../components/Loader';

const statusLabels: Record<string, { text: string; className: string }> = {
  PENDING: { text: 'В обработке', className: 'bg-yellow-50 text-yellow-700' },
  PROCESSING: { text: 'Обрабатывается', className: 'bg-blue-50 text-blue-700' },
  SHIPPED: { text: 'Отправлен', className: 'bg-purple-50 text-purple-700' },
  DELIVERED: { text: 'Доставлен', className: 'bg-green-50 text-green-700' },
  CANCELLED: { text: 'Отменён', className: 'bg-red-50 text-red-700' },
};

const OrdersPage: React.FC = () => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return <Loader />;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">У вас пока нет заказов</h2>
        <p className="text-gray-500 mb-6">Оформите первый заказ из каталога</p>
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Мои заказы</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusLabels[order.status] || { text: order.status, className: 'bg-gray-50 text-gray-700' };
          const isExpanded = expandedOrder === order.id;
          const orderDate = new Date(order.createdAt).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <button
                onClick={() => toggleExpand(order.id)}
                className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-sm text-gray-500">Заказ от {orderDate}</span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${status.className}`}>
                      {status.text}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {order.items.length} {order.items.length === 1 ? 'товар' : order.items.length < 5 ? 'товара' : 'товаров'}
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-lg font-bold text-gray-900">
                    {order.total.toLocaleString('ru-RU')} сом.
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Order Details */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-5 sm:p-6 bg-gray-50">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Адрес доставки:</h4>
                    <p className="text-sm text-gray-600">{order.address}</p>
                  </div>

                  <h4 className="text-sm font-medium text-gray-700 mb-3">Товары:</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-white rounded-lg p-3 border border-gray-100">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.price.toLocaleString('ru-RU')} сом. × {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} сом.
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
