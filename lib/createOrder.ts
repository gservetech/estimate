import { countries, provincesByCountry } from "@/data/states";

// Helper function to get country ID from country code
export function getCountryId(countryCode: string): {
  id: number;
  name: string;
} {
  const countryName = countryCode === "CA" ? "Canada" : "US";
  const country = countries.find((c) => c.country_name === countryName);

  return {
    id: country?.id || 1, // Default to US (1) if not found
    name: countryName, // Will be either "Canada" or "US"
  };
}

// Helper function to get province ID from province code
export function getProvinceId(
  provinceCode: string | null,
  countryId: number
): { id: number | null; name: string | null } {
  if (!provinceCode || countryId !== 2) {
    return { id: null, name: null }; // Return null for both if not Canada or no province code
  }

  const province = provincesByCountry.find(
    (p) => p.province_code === provinceCode && p.country_id === countryId
  );

  return {
    id: province?.id || null,
    name: province?.province_name || null,
  };
}

interface OrderProduct {
  productId: number;
  quantity: number;
  unitPrice: number;
}

interface CreateOrderRequest {
  clerkId: string;
  totalPrice: number;
  currencyCode: string;
  amountDiscount: number;
  orderStatusId: number;
  orderDate: string;
  trackingNumber: string;
  deliveryDate: string;
  shippingAddressId: number;
  street: string;
  city: string;
  provinceId: number | null;
  provinceName: string | null;
  countryId: number;
  countryName: string;
  postalCode: string;
  products: OrderProduct[];
}

export async function createOrderRequest(orderData: CreateOrderRequest) {
  try {
    // Validate clerkId
    if (!orderData.clerkId) {
      throw new Error("clerkId is required");
    }

    console.log(
      "Sending order request to:",
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/create`
    );
    console.log("Order data being sent:", JSON.stringify(orderData, null, 2));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: orderData,
        }),
      }
    );

    const responseData = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", responseData);

    if (!response.ok) {
      throw new Error(
        responseData.error || responseData.message || "Failed to create order"
      );
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error("Detailed error in createOrderRequest:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}

export function generateTrackingNumber(): string {
  return `${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}${Date.now().toString(36).substring(-4)}`;
}

export function formatOrderDate(date: Date): string {
  return date.toISOString().slice(0, 19);
}
