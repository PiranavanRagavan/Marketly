import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Filter, ArrowUpDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  
  const [sortBy, setSortBy] = useState<string>('added');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: 'Login Required',
        description: 'Please login to view your wishlist',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [user, authLoading, navigate, toast]);

  // Filter and sort items
  const getFilteredItems = () => {
    let result = [...wishlistItems];

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Apply stock filter
    if (stockFilter === 'in-stock') {
      result = result.filter((item) => item.stock > 0);
    } else if (stockFilter === 'out-of-stock') {
      result = result.filter((item) => item.stock === 0);
    } else if (stockFilter === 'low-stock') {
      result = result.filter((item) => item.stock > 0 && item.stock < 20);
    }

    // Apply sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  };

  const filteredItems = getFilteredItems();

  const handleMoveToCart = (item: typeof wishlistItems[0]) => {
    if (item.stock === 0) {
      toast({
        title: 'Out of Stock',
        description: 'This item is currently out of stock',
        variant: 'destructive',
      });
      return;
    }

    addToCart(item, 1);
    removeFromWishlist(item.id);
    toast({
      title: 'Moved to Cart',
      description: `${item.name} has been moved to your cart`,
    });
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
  };

  const categories = Array.from(
    new Set(wishlistItems.map((item) => item.category))
  );

  if (authLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Heart className="h-8 w-8 fill-current text-destructive" />
          My Wishlist
        </h1>
        <p className="text-muted-foreground mt-1">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="added">Most Recent</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Stock status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              {wishlistItems.length === 0
                ? 'Your wishlist is empty'
                : 'No items match your filters'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  onClick={() => handleRemove(item.id)}
                >
                  <Heart className="h-5 w-5 fill-current text-destructive" />
                </Button>
                {item.stock < 20 && item.stock > 0 && (
                  <Badge className="absolute top-2 left-2 bg-warning text-warning-foreground">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Low Stock
                  </Badge>
                )}
                {item.stock === 0 && (
                  <Badge className="absolute top-2 left-2 bg-destructive">
                    Out of Stock
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">
                  {item.category}
                </Badge>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-2xl font-bold text-primary mb-4">
                  ${item.price.toFixed(2)}
                </p>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleMoveToCart(item)}
                    disabled={item.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {item.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};

export default Wishlist;
