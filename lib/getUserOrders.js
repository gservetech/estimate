// lib/getUserOrders.js
import { auth, currentUser } from "@clerk/nextjs/server";
import { getMyOrders } from "@/sanity/helpers";

export async function getUserOrders() {
  const user = await currentUser();
  const { userId } = await auth();

  let orders = [];
  if (userId) {
    orders = await getMyOrders(userId);
  }

  return { user, orders };
}
