export type OrderProduct = {
  productId: number;
  quantity: number;
  unitPrice: number;
};

export type CreateOrderData = {
  clerkId: string;
  totalPrice: number;
  currencyCode: string;
  amountDiscount: number;
  orderStatusId: number;
  orderDate: string;
  trackingNumber: string;
  deliveryDate: string;
  shippingAddressId: number;
  street?: string;
  city?: string;
  provinceId?: number | null;
  provinceName?: string | null;
  countryId?: number;
  countryName?: string;
  postalCode?: string;
  products: OrderProduct[];
};

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
