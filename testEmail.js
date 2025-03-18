import axios from "axios";
import * as dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Fake data to simulate an order
const fakeData = {
  email: "mohamedzibras2015@gmail.com", // Use your actual test email
  orderNumber: "TEST-" + Date.now(), // Generate unique order number
  orderDate: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  items: [
    {
      quantity: 2,
      name: "Bluetooth Headphones",
      price: 49.99,
    },
    {
      quantity: 1,
      name: "USB-C Charger",
      price: 19.99,
    },
  ],
  total: "119.97",
  customerName: "Test Customer",
  shippingAddress: "123 Test St\nTest City, ON\nA1B 2C3\nCA",
};

// Function to test the API
async function testEmailSend() {
  try {
    console.log(
      "Sending test email with data:",
      JSON.stringify(fakeData, null, 2)
    );

    // Use your Next.js API endpoint instead of directly calling EmailJS
    const response = await axios.post(
      "http://localhost:3000/api/sendEmail",
      fakeData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Success! Response:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("❌ Error Response:", error.response.data);
      console.error("Status:", error.response.status);
    }
    console.error("❌ Full error:", error.message);
  }
}

// Run the test
console.log("Starting email test...");
testEmailSend();
