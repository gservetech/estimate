// Country and province mapping functions
export function getCountryId(countryCode: string): { id: number; name: string } {
  // Default to US if no country code provided
  if (!countryCode) return { id: 1, name: "United States" };
  
  // Simple mapping of country codes to IDs and names
  const countryMap: Record<string, { id: number; name: string }> = {
    US: { id: 1, name: "United States" },
    CA: { id: 2, name: "Canada" },
    UK: { id: 3, name: "United Kingdom" },
    AU: { id: 4, name: "Australia" },
    // Add more countries as needed
  };
  
  return countryMap[countryCode] || { id: 1, name: "United States" };
}

export function getProvinceId(
  provinceCode: string | null,
  countryId: number
): { id: number | null; name: string | null } {
  if (!provinceCode) return { id: null, name: null };
  
  // US states
  if (countryId === 1) {
    const stateMap: Record<string, { id: number; name: string }> = {
      AL: { id: 1, name: "Alabama" },
      AK: { id: 2, name: "Alaska" },
      AZ: { id: 3, name: "Arizona" },
      // Add more states as needed
    };
    return stateMap[provinceCode] || { id: null, name: null };
  }
  
  // Canadian provinces
  if (countryId === 2) {
    const provinceMap: Record<string, { id: number; name: string }> = {
      ON: { id: 101, name: "Ontario" },
      BC: { id: 102, name: "British Columbia" },
      // Add more provinces as needed
    };
    return provinceMap[provinceCode] || { id: null, name: null };
  }
  
  return { id: null, name: null };
}

// Generate a unique tracking number for orders
export function generateTrackingNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TRK-${timestamp}-${random}`;
}

// Add the types from your existing code
export interface OrderProduct {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
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
