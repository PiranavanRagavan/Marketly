import { orders as mockOrders } from "@/data/orders";
import { Order } from "@/data/orders";
import OrderCard from "@/components/orders/OrderCard";
import { toast } from "sonner";
import { Package, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Orders = () => {
  const { addMultipleToCart, cartCount } = useCart();
  const navigate = useNavigate();

  const handleReorder = (order: Order) => {
    // Add all items from the order to cart
    const itemsToAdd = order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    
    addMultipleToCart(itemsToAdd);
    
    // Show success toast with action to view cart
    toast.success(
      `${order.items.length} item(s) added to cart from order ${order.id}`,
      {
        action: {
          label: "View Cart",
          onClick: () => navigate("/cart"),
        },
      }
    );
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Order History</h1>
        </div>

        {mockOrders.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed bg-muted/50">
            <div className="text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-semibold text-muted-foreground">
                No orders yet
              </p>
              <p className="text-sm text-muted-foreground">
                Start shopping to see your orders here
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockOrders.map((order) => (
              <OrderCard key={order.id} order={order} onReorder={handleReorder} />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Orders;
