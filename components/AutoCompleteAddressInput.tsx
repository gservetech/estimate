import { Input } from "@/components/ui/input";
import { MapboxFeature } from "@/types/mapbox_types";
import { Destination } from "@/types/address.types";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface AutoCompleteAddressInputProps {
  destination: Destination;
  handleAddressManualChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setDestination: React.Dispatch<React.SetStateAction<Destination>>;
}

const AutoCompleteAddressInput = ({
  destination,
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
    try {
      // Only make the API call if there's a value to search for
      if (!e.target.value.trim()) {
        setSuggestions([]);
        return;
      }

      const response = await fetch(
        `/api/getPlaces?query=${encodeURIComponent(e.target.value)}`
      );

      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();

      // Check if data and data.data and data.data.features exist before using them
      if (data && data.data && Array.isArray(data.data.features)) {
        setSuggestions(data.data.features);
      } else {
        console.warn("Invalid response format from API:", data);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleAddressManualChange(e);
    handleInputChange(e).then(() => {});
  };

  const handleSuggestionClick = (suggestion: MapboxFeature) => {
    // Extract street address from the place_name
    const streetAndNumber = suggestion.place_name.split(",")[0];

    // Initialize address object
    const addressComponents = {
      postcode: "",
      place: "",
      region: "",
      country: "",
    };

    // Extract address components from context
    if (suggestion.context && Array.isArray(suggestion.context)) {
      suggestion.context.forEach((context) => {
        const idParts = context.id.split(".");
        if (idParts.length > 0) {
          const type = idParts[0];
          if (type === "postcode") {
            addressComponents.postcode = context.text;
          } else if (type === "place") {
            addressComponents.place = context.text;
          } else if (type === "region") {
            addressComponents.region = context.text;
          } else if (type === "country") {
            addressComponents.country = context.text;
          }
        }
      });
    }

    // If place (city) is not found in context, try to extract it from place_name
    if (!addressComponents.place) {
      const placeNameParts = suggestion.place_name.split(",");
      if (placeNameParts.length > 1) {
        // The city is usually the second part in the place_name
        addressComponents.place = placeNameParts[1].trim();
      }
    }

    // Ensure we have a city
    if (!addressComponents.place && suggestion.place_name.includes(",")) {
      // Try harder to extract city from place_name
      const parts = suggestion.place_name.split(",").map((part) => part.trim());
      if (parts.length >= 2) {
        addressComponents.place = parts[1]; // Second part is usually the city
      }
    }

    // Set the destination with all fields
    setDestination((prev) => ({
      ...prev,
      address: streetAndNumber,
      city: addressComponents.place,
      state: addressComponents.region,
      postalCode: addressComponents.postcode,
    }));

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
          value={destination.address}
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
