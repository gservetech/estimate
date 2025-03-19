"server";

interface OrderItem {
  quantity: number;
  name: string;
  price: number;
}

export async function POST(req: Request) {
  console.log(req.json);

  try {
    const {
      email,
      orderNumber,
      orderDate,
      items,
      total,
      customerName,
      shippingAddress,
    } = await req.json();

    if (
      !email ||
      !orderNumber ||
      !orderDate ||
      !items ||
      !total ||
      !customerName ||
      !shippingAddress
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("EMAILJS_SERVICE_ID", process.env.EMAILJS_SERVICE_ID);
    console.log("EMAILJS_TEMPLATE_ID", process.env.EMAILJS_TEMPLATE_ID);
    console.log("EMAILJS_USER_ID", process.env.EMAILJS_USER_ID);

    const emailData = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_USER_ID,
      template_params: {
        to_email: email,
        from_email: "info@gservetech.com",
        customer_name: customerName,
        order_number: orderNumber,
        order_date: orderDate,
        total_price: total,
        shipping_address: shippingAddress,
        order_items: items
          .map(
            (item: OrderItem) =>
              `${item.quantity}x ${item.name} - $${item.price}`
          )
          .join("\n"),
      },
    };

    console.log("emailData", emailData);

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      }
    );

    if (!response.ok)
      throw new Error(`Failed to send email: ${response.statusText}`);

    return Response.json(
      { success: true, message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ EmailJS Error:", error);
    return Response.json(
      { error: "Failed to send email", details: error },
      { status: 500 }
    );
  }
}
