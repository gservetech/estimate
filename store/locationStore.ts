import { create } from "zustand";
import axios from "axios";

interface LocationState {
  country: "CA" | "US";
  fetched: boolean;
  fetchLocation: () => Promise<void>;
}

const useLocationStore = create<LocationState>((set, get) => ({
  country: "CA", // Default to CA
  fetched: false,

  fetchLocation: async () => {
    if (get().fetched) return; // Prevent multiple API calls

    // Force "CA" if running on localhost
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      console.log("Running on localhost: Forcing country to CA");
      set({ country: "CA", fetched: true });
      return;
    }

    try {
      const response = await axios.get("https://ipinfo.io/json");
      let fetchedCountry = response.data?.country;

      if (!["CA", "US"].includes(fetchedCountry)) {
        fetchedCountry = "CA"; // Default to CA if unknown
      }

      console.log("Fetched Country from IP:", fetchedCountry);
      set({ country: fetchedCountry, fetched: true });
    } catch (error) {
      console.error("Failed to fetch location:", error);
      set({ country: "CA", fetched: true }); // Default to CA if API fails
    }
  },
}));

export default useLocationStore;
