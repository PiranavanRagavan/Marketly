export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered";
  items: OrderItem[];
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export const orders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "Delivered",
    items: [
      {
        productId: "1",
        productName: "Wireless Bluetooth Headphones",
        productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        quantity: 1,
        price: 89.99,
      },
      {
        productId: "10",
        productName: "Wireless Mouse",
        productImage: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
        quantity: 2,
        price: 24.99,
      },
    ],
    total: 139.97,
    trackingNumber: "TRK1234567890",
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-20",
    status: "Shipped",
    items: [
      {
        productId: "2",
        productName: "Smart Watch Series 7",
        productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        quantity: 1,
        price: 299.99,
      },
    ],
    total: 299.99,
    trackingNumber: "TRK9876543210",
    estimatedDelivery: "2024-01-25",
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-22",
    status: "Processing",
    items: [
      {
        productId: "4",
        productName: "Ergonomic Office Chair",
        productImage: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&q=80",
        quantity: 1,
        price: 349.99,
      },
      {
        productId: "11",
        productName: "Desk Lamp LED",
        productImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
        quantity: 1,
        price: 49.99,
      },
    ],
    total: 399.98,
    estimatedDelivery: "2024-01-28",
  },
];
