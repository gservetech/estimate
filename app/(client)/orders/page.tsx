import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserOrders } from "@/lib/getUserOrders";
import { FileX } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { format } from "date-fns";

const OrdersPage = async () => {
  const { user, orders, error } = await getUserOrders();

  if (!user) {
    return redirect("/");
  }

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

  const getOrderStatus = (statusId: number) => {
    switch (statusId) {
      case 1:
        return { text: "Pending", className: "bg-yellow-100 text-yellow-800" };
      case 2:
        return { text: "Completed", className: "bg-green-100 text-green-800" };
      case 3:
        return { text: "Cancelled", className: "bg-red-100 text-red-800" };
      default:
        return { text: "Processing", className: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div>
      <Container className="py-10">
        {orders?.length ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Order List</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] md:w-auto">
                        Order Number
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Shipping
                      </TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const status = getOrderStatus(order.orderStatusId);
                      return (
                        <TableRow key={order.orderNumber}>
                          <TableCell className="font-medium">
                            <Link
                              href={`/orders/${order.orderNumber}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              #{order.orderNumber}
                            </Link>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {format(new Date(order.orderDate), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {order.city},{" "}
                            {order.provinceName || order.stateName}
                          </TableCell>
                          <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}
                            >
                              {status.text}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <FileX className="h-24 w-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900">
              No orders found
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
              It looks like you haven&apos;t placed any orders yet. Start
              shopping to see your orders here!
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Browse Products</Link>
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;
