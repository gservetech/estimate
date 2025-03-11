import { create } from "zustand";
import axios from "axios";

interface LocationState {
  country: "CA" | "US";
  fetched: boolean;
  fetchLocation: () => Promise<void>;
}

const useLocationStore = create<LocationState>((set, get) => ({
  country: "CA",
  fetched: false,
  fetchLocation: async () => {
    if (get().fetched) return;

    const response = await axios.get("https://ipinfo.io/json");
    let fetchedCountry = response.data?.country;

    if (!["CA", "US"].includes(fetchedCountry)) {
      fetchedCountry = "CA";
    }

    set({ country: fetchedCountry, fetched: true });
  },
}));

export default useLocationStore;
