import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/data/products';

export const useWishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem('wishlist');
      if (stored) {
        setWishlistItems(JSON.parse(stored));
      }
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user && wishlistItems.length > 0) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  const addToWishlist = useCallback(
    (product: Product) => {
      if (!user) {
        toast({
          title: 'Login Required',
          description: 'Please login to add items to your wishlist',
          variant: 'destructive',
        });
        return false;
      }

      if (wishlistItems.some((item) => item.id === product.id)) {
        toast({
          title: 'Already in Wishlist',
          description: `${product.name} is already in your wishlist`,
        });
        return false;
      }

      setWishlistItems((prev) => {
        const updated = [...prev, product];
        localStorage.setItem('wishlist', JSON.stringify(updated));
        return updated;
      });
      
      toast({
        title: 'Added to Wishlist',
        description: `${product.name} has been added to your wishlist`,
      });
      return true;
    },
    [user, wishlistItems, toast]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      if (!user) return false;

      setWishlistItems((prev) => {
        const updated = prev.filter((item) => item.id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updated));
        return updated;
      });
      
      toast({
        title: 'Removed',
        description: 'Item removed from wishlist',
      });
      return true;
    },
    [user, toast]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems]
  );

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading,
  };
};
