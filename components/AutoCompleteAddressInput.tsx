import { Input } from "@/components/ui/input";
import { MapboxFeature } from "@/types/mapbox_types";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

interface AutoCompleteAddressInputProps {
  address: string;
  handleAddressManualChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setDestination: Dispatch<
    SetStateAction<{
      address: string;
      city: string;
      state: string;
      postalCode: string;
    }>
  >;
}

interface Address {
  postcode: string;
  place: string;
  district: string;
  region: string;
  country: string;
}

const AutoCompleteAddressInput = ({
  address,
  setDestination,
  handleAddressManualChange,
}: AutoCompleteAddressInputProps) => {
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const suggestionComponentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user's location based on IP address
    const getLocationFromIP = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        if (data.country_code) {
          setDestination((prev) => ({
            ...prev,
            country: data.country_code === "CA" ? "Canada" : "United States",
          }));
        }
      } catch (error) {
        console.error("Error getting country from IP:", error);
      }
    };

    getLocationFromIP();
  }, [setDestination]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If click is outside the container, close suggestions
      if (
        suggestionComponentRef.current &&
        !suggestionComponentRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const suggestions = await fetch(`/api/getPlaces?query=${e.target.value}`);
    const data = await suggestions.json();
    if (data) {
      setSuggestions(data.data.features);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleAddressManualChange(e);
    handleInputChange(e).then((r) => r);
  };

  const handleSuggestionClick = (suggestion: MapboxFeature) => {
    console.log(suggestion);

    const streetAndNumber = suggestion.place_name.split(",")[0];

    const address: Address = suggestion.context.reduce((acc, context) => {
      const identifier = context.id.split(".")[0] as keyof Address;
      acc[identifier] = context.text;
      return acc;
    }, {} as Address);

    setDestination({
      address: streetAndNumber,
      city: address.place,
      state: address.region,
      postalCode: address.postcode,
    });

    setSuggestions([]);
  };

  return (
    <div ref={suggestionComponentRef}>
      <p className="text-sm">Shipping Address</p>
      <div className="relative flex items-center justify-center border rounded-md px-3 w-full py-1 bg-white">
        <Input
          type="search"
          placeholder="Search..."
          name="address"
          value={address}
          className="border-none px-0 font-medium text-xs outline-none focus:ring-0 w-full"
          onChange={handleChange}
        />

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute flex flex-col top-full mt-2 w-full bg-white border border-gray-300 rounded right-0 shadow-lg max-h-40 overflow-y-auto z-10">
            {suggestions.map((suggestion, index) => (
              <li
                onClick={() => handleSuggestionClick(suggestion)}
                key={index}
                className="px-4 cursor-pointer py-2 hover:bg-gray-100"
              >
                <span>{suggestion.place_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AutoCompleteAddressInput;
