export interface Product {
    id: number;
    name: string;
    label: string;
    price: number;
    stock: number;
    width: number | null;
    height: number | null;
    images: string[];
    status: {
      id: number;
      name: string;
    };
    weight: number;
    discount: number;
    created_at: string; // ISO Date string
    updated_at: string; // ISO Date string
    category_id: number;
    description: string[];
    product_url: string;
    affiliate_provider: {
      id: number;
      name: string;
    };
  }
  