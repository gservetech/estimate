"use server";

interface Address {
  id: number;
  userId: number;
  street: string;
  city: string;
  provinceId: number;
  stateId: number;
  postalCode: string;
  status: string;
  country_id: number;
}

interface UserData {
  clerkId: string;
  email: string;
  fullname: string;
  profileImageUrl: string;
  phone: string;
  firstname: string;
  lastname: string;
  middlename?: string;
  addresses: Address[];
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function createUser(userData: UserData) {
  const formattedUserData = JSON.stringify(userData);

  try {
    const response = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: formattedUserData,
    });

    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType?.includes("application/json")) {
      const text = await response.text();
      console.error("API Error Response:", text);
      throw new Error("Invalid response from server");
    }

    const result = await response.json();
    console.log("result", result);

    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}
