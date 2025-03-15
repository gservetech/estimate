"use client";
import AutoCompleteAddressInput from "@/components/AutoCompleteAddressInput";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import Loader from "@/components/Loader";
import NoAccessToCart from "@/components/NoAccessToCart";
import { PayPalButton } from "@/components/PayPalButton";
import PayPalProvider from "@/components/PayPalProvider";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  citiesByState,
  provincesByCountry,
  statesByCountry,
} from "@/data/states";
import useCartStore from "@/store";
import useLocationStore from "@/store/locationStore";
import { useAuth } from "@clerk/nextjs";
import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CartProducts {
  weight: number;
  length: number;
  width: number;
  height: number;
  quantity: number;
}

// Initiate address state
const INITIATE_ADDRESS = {
  address: "",
  city: "",
  state: "",
  postalCode: "",
};

interface ShippingOption {
  service: string;
  price: number;
}

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const groupedItems = useCartStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const [showShipping, setShowShipping] = useState(1);
  const [destination, setDestination] = useState(INITIATE_ADDRESS);
  const [cities, setCities] = useState<{ id: number; city_name: string }[]>([]);
  const [shippingCostList, setShippingCostList] = useState<ShippingOption[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<number>();
  const { country } = useLocationStore();

  const [, setSelectedShippingCharge] = useState<number>();
  const staticOrigin = {
    postalCode: "K1A0B1", // Replace it with your origin postal code
    countryCode: "CA", // Country code for Canada
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (destination.state) {
      // Fetch cities for the selected state/province
      const isCanada = country === "CA";
      const filteredCities = citiesByState.filter((city) => {
        if (isCanada) {
          return (
            city.province?.province_name === destination.state &&
            city.country?.id === 2
          );
        } else {
          return (
            city.state?.state_name === destination.state &&
            city.country?.id === 1
          );
        }
      });

      // Set the filtered cities
      setCities(filteredCities);
      console.log("Set filtered cities:", filteredCities);
    }
  }, [destination.state, country]);

  // Add this useEffect for debugging
  useEffect(() => {
    if (isClient) {
      console.log("Current destination:", destination);
      console.log("Current cities list:", cities);
    }
  }, [destination, cities, isClient]);

  if (!isClient) {
    return <Loader />;
  }

  const handleResetCart = () => {
    const confirmed = window.confirm("Are you sure to reset your Cart?");
    if (confirmed) {
      resetCart();
      toast.success("Your cart reset successfully!");
    }
  };

  const handleAddressManualChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDestination({
      ...destination,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteProduct = (id: number | string) => {
    deleteCartProduct(typeof id === "number" ? id : parseInt(id, 10));
    toast.success("Product deleted successfully!");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setShippingCostList([]);

    if (!destination.postalCode) {
      setError("Please enter a destination postal code.");
      setLoading(false);
      return;
    }

    // Validate postal code format
    const postalCode = destination.postalCode.toUpperCase().replace(/\s/g, "");
    const canadianPostalCodeRegex = /^[A-Z]\d[A-Z]\d[A-Z]\d$/;

    if (country === "CA" && !canadianPostalCodeRegex.test(postalCode)) {
      setError("Please enter a valid Canadian postal code (e.g., A1B2C3).");
      setLoading(false);
      return;
    }

    try {
      const newArray: CartProducts[] = groupedItems.map((item) => ({
        weight: item.product.weight || 0,
        width: item.product.width || 0,
        length: 0,
        height: item.product.height || 0,
        quantity: item.quantity || 0,
      }));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/shipping`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            origin: staticOrigin,
            destination: {
              postalCode: postalCode,
            },
            products: newArray,
          }),
        }
      );

      const response = await res.json();

      // Check if the response contains an error
      if (!res.ok || response.error) {
        const errorMessage =
          response.error || "Failed to calculate shipping cost.";
        console.error("Shipping API error:", errorMessage);
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Check if options exist and are not empty
      if (
        !response.options ||
        !Array.isArray(response.options) ||
        response.options.length === 0
      ) {
        setError("No shipping options available for this destination.");
        setLoading(false);
        return;
      }

      setShippingCostList([...response.options]);
      setSelectedShippingCharge(response.options[0].price);
      setSelectedService(
        response.options[0].price + useCartStore?.getState().getTotalPrice()
      );
      setShowShipping(3);
    } catch (err) {
      console.error("Error calculating shipping:", err);
      setError("Failed to calculate shipping cost. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PayPalProvider>
      <div className="bg-gray-50 pb-10" suppressHydrationWarning={true}>
        {isSignedIn ? (
          <Container>
            {groupedItems?.length ? (
              <>
                <div className="flex items-center gap-2 py-5">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-semibold">Shopping Cart</h1>
                </div>
                <div className="flex flex-col-reverse gap-5  lg:grid lg:grid-cols-3  md:gap-8">
                  {/* --------------------------- Step 1 --------------------------- */}
                  {showShipping === 1 && (
                    <div className="lg:col-span-1  ">
                      <div className="w-full bg-white p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">
                          Order Summary
                        </h2>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span>SubTotal</span>
                            <PriceFormatter amount={getSubTotalPrice()} />
                          </div>
                          <div className="flex justify-between">
                            <span>Discount</span>
                            <PriceFormatter
                              amount={getSubTotalPrice() - getTotalPrice()}
                            />
                          </div>

                          <Separator />
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>

                            <PriceFormatter
                              amount={useCartStore?.getState().getTotalPrice()}
                              className="text-lg font-bold text-black"
                            />
                          </div>
                          <Button
                            onClick={() => {
                              setShowShipping(2);
                            }}
                            disabled={loading}
                            className="w-full"
                            size="lg"
                          >
                            Next
                          </Button>
                          <Link
                            href="/"
                            className="block text-center text-sm text-primary hover:underline"
                          >
                            Continue Shopping
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --------------------------- Step 2 --------------------------- */}
                  {showShipping === 2 && (
                    <div className="lg:col-span-1">
                      <div className=" w-full bg-white p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">
                          Shipping Details
                        </h2>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                          }}
                          className="space-y-2"
                        >
                          <AutoCompleteAddressInput
                            address={destination.address}
                            handleAddressManualChange={
                              handleAddressManualChange
                            }
                            setDestination={setDestination}
                          />

                          <div>
                            <p className="text-sm">City</p>
                            {destination.city &&
                            !cities.some(
                              (city) => city.city_name === destination.city
                            ) ? (
                              <input
                                type="text"
                                value={destination.city}
                                disabled
                                className="border rounded-md px-3 w-full py-2 bg-gray-100"
                              />
                            ) : (
                              <Select
                                value={destination.city || ""}
                                onValueChange={(value) => {
                                  setDestination((prev) => ({
                                    ...prev,
                                    city: value,
                                  }));
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                  {cities.map((city) => (
                                    <SelectItem
                                      key={city.id}
                                      value={city.city_name}
                                    >
                                      {city.city_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                          <div>
                            <p className="text-sm">
                              {country === "CA" ? "Province" : "State"}
                            </p>
                            <Select
                              value={destination.state}
                              onValueChange={(value) => {
                                setDestination((prev) => ({
                                  ...prev,
                                  state: value,
                                  city: "",
                                }));

                                // Fetch cities for the selected state/province
                                const isCanada = country === "CA";
                                const filteredCities = citiesByState.filter(
                                  (city) => {
                                    if (isCanada) {
                                      return (
                                        city.province?.province_name ===
                                          value && city.country?.id === 2
                                      );
                                    } else {
                                      return (
                                        city.state?.state_name === value &&
                                        city.country?.id === 1
                                      );
                                    }
                                  }
                                );

                                setCities(filteredCities);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={`Select ${
                                    country === "CA" ? "Province" : "State"
                                  }`}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {country === "CA"
                                  ? provincesByCountry.map((province) => (
                                      <SelectItem
                                        key={province.id}
                                        value={province.province_name}
                                      >
                                        {province.province_name}
                                      </SelectItem>
                                    ))
                                  : statesByCountry
                                      .filter((state) => state.country_id === 1)
                                      .map((state) => (
                                        <SelectItem
                                          key={state.id}
                                          value={state.state_name}
                                        >
                                          {state.state_name}
                                        </SelectItem>
                                      ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <p className="text-sm">Zip / Postal Code</p>
                            <input
                              value={destination.postalCode}
                              name={"postalCode"}
                              onChange={(e) => handleAddressManualChange(e)}
                              type="text"
                              required
                              className=" border rounded-md px-3 w-full py-2"
                            />
                          </div>
                          <div>
                            <p className="text-sm">Country</p>
                            <div className=" border rounded-md px-3 w-full py-2">
                              {country === "CA" ? "Canada" : "United States"}
                            </div>
                          </div>

                          {/*<Map onAddressSelect={undefined}/>*/}

                          <Separator />

                          {error && (
                            <div
                              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
                              role="alert"
                            >
                              <strong className="font-bold">Error: </strong>
                              <span className="block sm:inline">{error}</span>
                            </div>
                          )}

                          <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                            size="lg"
                          >
                            {loading ? "Processing..." : "Next"}
                          </Button>
                          <div className="flex items-center justify-between">
                            <Button
                              onClick={() => setShowShipping(1)}
                              type="button"
                              variant="destructive"
                              size="lg"
                            >
                              Back
                            </Button>
                            <Link
                              href="/"
                              className="block text-center text-sm text-primary hover:underline"
                            >
                              Continue Shopping
                            </Link>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* --------------------------- Step 3 --------------------------- */}
                  {showShipping === 3 && (
                    <div className="lg:col-span-1">
                      <div className=" w-full bg-white p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">
                          Shipping Options
                        </h2>
                        <form className="space-y-2">
                          <div>
                            <p className="text-sm pb-1">Parcel Type</p>
                            <select
                              className=" border rounded-md px-3 w-full py-2"
                              name=""
                              id=""
                              onChange={(e) => {
                                setSelectedShippingCharge(
                                  parseFloat(e.target.value)
                                );
                                setSelectedService(
                                  parseFloat(e.target.value) +
                                    useCartStore?.getState().getTotalPrice()
                                );
                              }}
                            >
                              {shippingCostList?.map(
                                (item: ShippingOption, ind: number) => (
                                  <option key={ind} value={item?.price}>
                                    {item?.service} -{" "}
                                    <PriceFormatter
                                      amount={
                                        item?.price
                                        // useCartStore?.getState().getTotalPrice()
                                      }
                                      className="text-lg font-bold text-black"
                                    />
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          <Separator />
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>

                            <PriceFormatter
                              amount={selectedService}
                              className="text-lg font-bold text-black"
                            />
                          </div>

                          {/*<Button*/}
                          {/*    type="submit"*/}
                          {/*    onClick={() => handleCheckout()}*/}
                          {/*    disabled={loading}*/}
                          {/*    className="w-full"*/}
                          {/*    size="lg"*/}
                          {/*>*/}
                          {/*    {loading*/}
                          {/*        ? "Processing checkout..."*/}
                          {/*        : "Proceed to checkout"}*/}
                          {/*</Button>*/}

                          <PayPalButton amount={String(selectedService)} />

                          <div className="flex items-center justify-between">
                            <Button
                              onClick={() => setShowShipping(2)}
                              type="button"
                              variant="destructive"
                              size="lg"
                            >
                              Back
                            </Button>
                            <Link
                              href="/"
                              className="block text-center text-sm text-primary hover:underline"
                            >
                              Continue Shopping
                            </Link>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  {/* Product View start */}
                  <div className="lg:col-span-2 rounded-lg relative">
                    {showShipping === 3 && (
                      <div className=" absolute top-0 left-0 w-full h-full z-20 bg-white bg-opacity-50"></div>
                    )}
                    <div className="grid grid-cols-5 md:grid-cols-6 border rounded-tr-lg rounded-tl-lg bg-white p-2.5 text-base font-semibold">
                      <h2 className="col-span-2 md:col-span-3">Product</h2>
                      <h2>Price</h2>
                      <h2>Quantity</h2>
                      <h2>Total</h2>
                    </div>
                    <div className="border bg-white border-t-0 rounded-br-lg rounded-bl-lg">
                      {groupedItems?.map(({ product }) => {
                        const itemCount = getItemCount(product?.id);
                        return (
                          <div
                            key={product?.id}
                            className="grid grid-cols-5 md:grid-cols-6 border-b p-2.5 last:border-b-0"
                          >
                            <div className="col-span-2 md:col-span-3 flex items-center">
                              <Trash2
                                onClick={() => handleDeleteProduct(product?.id)}
                                className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                              />
                              {product?.images[0] && (
                                <div className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group">
                                  <Image
                                    src={product.images[0]}
                                    alt="productImage"
                                    width={300}
                                    height={300}
                                    loading="lazy"
                                    className="w-10 h-10 md:w-full md:h-14 object-cover group-hover:scale-105 overflow-hidden transition-transform duration-500"
                                  />
                                </div>
                              )}
                              <h2 className="text-sm">{product?.name}</h2>
                            </div>
                            <div className="flex items-center">
                              <PriceFormatter amount={product?.price} />
                            </div>
                            <QuantityButtons
                              product={product}
                              className="text-sm gap-0 md:gap-1"
                            />
                            <div className="flex items-center">
                              <PriceFormatter
                                amount={
                                  product?.price ? product.price * itemCount : 0
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                      <Button
                        onClick={handleResetCart}
                        className="m-5 font-semibold"
                        variant="destructive"
                      >
                        Reset Cart
                      </Button>
                    </div>
                  </div>

                  {/* Product View end */}
                </div>
              </>
            ) : (
              <EmptyCart />
            )}
          </Container>
        ) : (
          <NoAccessToCart />
        )}
      </div>
    </PayPalProvider>
  );
};

export default CartPage;
