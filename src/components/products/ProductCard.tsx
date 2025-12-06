import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/data/products";
import { Link } from "react-router-dom";
import { useWishlist } from "@/hooks/useWishlist";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleProductClick = () => {
    addToRecentlyViewed(product);
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/products/${product.id}`} onClick={handleProductClick}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {product.featured && (
            <Badge className="absolute left-2 top-2 bg-primary">
              Featured
            </Badge>
          )}
          {product.stock < 10 && (
            <Badge variant="destructive" className="absolute right-2 top-2">
              Low Stock
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="mb-1 line-clamp-2 font-semibold text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>
        
        <div className="mb-2 flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mb-2">
          <span className="text-2xl font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          {product.stock > 0 ? (
            <span className="text-success">In Stock ({product.stock})</span>
          ) : (
            <span className="text-destructive">Out of Stock</span>
          )}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
        <Button
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          variant={inWishlist ? "secondary" : "outline"}
          size="icon"
          className="flex-shrink-0"
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current text-destructive' : ''}`} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
