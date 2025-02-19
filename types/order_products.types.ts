export interface OrderProduct {
    id: number; // Primary key (Auto-incrementing SERIAL in PostgreSQL)
    orderNumber: number; // Foreign key reference to orders
    productId: number; // Foreign key reference to product
    quantity: number; // Default: 1 (Required)
    priceAtOrderTime: number; // Numeric (10,2) - Required
    totalPrice: number; // Numeric (10,2) - Computed as (quantity * priceAtOrderTime)
  }
  