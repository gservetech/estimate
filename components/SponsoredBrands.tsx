import React from "react";

const brands = [
  { name: "Amazon", logo: "/amazon-logo.png", sponsored: true },
  { name: "Temu", logo: "/temu-logo.png", sponsored: true },
  { name: "Hotels.com", logo: "/hotels-logo.png", sponsored: true },
  { name: "AppwayDev", logo: "/appway-logo.png", sponsored: false },
  { name: "Portal Azure", logo: "/azure-logo.png", sponsored: false },
  { name: "GServeTech", logo: "/gservetech-logo.png", sponsored: false },
  { name: "ADB", logo: "/adb-logo.png", sponsored: false },
  { name: "Localhost", logo: "/localhost-logo.png", sponsored: false },
];

const SponsoredBrands = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-3 flex flex-col items-center"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="w-12 h-12 object-contain mb-2"
            />
            <p className="text-sm font-semibold">{brand.name}</p>
            {brand.sponsored && (
              <p className="text-xs text-gray-500">Sponsored</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsoredBrands;
