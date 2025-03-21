import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserOrders } from "@/lib/getUserOrders";
import { Order } from "@/types/order.types";
import { User } from "@/types/user.types";
import { format, parseISO } from "date-fns";
import { Calendar, FileX, Package } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// Update the Order type to match your actual data structure

type OrderProduct = Array<{
  product_id: number;
  quantity: number;
  unit_price: number;
}>;

const OrdersPage = async () => {
  const {
    user,
    orders: unsortedOrders,
    error,
  }: {
    user: User | null;
    orders: Order[];
    error: string | null;
  } = await getUserOrders();

  if (!user) {
    return redirect("/");
  }

  // Sort orders by date in descending order (newest first)
  const orders = [...unsortedOrders].sort((a, b) => {
    const dateA = a.orderdate ? new Date(a.orderdate).getTime() : 0;
    const dateB = b.orderdate ? new Date(b.orderdate).getTime() : 0;
    return dateB - dateA;
  });

  // Handle API errors (like connection issues)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <FileX className="h-24 w-24 text-red-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Error Loading Orders
        </h2>
        <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
          {error}
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  // If no orders, show a simple fallback component
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white flex items-center justify-center py-20">
        <div className="text-center space-y-6">
          <div className="mx-auto rounded-lg shadow-md overflow-hidden w-40 h-40 flex items-center justify-center bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-300"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">No Orders Yet</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            You haven&rsquo;t placed any orders yet. Start shopping and discover
            our amazing products!
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getOrderStatus = (statusId: number) => {
    switch (statusId) {
      case 1:
        return { text: "Pending", className: "bg-yellow-100 text-yellow-800" };
      case 2:
        return {
          text: "Cancelled",
          className: "bg-red-100 text-red-800",
        };
      case 3:
        return { text: "Complete", className: "bg-green-100 text-green-800" };
      default:
        return { text: "Processing", className: "bg-gray-100 text-gray-800" };
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "No date";
    try {
      const date = parseISO(dateString);
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Invalid Date";
    }
  };

  const calculateTotalItems = (products: OrderProduct | undefined) => {
    if (!products) return 0;
    return products.reduce((sum, product) => sum + (product.quantity || 0), 0);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Container className="py-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>

          {orders.map((order) => {
            const status = getOrderStatus(order.order_status_id);
            return (
              <Card key={order.ordernumber} className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        Order #
                        {/* {order.ordernumber
                          ? order.ordernumber.slice(0, 8)
                          : "N/A"} */}
                        {order.ordernumber}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.orderdate)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
                      >
                        {status.text}
                      </span>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          Tracking: {order.trackingnumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Order Details */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Items</span>
                          <span>{calculateTotalItems(order.products)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span>${(order.totalprice || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount</span>
                          <span className="text-green-600">
                            -${(order.amountdiscount || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>
                            $
                            {(
                              (order.totalprice || 0) -
                              (order.amountdiscount || 0)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Shipping Address</h3>
                      <div className="text-sm space-y-1 text-gray-600">
                        <p>
                          {order.shipping_address.street || "No street address"}
                        </p>
                        <p>
                          {order.shipping_address.city || "No city"},{" "}
                          {order.shipping_address.province ||
                            order.shipping_address.state ||
                            "No province/state"}
                        </p>
                        <p>
                          {order.shipping_address.postal_code ||
                            "No postal code"}
                        </p>
                        <p>{order.shipping_address.country || "No country"}</p>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Delivery Information</h3>
                      <div className="text-sm space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Expected: {formatDate(order.delivery_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Ordered Items</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product ID</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.products?.map((product) => (
                          <TableRow key={product.product_id}>
                            <TableCell>#{product.product_id}</TableCell>
                            <TableCell>{product.quantity || 0}</TableCell>
                            <TableCell>
                              ${(product.unit_price || 0).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              $
                              {(
                                (product.quantity || 0) *
                                (product.unit_price || 0)
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default OrdersPage;
