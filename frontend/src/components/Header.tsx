import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../features/store';
import { logout } from '../features/authSlice';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobile}>
            <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xl font-bold text-white">Магазин</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">
              Каталог
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/cart" className="text-gray-300 hover:text-teal-400 transition-colors font-medium relative">
                  Корзина
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-teal-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">
                  Мои заказы
                </Link>
              </>
            )}

            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">
                Админ-панель
              </Link>
            )}
          </nav>

          {/* Auth Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Выход
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-teal-400 transition-colors font-medium"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700 mt-2 pt-4">
            <nav className="flex flex-col space-y-3">
              <Link to="/" onClick={closeMobile} className="text-gray-300 hover:text-teal-400 transition-colors font-medium py-1">
                Каталог
              </Link>

              {isAuthenticated && (
                <>
                  <Link to="/cart" onClick={closeMobile} className="text-gray-300 hover:text-teal-400 transition-colors font-medium py-1 flex items-center">
                    Корзина
                    {cartCount > 0 && (
                      <span className="ml-2 bg-teal-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/orders" onClick={closeMobile} className="text-gray-300 hover:text-teal-400 transition-colors font-medium py-1">
                    Мои заказы
                  </Link>
                </>
              )}

              {user?.role === 'ADMIN' && (
                <Link to="/admin" onClick={closeMobile} className="text-gray-300 hover:text-teal-400 transition-colors font-medium py-1">
                  Админ-панель
                </Link>
              )}

              <div className="border-t border-gray-700 pt-3 mt-2">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-gray-400 text-sm">{user?.name}</span>
                    <button
                      onClick={handleLogout}
                      className="text-left text-gray-300 hover:text-teal-400 transition-colors font-medium py-1"
                    >
                      Выход
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link to="/login" onClick={closeMobile} className="text-gray-300 hover:text-teal-400 transition-colors font-medium py-1">
                      Войти
                    </Link>
                    <Link to="/register" onClick={closeMobile} className="text-teal-400 hover:text-teal-300 transition-colors font-medium py-1">
                      Регистрация
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
