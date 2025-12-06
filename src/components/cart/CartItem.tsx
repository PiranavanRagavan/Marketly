import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CartItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({
  id,
  name,
  image,
  price,
  quantity,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  return (
    <Card>
      <CardContent className="flex gap-4 p-4">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="mt-1 text-lg font-bold text-primary">
              ${price.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => onUpdateQuantity(id, Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => onUpdateQuantity(id, quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => onRemove(id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
