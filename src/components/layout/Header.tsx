import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Package, Search, Menu, Heart, LogIn, LogOut, User, Settings, Home, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onSearchChange?: (query: string) => void;
}

const Header = ({ onSearchChange }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isManager, isStaff, logout } = useAuth();
  const { cartCount } = useCart();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchQuery);
    }
    navigate("/products");
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
    setMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Home, show: true },
    { path: "/products", label: "Shop", icon: Store, show: true },
    { path: "/wishlist", label: "Wishlist", icon: Heart, show: user !== null },
    { path: "/orders", label: "Orders", icon: Package, show: user !== null },
    { path: "/cart", label: "Cart", icon: ShoppingCart, show: true, badge: cartCount },
    { path: "/inventory", label: "Inventory", icon: Settings, show: isManager || isStaff },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>
                  <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <Package className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold">Marketly</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-4 mt-8" role="navigation" aria-label="Mobile navigation">
                {navLinks.filter(link => link.show).map((link) => (
                  <SheetClose asChild key={link.path}>
                    <Link
                      to={link.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent",
                        isActivePath(link.path) ? "bg-accent text-accent-foreground" : "text-foreground"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                      {link.badge !== undefined && link.badge > 0 && (
                        <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </SheetClose>
                ))}

                <div className="border-t pt-4 mt-4">
                  {user ? (
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Log Out</span>
                      </Button>
                    </SheetClose>
                  ) : (
                    <SheetClose asChild>
                      <Link to="/login" className="block">
                        <Button variant="outline" className="w-full justify-start gap-3">
                          <LogIn className="h-5 w-5" />
                          <span>Login</span>
                        </Button>
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Marketly</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navLinks.filter(link => link.show && link.path !== '/cart').map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActivePath(link.path) ? "secondary" : "ghost"}
                  className="gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Button>
              </Link>
            ))}
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-md lg:flex">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                aria-label="Search products"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full"
                aria-label="Submit search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/cart" className="hidden lg:block">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="User menu">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(isManager || isStaff) && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/inventory")}>
                        <Settings className="mr-2 h-4 w-4" />
                        Inventory Management
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="hidden lg:block">
                <Button variant="ghost" className="gap-2">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <div className="pb-4 lg:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                aria-label="Search products"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full"
                aria-label="Submit search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
