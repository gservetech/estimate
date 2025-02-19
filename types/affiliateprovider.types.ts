export interface AffiliateProvider {
    id: number; // Primary key (Auto-incrementing SERIAL in PostgreSQL)
    name: string; // Required, max length 255
    createdAt?: Date; // Default: current timestamp
    updatedAt?: Date; // Default: current timestamp
  }
  