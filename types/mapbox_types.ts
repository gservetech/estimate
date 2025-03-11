export type MapboxFeature = {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: {
    accuracy: string;
    address: string;
    category: string;
    landmark: boolean;
    maki: string;
    wikidata: string;
  };
  text: string;
  place_name: string;
  center: number[];
  geometry: {
    type: string;
    coordinates: number[];
  };
  context: {
    id: string;
    wikidata: string;
    short_code: string;
    text: string;
  }[];
  matching_text: string;
  matching_place_name: string;
};
