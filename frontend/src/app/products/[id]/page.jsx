'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Product not found');
      }
      
      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.message);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId: params.id, quantity: 1 })
      });
      
      if (response.ok) {
        toast.success('Added to cart!');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Product not found</h2>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/products"
          className="text-primary hover:text-primary/80 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back to Products
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Product Image */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="aspect-square rounded-lg overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.title}
              width={500}
              height={500}
              className="w-full h-full object-center object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-10 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {product.title}
          </h1>
          
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">Category: {product.category || 'Uncategorized'}</p>
          </div>

          <div className="mt-3">
            <p className="text-3xl font-semibold text-foreground">₹{product.price?.toFixed(2) || '0.00'}</p>
          </div>

          <div className="mt-6">
            <p className="text-base text-muted-foreground">{product.description}</p>
          </div>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground">Listed on: {new Date(product.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="mt-6">
            <div className="flex space-x-3">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="lg" onClick={addToCart}>
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                Contact Seller
              </Button>
            </div>
          </div>

          {product.features?.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-medium text-foreground">Features</h2>
              <ul className="mt-4 pl-4 list-disc text-sm text-muted-foreground space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Seller Info */}
          <div className="mt-10 pb-10 border-b border-border">
            <h2 className="text-lg font-medium text-foreground">Seller Information</h2>
            <div className="mt-4 flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-medium">
                  {product.seller?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-foreground">{product.seller?.username || 'Unknown Seller'}</h3>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
