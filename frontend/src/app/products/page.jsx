'use client';

import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const categories = [
  'All Categories',
  'Home & Garden',
  'Fashion',
  'Electronics',
  'Health & Beauty',
  'Food & Beverages',
  'Toys & Games',
  'Sports & Outdoors',
  'Books & Media',
  'Other'
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory && selectedCategory !== 'All Categories') {
        params.append('category', selectedCategory);
      }
      if (sortBy) params.append('sort', sortBy);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/cart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity: 1 })
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Eco-Friendly Products</h1>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="name-desc">Name: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Active Filters */}
        {(searchQuery || selectedCategory !== 'All Categories') && (
          <div className="flex gap-2 mb-4">
            {searchQuery && (
              <Badge variant="secondary">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-xs"
                >
                  ✕
                </button>
              </Badge>
            )}
            {selectedCategory !== 'All Categories' && (
              <Badge variant="secondary">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('All Categories')}
                  className="ml-2 text-xs"
                >
                  ✕
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 mb-8">
          <Image
            src="/empty.svg"
            alt="No products found"
            width={200}
            height={200}
            className="mx-auto mb-4"
            unoptimized
          />
          <p className="text-gray-500 text-lg mt-5">No products found.</p>
          {(searchQuery || selectedCategory !== 'All Categories') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            
            <Card key={product._id || product.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-w-3 aspect-h-2 w-full overflow-hidden">
                  <Image
                    src={product.images[0] || '/placeholder-eco.jpg'}
                    alt={product.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                    unoptimized
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-medium text-gray-900">
                  <Link href={`/products/${product._id || product.id}`} className="hover:text-green-600">
                    {product.title}
                  </Link>
                </CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-500">Seller: {product.seller?.username || 'Unknown'}</p>
                  {product.category && (
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm text-gray-500 mb-4">
                  {product.description}
                </CardDescription>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium text-gray-900">${product.price?.toFixed(2) || '0.00'}</p>
                  <div className="text-sm text-gray-500">
                    {product.createdAt && new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t-0">
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 text-white hover:bg-green-600/80"
                    onClick={() => addToCart(product._id || product.id)}
                  >
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm">
                    <Link href={`/products/${product._id || product.id}`}>View</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}