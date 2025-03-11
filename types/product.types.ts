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
  weight: number | null | undefined;
  height?: number | null;
  width?: number | null;
  label?: string;
  status_id?: number; // Made optional
  status?: { id: number; name: string }; // Added status object
  affiliate_provider?: AffiliateProvider | null;
  created_at?: string;
  updated_at?: string;
  product_url?: string;
  shippingTime?: string;
}
