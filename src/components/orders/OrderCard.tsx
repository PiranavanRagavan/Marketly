import { Order } from "@/data/orders";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderCardProps {
  order: Order;
  onReorder: (order: Order) => void;
}

const OrderCard = ({ order, onReorder }: OrderCardProps) => {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-success text-success-foreground";
      case "Shipped":
        return "bg-info text-info-foreground";
      case "Processing":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/50 pb-4">
        <div>
          <p className="text-sm text-muted-foreground">Order ID</p>
          <p className="font-semibold">{order.id}</p>
        </div>
        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Order Date: {new Date(order.date).toLocaleDateString()}
          </span>
          <span className="font-bold text-foreground">
            Total: ${order.total.toFixed(2)}
          </span>
        </div>

        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex gap-3">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-muted">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.productName}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 bg-muted/50">
        <Link to={`/orders/${order.id}`} className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <Package className="h-4 w-4" />
            Track Order
          </Button>
        </Link>
        <Button
          onClick={() => onReorder(order)}
          className="flex-1 gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reorder
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
