import { NextResponse } from "next/server";
import axios from "axios";
import xml2js from "xml2js";

const CANADA_POST_API_URL = "https://ct.soa-gw.canadapost.ca/rs/ship/price";
const API_USERNAME = "6e93d53968881714"; // Extracted from the provided key
const API_PASSWORD = "0bfa9fcb9853d1f51ee57a"; // Extracted from the provided key
const CUSTOMER_NUMBER = "2004381";
const CONTRACT_ID = "42708517";
const ORIGIN_POSTAL_CODE = "K1A0B1";

// export async function POST(req: Request) {
//     try {
//       const body = await req.json();
//       const { origin, destination, products } = body;

//       // Build the XML for all products
//       let totalWeight = 0;
//       let dimensionsXml = "";

//       products.forEach((product: { weight: number; length: number; width: number; height: number; quantity: number }) => {
//         const productWeight = product.weight * product.quantity;
//         totalWeight += productWeight;

//         dimensionsXml += `
//           <dimensions>
//             <length>${product.length}</length>
//             <width>${product.width}</width>
//             <height>${product.height}</height>
//           </dimensions>
//         `;
//       });

//       const requestBody = `
//         <mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">
//           <customer-number>${CUSTOMER_NUMBER}</customer-number>
//           <contract-id>${CONTRACT_ID}</contract-id>
//           <parcel-characteristics>
//             <weight>${totalWeight}</weight>
//             ${dimensionsXml}
//           </parcel-characteristics>
//           <origin-postal-code>${origin.postalCode}</origin-postal-code>
//           <destination>
//             <domestic>
//               <postal-code>${destination.postalCode}</postal-code>
//             </domestic>
//           </destination>
//         </mailing-scenario>
//       `;

//       const response = await axios.post(CANADA_POST_API_URL, requestBody, {
//         headers: {
//           "Content-Type": "application/vnd.cpc.ship.rate-v4+xml",
//           Accept: "application/vnd.cpc.ship.rate-v4+xml",
//           Authorization: `Basic ${Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64")}`,
//         },
//       });

//       // Parse the response
//       const parsedResponse = await xml2js.parseStringPromise(response.data);

//       // Extract multiple pricing options
//       const priceQuotes = parsedResponse["price-quotes"]["price-quote"];
//       const options = priceQuotes.map((quote: any) => ({
//         service: quote["service-name"][0],
//         price: parseFloat(quote["price-details"][0]["due"][0]),
//         deliveryDate: quote["service-standard"][0]["expected-delivery-date"][0],
//       }));

