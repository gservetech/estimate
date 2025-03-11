import Container from "@/components/Container";
import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/types/product.types";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) => {
  const { query } = await searchParams;
  const products: Product[] = {
    // @ts-expect-error - todo
    id: 1,
    name: "Product Name",
    images: [],
    description: ["Product Description"],
    price: 100,
    discount: 10,
    category_id: 1,
    stock: 10,
    weight: 1,
    height: 1,
    width: 1,
    label: "Product Label",
    status_id: 1,
    created_at: new Date(),
  };

  if (!products) {
    return (
      <div className="flex flex-col items-center justify-normal min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl text-center">
          <h1 className="text-3xl font-bold mb-3">
            No products found for:{" "}
            <span className="text-darkBlue">{query}</span>
          </h1>
          <p className="text-gray-600">Try searching with different keywords</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100">
      <Container className="p-8 bg-white rounded-lg shadow-md mt-3">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Search results for <span className="text-darkBlue">{query}</span>
        </h1>
        <ProductGrid products={products} />
      </Container>
    </div>
  );
};

export default SearchPage;
