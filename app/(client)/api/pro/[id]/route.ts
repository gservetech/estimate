import path from "path";
import * as fs from "node:fs";
import { Product } from "@/types/product.types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("Fetching product by id");

    const { id } = await params;

    const filePath = path.join(process.cwd(), "public", "products.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const products: Product[] = JSON.parse(jsonData);

    // Find product by id
    const product = products.find((product) => product.id === Number(id));

    if (!product) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
