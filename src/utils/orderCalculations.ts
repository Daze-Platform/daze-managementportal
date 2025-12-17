
import { Order } from '@/hooks/useOrderData';

export const calculateTotalRevenue = (orders: Order[]): number => {
  return orders.reduce((sum: number, order: Order) => {
    const amount = parseFloat(order.items.split('$')[1] || '0');
    return sum + amount;
  }, 0);
};
