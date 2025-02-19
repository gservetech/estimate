export interface Promotion {
    id: number; // Primary key (Auto-incrementing SERIAL in PostgreSQL)
    product_id: number; // Foreign key reference to product
    promotion_start_date?: Date; // Default: current timestamp
    promotion_end_date?: Date | null; // Nullable timestamp
    discount_percentage?: number; // Numeric (5,2) - Default 0.00, must be between 0 and 100
    discounted_price: number; // Numeric (10,2) - required
  }
  