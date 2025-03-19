import { create } from "zustand";

interface LocationState {
  country: string;
  fetchLocation: () => Promise<void>;
}

const useLocationStore = create<LocationState>((set) => ({
  country: "US", // Default to US if not fetched
  fetchLocation: async () => {
    try {
      const response = await fetch("/api/get-location");
      const data = await response.json();
      if (data.country) {
        set({ country: data.country });
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  },
}));

export default useLocationStore;
