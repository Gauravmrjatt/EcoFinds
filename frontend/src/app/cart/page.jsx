'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotals, setCartTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const router = useRouter();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cart`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) throw new Error('Failed to fetch cart');

      const data = await response.json();
      setCartItems(data.cart?.items || []);
      setCartTotals(data.totals || null);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdating(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cart`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ productId, quantity: newQuantity }),
        }
      );

      if (!response.ok) throw new Error('Failed to update quantity');

      const data = await response.json();
      setCartItems(data.cart?.items || []);
      setCartTotals(data.totals || null);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cart/${productId}`,
        { method: 'DELETE', headers: getAuthHeaders() }
      );

      if (!response.ok) throw new Error('Failed to remove item');

      const data = await response.json();
      setCartItems(data.cart?.items || []);
      setCartTotals(data.totals || null);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Image
              src="/auth.svg"
              alt="Cart"
              width={200}
              height={200}
              className="mx-auto mb-4"
              unoptimized
            />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Authentication Required
            </h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to view your cart.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Your Cart</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : cartItems.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="h-16 w-16 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            Your cart is empty
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </Card>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Items */}
          <div className="lg:col-span-7">
            <ul className="divide-y divide-border">
              {cartItems.map((item) => (
                <li key={item.product._id} className="py-6 flex">
                  <div className="flex-shrink-0 w-24 h-24 border border-border rounded-md overflow-hidden">
                    <Image
                      src={item.product.images[0] || '/placeholder-eco.jpg'}
                      alt={item.product.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-center object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-foreground">
                        <h3>
                          <Link href={`/products/${item.product._id}`}>
                            {item.product.title}
                          </Link>
                        </h3>
                        <p className="ml-4">
                          {formatCurrency(
                            (item.product.price || 0) * (item.quantity || 1)
                          )}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatCurrency(item.product.price || 0)} each
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Seller: {item.product.seller?.username || 'Unknown'}
                      </p>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
                          disabled={updating}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="mx-2 text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                          disabled={updating}
                        >
                          <svg
                            className="w-5 h-5"
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
                        </button>
                      </div>

                      <button
                        type="button"
                        className="font-medium text-primary hover:underline disabled:opacity-50"
                        onClick={() => removeItem(item.product._id)}
                        disabled={updating}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div className="mt-10 lg:mt-0 lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {cartTotals ? (
                  <dl className="space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-muted-foreground">
                        Subtotal
                      </dt>
                      <dd className="text-sm font-medium text-foreground">
                        {formatCurrency(cartTotals.subtotal)}
                      </dd>
                    </div>
                    <div className="border-t border-border pt-4 flex items-center justify-between">
                      <dt className="text-sm text-muted-foreground">
                        Shipping
                      </dt>
                      <dd className="text-sm font-medium text-foreground">
                        {formatCurrency(cartTotals.shipping)}
                      </dd>
                    </div>
                    <div className="border-t border-border pt-4 flex items-center justify-between">
                      <dt className="text-sm text-muted-foreground">GST</dt>
                      <dd className="text-sm font-medium text-foreground">
                        {formatCurrency(cartTotals.tax)}
                      </dd>
                    </div>
                    <div className="border-t border-border pt-4 flex items-center justify-between">
                      <dt className="text-base font-medium text-foreground">
                        Order total
                      </dt>
                      <dd className="text-base font-medium text-foreground">
                        {formatCurrency(cartTotals.total)}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Loading totals...
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  className="w-full"
                  disabled={cartItems.length === 0 || updating}
                >
                  {updating ? 'Updating...' : 'Checkout'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