//       return NextResponse.json({ options });
//     } catch (error) {
//       console.error("Error fetching shipping rate:", error);
//       return NextResponse.json(
//         { error: "Failed to fetch shipping rate from Canada Post API" },
//         { status: 500 }
//       );
//     }
//   }

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destination, products } = body;

    // Validate postal code
    const postalCode = destination?.postalCode;
    if (!postalCode) {
      return NextResponse.json(
        { error: "Postal code is required" },
        { status: 400 }
      );
    }

    // Validate Canadian postal code format
    const canadianPostalCodeRegex = /^[A-Z]\d[A-Z]\d[A-Z]\d$/;
    if (!canadianPostalCodeRegex.test(postalCode)) {
      return NextResponse.json(
        {
          error: "Invalid Canadian postal code format. Expected format: A1B2C3",
        },
        { status: 400 }
      );
    }

    // Validate products
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Products are required and must be a non-empty array" },
        { status: 400 }
      );
    }

    // Initialize total weight and combined dimensions
    let totalWeight = 0;
    let totalLength = 0;
    let totalWidth = 0;
    let totalHeight = 0;

    // Calculate total weight and combined dimensions for all products
    products.forEach(
      (product: {
        weight: number;
        length: number;
        width: number;
        height: number;
        quantity: number;
      }) => {
        const productWeight = product.weight * product.quantity;
        totalWeight += productWeight;

        // Combine dimensions
        totalLength = Math.max(totalLength, product.length) || 1; // Maximum length
        totalWidth += product.width; // Sum of widths
        totalHeight = Math.max(totalHeight, product.height); // Maximum height
      }
    );

    // Ensure minimum values for weight and dimensions
    totalWeight = Math.max(totalWeight, 0.1); // Minimum weight 0.1 kg
    totalLength = Math.max(totalLength, 10); // Minimum length 10 cm
    totalWidth = Math.max(totalWidth, 10); // Minimum width 10 cm
    totalHeight = Math.max(totalHeight, 10); // Minimum height 10 cm

    // Ensure maximum values for weight and dimensions (Canada Post limits)
    totalWeight = Math.min(totalWeight, 30); // Maximum weight 30 kg
    totalLength = Math.min(totalLength, 200); // Maximum length 200 cm
    totalWidth = Math.min(totalWidth, 200); // Maximum width 200 cm
    totalHeight = Math.min(totalHeight, 200); // Maximum height 200 cm

    // Ensure the length + girth is within Canada Post's limits
    // Girth = 2 * (width + height)
    const girth = 2 * (totalWidth + totalHeight);
    const lengthPlusGirth = totalLength + girth;

    // Canada Post's maximum length + girth is 300 cm
    if (lengthPlusGirth > 300) {
      // Scale down dimensions proportionally
      const scaleFactor = 300 / lengthPlusGirth;
      totalLength = Math.floor(totalLength * scaleFactor);
      totalWidth = Math.floor(totalWidth * scaleFactor);
      totalHeight = Math.floor(totalHeight * scaleFactor);
    }

    // Build the XML request body
    const requestBody = `
      <mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">
        <customer-number>${CUSTOMER_NUMBER}</customer-number>
        <contract-id>${CONTRACT_ID}</contract-id>
        <parcel-characteristics>
          <weight>${totalWeight.toFixed(2)}</weight>
          <dimensions>
            <length>${totalLength.toFixed(2)}</length>
            <width>${totalWidth.toFixed(2)}</width>
            <height>${totalHeight.toFixed(2)}</height>
          </dimensions>
        </parcel-characteristics>
        <origin-postal-code>${ORIGIN_POSTAL_CODE}</origin-postal-code>
        <destination>
          <domestic>
            <postal-code>${postalCode}</postal-code>
          </domestic>
        </destination>
      </mailing-scenario>
    `;

    // Send the request to Canada Post API
    const response = await axios.post(CANADA_POST_API_URL, requestBody, {
      headers: {
        "Content-Type": "application/vnd.cpc.ship.rate-v4+xml",
        Accept: "application/vnd.cpc.ship.rate-v4+xml",
        Authorization: `Basic ${Buffer.from(
          `${API_USERNAME}:${API_PASSWORD}`
        ).toString("base64")}`,
      },
    });

    // Parse the response
    const parsedResponse = await xml2js.parseStringPromise(response.data);

    // Check if the response contains price-quotes
    if (
      !parsedResponse["price-quotes"] ||
      !parsedResponse["price-quotes"]["price-quote"]
    ) {
      console.error(
        "Invalid response format from Canada Post API:",
        parsedResponse
      );
      return NextResponse.json(
        { error: "Invalid response format from Canada Post API" },
        { status: 500 }
      );
    }

    // Extract multiple pricing options
    const priceQuotes = parsedResponse["price-quotes"]["price-quote"];

    // Check if priceQuotes is an array and not empty
    if (!Array.isArray(priceQuotes) || priceQuotes.length === 0) {
      console.error("No shipping options available for this destination");
      return NextResponse.json(
        { error: "No shipping options available for this destination" },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options = priceQuotes.map((quote: any) => ({
      service: quote["service-name"][0],
      price: parseFloat(quote["price-details"][0]["due"][0]),
      deliveryDate: quote["service-standard"][0]["expected-delivery-date"][0],
    }));

    return NextResponse.json({ options });
  } catch (error) {
    console.error("Error fetching shipping rate:", error);

    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      let errorMessage = "Canada Post API error";

      // Try to parse XML error response from Canada Post
      if (error.response?.data && typeof error.response.data === "string") {
        try {
          // Parse the XML error response
          const xmlErrorData = await xml2js.parseStringPromise(
            error.response.data
          );

          // Extract error code and description from Canada Post response
          if (xmlErrorData.messages && xmlErrorData.messages.message) {
            const cpError = xmlErrorData.messages.message[0];
            const errorCode = cpError.code ? cpError.code[0] : "Unknown";
            const errorDesc = cpError.description
              ? cpError.description[0]
              : "Unknown error";

            errorMessage = `Canada Post Error (${errorCode}): ${errorDesc}`;

            // Provide more user-friendly messages for common errors
            if (errorCode === "9111") {
              errorMessage =
                "The package dimensions or weight are outside Canada Post's acceptable range. Please check your product specifications.";
            } else if (errorCode === "9012") {
              errorMessage =
                "Invalid postal code format. Please enter a valid Canadian postal code.";
            }
          }
        } catch (xmlError) {
          console.error("Error parsing Canada Post XML error:", xmlError);
          errorMessage =
            typeof error.response.data === "string"
              ? error.response.data
              : JSON.stringify(error.response.data);
        }
      }

      console.error(`Axios error (${statusCode}):`, errorMessage);

      return NextResponse.json(
        {
          error: errorMessage,
          details: error.response?.data,
        },
        { status: statusCode }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: "Failed to fetch shipping rate from Canada Post API",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
