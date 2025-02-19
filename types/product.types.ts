import { AffiliateProvider } from "./affiliateprovider.types";

export interface Product {
  id: number;
  name: string;
  images: string[];
  description?: string[];
  price: number;
  discount?: number;
  category_id: number;
  stock?: number;
  weight?: number;
  height?: number;
  width?: number;
  label?: string;
  status_id: number;
  affiliate_provider?: AffiliateProvider | null; // Changed from `affiliate_provider_id`
  created_at?: Date;
  updated_at?: Date;
  product_url?: string;
  shippingTime?: string;
}
