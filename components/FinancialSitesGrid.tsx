import React from "react";

const financialBrands = [
  { name: "Chase Bank", logo: "/logos/chase.png", category: "Banks" },
  { name: "Bank of America", logo: "/logos/bofa.png", category: "Banks" },
  { name: "Wells Fargo", logo: "/logos/wellsfargo.png", category: "Banks" },
  {
    name: "Rocket Mortgage",
    logo: "/logos/rocketmortgage.png",
    category: "Mortgage",
  },
  {
    name: "Quicken Loans",
    logo: "/logos/quickenloans.png",
    category: "Mortgage",
  },
  { name: "Fannie Mae", logo: "/logos/fanniemae.png", category: "Mortgage" },
  {
    name: "Goldman Sachs",
    logo: "/logos/goldmansachs.png",
    category: "Financial Services",
  },
  {
    name: "Charles Schwab",
    logo: "/logos/charlesschwab.png",
    category: "Financial Services",
  },
  {
    name: "Fidelity Investments",
    logo: "/logos/fidelity.png",
    category: "Financial Services",
  },
];

const FinancialSitesGrid = () => {
  return (
    <div className="container mx-auto py-6">
      <h2 className="text-xl font-bold text-center mb-4">
        Top Financial Institutions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {financialBrands.map((brand, index) => (
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
            <p className="text-xs text-gray-500">{brand.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialSitesGrid;
