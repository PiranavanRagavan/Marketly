import { CheckCircle, Circle, Package, Truck, Home } from "lucide-react";
import { Order } from "@/data/orders";

interface OrderTimelineProps {
  status: Order["status"];
}

const OrderTimeline = ({ status }: OrderTimelineProps) => {
  const steps = [
    { name: "Processing", icon: Package, status: "Processing" },
    { name: "Shipped", icon: Truck, status: "Shipped" },
    { name: "Delivered", icon: Home, status: "Delivered" },
  ];

  const currentStepIndex = steps.findIndex((step) => step.status === status);

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-8 h-[calc(100%-2rem)] w-0.5 bg-muted" />
      
      <div className="space-y-8">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.name} className="relative flex items-start gap-4">
              {/* Icon */}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted bg-background text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-0.5">
                <div
                  className={`mb-1 font-semibold ${
                    isCurrent ? "text-primary" : "text-foreground"
                  }`}
                >
                  {step.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  <span>
                    {isCompleted
                      ? "Completed"
                      : isCurrent
                      ? "In Progress"
                      : "Pending"}
                  </span>
                </div>
                {isCurrent && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {status === "Processing" &&
                      "Your order is being prepared for shipment"}
                    {status === "Shipped" &&
                      "Your order is on its way"}
                    {status === "Delivered" &&
                      "Your order has been delivered"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
