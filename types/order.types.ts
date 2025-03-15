export type Order = {
  ordernumber: string;
  clerk_id: string;
  totalprice: number;
  currency_code: string;
  amountdiscount: number;
  order_status_id: number;
  orderdate: string;
  trackingnumber: string;
  delivery_date: string;
  shipping_address: {
    street: string;
    city: string;
    province: string | null;
    state: string | null;
    country: string;
    postal_code: string;
  };
  products: Array<{
    product_id: number;
    quantity: number;
    unit_price: number;
  }>;
};
