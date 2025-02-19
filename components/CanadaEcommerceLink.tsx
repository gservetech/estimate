import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Store {
  name: string;
  url: string;
  logo: string;
}

const CanadaEcommerceLink = ({ own }: { own: boolean }) => {
  const [stores, setStores] = useState<Store[] | null>(null); // Null by default to detect loading state

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("/Canada.json");
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error("Failed to fetch store data:", error);
      }
    };

    fetchStores();
  }, []);

  // 🔹 Prevent collapsing: Only render if `own` is true AND stores are loaded
  if (!own || !stores) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      {stores.map((store) => (
        <Link key={store.url} href={store.url} target="_blank" rel="noopener noreferrer">
          <div className="border w-full p-2 rounded-md hover:shadow-md transition bg-white">
            <img className="w-full h-8 mb-2 object-contain" src={store.logo} alt={store.name} />
            <p className="text-center font-semibold text-sm">{store.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CanadaEcommerceLink;
