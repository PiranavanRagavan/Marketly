import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Truck, Shield, Clock, Eye } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Product } from "@/data/products";

const Index = () => {
  const featuredProducts = products.filter((p) => p.featured);
  const { addToCart, cartCount } = useCart();
  const { recentlyViewed } = useRecentlyViewed();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Free shipping on orders over $100",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure payment processing",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Dedicated customer support team",
    },
    {
      icon: ShoppingBag,
      title: "Easy Returns",
      description: "30-day hassle-free returns",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold text-foreground md:text-6xl">
              Shop the Best Products
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                at Amazing Prices
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Discover thousands of products from top brands with fast shipping and secure checkout
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products">
                <Button size="lg" className="gap-2">
                  Browse Products <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/orders">
                <Button size="lg" variant="outline">
                  Track Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <Eye className="h-7 w-7" />
                  Recently Viewed
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Pick up where you left off
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentlyViewed.slice(0, 3).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Featured Products
              </h2>
              <p className="mt-2 text-muted-foreground">
                Handpicked products just for you
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
            Start Shopping Today
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/90">
            Join thousands of satisfied customers and experience seamless online shopping
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="gap-2">
              Explore Products <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Index;
