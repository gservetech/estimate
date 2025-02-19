export interface Category {
    id: number; // Primary key (Auto-incrementing SERIAL in PostgreSQL)
    category_name: string; // Category name with a max length of 100 characters
  }
  