'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// ✅ Helper function to render auth links
function renderAuthLinks(authItems, setIsMenuOpen) {
  return authItems.map((item) => (
    <Link
      key={item.name}
      href={item.href}
      aria-current={
        typeof window !== 'undefined' &&
        window.location.pathname === item.href
          ? 'page'
          : undefined
      }
      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                 bg-primary/10 text-primary hover:bg-primary/20
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      onClick={() => setIsMenuOpen?.(false)}
    >
      {item.name}
    </Link>
  ));
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, logout, loading } = useAuth();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
  ];

  const authItems = isAuthenticated
    ? [
        { name: 'Profile', href: '/profile' },
        { name: 'My Listings', href: '/profile/listings' },
        { name: 'Purchase History', href: '/profile/purchases' },
      ]
    : [
        { name: 'Login', href: '/auth/login' },
        { name: 'Register', href: '/auth/register' },
      ];

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + Nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                EcoFinds
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-muted hover:text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden sm:flex sm:items-center space-x-4">
            {isAuthenticated && (
              <Link
                href="/products/add"
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                           text-primary-foreground bg-primary hover:bg-primary/90
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Sell
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-1 rounded-full text-muted-foreground hover:text-foreground
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="sr-only">View cart</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 
                     2.293c-.63.63-.184 1.707.707 1.707H17m0 
                     0a2 2 0 100 4 2 2 0 000-4zm-8 
                     2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {/* Badge example (replace with real cart count) */}
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold px-1.5 rounded-full">
                3
              </span>
            </Link>

            {renderAuthLinks(authItems)}

            {isAuthenticated && (
              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                           text-destructive-foreground bg-destructive hover:bg-destructive/90
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive disabled:opacity-50"
                onClick={logout}
                disabled={loading}
              >
                {loading ? 'Logging out…' : 'Logout'}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground
                         hover:text-foreground hover:bg-accent focus:outline-none
                         focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden transition-all duration-300 ease-in-out">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  pathname === item.href
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:bg-accent hover:border-accent-foreground hover:text-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="space-y-1">
              {/* Cart */}
              <Link
                href="/cart"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium 
                           text-muted-foreground hover:bg-accent hover:border-accent-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
              </Link>

              {renderAuthLinks(authItems, setIsMenuOpen)}

              {isAuthenticated && (
                <button
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent 
                             text-base font-medium text-muted-foreground hover:bg-accent 
                             hover:border-accent-foreground hover:text-foreground disabled:opacity-50"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  disabled={loading}
                >
                  {loading ? 'Logging out…' : 'Logout'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
