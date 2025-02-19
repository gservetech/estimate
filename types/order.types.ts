export interface Order {
    orderNumber: number; // Primary key (Auto-incrementing SERIAL in PostgreSQL)
    stripeCheckoutSessionId: string; // Required, max length 500
    stripeCustomerId?: string | null; // Nullable, max length 255
    storeUserId?: number | null; // Nullable foreign key reference to users
    stripePaymentIntentId?: string | null; // Nullable, max length 255
    totalPrice: number; // Required, Numeric (10,2)
    currencyCode: string; // Required, 3-character currency code
    amountDiscount?: number; // Numeric (10,2) - Default 0.00
    orderStatusId: number; // Foreign key reference to order_statuses
    orderDate?: Date; // Default: current timestamp
    trackingNumber?: string | null; // Unique nullable tracking number, max length 255
    deliveryDate?: Date | null; // Nullable timestamp
  }
  