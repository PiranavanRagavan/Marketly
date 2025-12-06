import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, Mail } from "lucide-react";
import { orders } from "@/data/orders";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orders.find((o) => o.id === orderId);
  const { cartCount } = useCart();

  if (!order) {
    return (
      <>
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <p className="mb-4 text-xl font-semibold text-muted-foreground">
                  Order not found
                </p>
                <Link to="/orders">
                  <Button>Back to Orders</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const getStatusColor = (status: typeof order.status) => {
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
    <>
      <main className="container mx-auto px-4 py-8">
        <Link
          to="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Order Tracking
              </h1>
              <p className="text-muted-foreground">{order.id}</p>
            </div>
          </div>
          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Delivery Status</h2>
              </CardHeader>
              <CardContent>
                <OrderTimeline status={order.status} />

                {order.trackingNumber && (
                  <div className="mt-6 rounded-lg bg-muted p-4">
                    <p className="text-sm font-semibold text-foreground">
                      Tracking Number
                    </p>
                    <p className="font-mono text-lg">{order.trackingNumber}</p>
                  </div>
                )}

                {order.estimatedDelivery && (
                  <div className="mt-4 rounded-lg bg-muted p-4">
                    <p className="text-sm font-semibold text-foreground">
                      Estimated Delivery
                    </p>
                    <p className="text-lg">
                      {new Date(order.estimatedDelivery).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}

                {order.status === "Delivered" && (
                  <div className="mt-6 rounded-lg border-l-4 border-success bg-success/10 p-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-semibold text-success">
                          Delivery Confirmed
                        </p>
                        <p className="text-sm text-muted-foreground">
                          A confirmation email has been sent to your registered
                          email address.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Order Details</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-semibold">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="mb-3 text-sm font-semibold">Items</p>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {item.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderTracking;
