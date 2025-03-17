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
