export interface Recommendation {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  links: {
    yelp?: string;
    tripadvisor?: string;
    official?: string;
  };
  priceLevel?: "$" | "$$" | "$$$" | "$$$$";
  coordinates: {
    lat: number;
    lng: number;
  };
  rating?: number;
}

export type Category = 
  | "Scenic" 
  | "Trendy" 
  | "Viral" 
  | "Historical" 
  | "Culinary" 
  | "Adventure" 
  | "Nightlife"
  | "Local Favorites";

export interface ItineraryItem {
  id: string;
  place: Recommendation;
  timing?: string;
  transportation?: string;
  tips?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  description: string;
  items: ItineraryItem[];
  author: string;
  isPublic: boolean;
  budget?: string;
  rating?: number;
  comments?: { user: string; text: string }[];
}
