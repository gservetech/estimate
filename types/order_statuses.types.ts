export interface OrderStatus {
    id: number; // Primary key (Auto-incrementing SERIAL in PostgreSQL)
    name: string; // Required, unique, max length 255
  }
  