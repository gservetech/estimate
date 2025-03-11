export interface User {
  email: string;
  name?: string;
  profile_image_url?: string | null;
  created_at?: Date;
  updated_at?: Date;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  clerkId?: string | null;
}

export type UserOrder = {
  id: number;
  email: string;
  name: string;
  profileImageUrl: string;
  phone: string;
  firstname: string;
  lastname: string;
  middlename: string;
  addresses: [
    {
      id: number;
      userId: number;
      street: string;
      city: string;
      provinceId: number;
      stateId: number;
      postalCode: string;
      countryId: number;
      status: string;
    }
  ];
};
