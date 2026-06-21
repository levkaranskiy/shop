import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import type { AppDispatch } from '../features/store';
import { addToCart } from '../features/cartSlice';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      toast.success(`${product.name} добавлен в корзину`);
    } catch (error: any) {
      toast.error(typeof error === 'string' ? error : 'Ошибка добавления в корзину');
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        {product.category && (
          <span className="inline-block bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 self-start">
            {product.category}
          </span>
        )}

        <h3 className="text-gray-900 font-semibold text-base mb-1 line-clamp-2 group-hover:text-teal-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-gray-900">
            {product.price.toLocaleString('ru-RU')} сом.
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            В корзину
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
