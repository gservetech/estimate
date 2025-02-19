export interface User {
  id: number; // Primary key (Auto-incrementing SERIAL in PostgreSQL)
  email: string; // Unique, required
  name?: string; // Optional, equivalent to CHARACTER VARYING(255)
  provider: string; // Required, max length 50
  provider_id: string; // Unique, required
  profile_image_url?: string | null; // Nullable TEXT
  created_at?: Date; // Default: current timestamp
  updated_at?: Date; // Default: current timestamp
  phone?: string | null; // Optional, max length 20
  firstName?: string | null; // Newly added field, optional
  lastName?: string | null; // Newly added field, optional
  middleName?: string | null; // Newly added field, optional
}
