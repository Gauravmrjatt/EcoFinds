'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeaders, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPurchases();
    } else {
      router.push('/auth/login');
    }
  }, [isAuthenticated]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/purchases`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) throw new Error('Failed to fetch purchases');

      const data = await response.json();
      setPurchases(data.purchases || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Failed to load your purchases');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Authentication Required
              </h2>
              <p className="text-muted-foreground mb-6">
                You need to be logged in to view your purchases.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/register">Register</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Purchases</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your past orders
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : purchases.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 14h30l-3 18H12L9 14z"
                />
              </svg>
              <h3 className="text-lg font-medium text-foreground mt-4">
                No purchases yet
              </h3>
              <p className="text-muted-foreground mt-2">
                Start shopping and your purchases will appear here.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/products">Shop Now</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {purchases.map((purchase) => (
            <PurchaseCard key={purchase._id} purchase={purchase} />
          ))}
        </div>
      )}
    </div>
  );
}

function PurchaseCard({ purchase }) {
  const statusConfig = {
    completed: { label: 'Completed', variant: 'default' },
    processing: { label: 'Processing', variant: 'secondary' },
    cancelled: { label: 'Cancelled', variant: 'destructive' },
  };

  const status = statusConfig[purchase.status] || {
    label: purchase.status,
    variant: 'secondary',
  };

  return (
    <Card>
      <CardHeader className="p-0">
        <div className="aspect-w-3 aspect-h-2 w-full overflow-hidden">
          <Image
            src={purchase.product.images[0] || '/placeholder-eco.jpg'}
            alt={purchase.product.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
            unoptimized
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-medium text-foreground mb-2">
          {purchase.product.title}
        </CardTitle>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{purchase.product.category}</Badge>
          <span className="text-sm text-muted-foreground">
            Purchased {new Date(purchase.createdAt).toLocaleDateString()}
          </span>
        </div>
        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {purchase.product.description}
        </CardDescription>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium text-foreground">
            ₹{purchase.product.price?.toFixed(2) || '0.00'}
          </p>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <Link href={`/purchases/${purchase._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
