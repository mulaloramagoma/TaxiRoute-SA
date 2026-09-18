export interface Association {
  id: string;
  name: string;
  contact_phone: string | null;
  contact_email: string | null;
  notes: string | null;
  created_at: string;
}

export interface TaxiRank {
  id: string;
  name: string;
  suburb: string | null;
  city: string | null;
  province: string;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
  created_at: string;
}

export interface Route {
  id: string;
  route_code: string;
  association_id: string | null;
  origin_name: string;
  destination_name: string;
  origin_rank_id: string | null;
  destination_rank_id: string | null;
  route_description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  association?: Association | null;
  origin_rank?: TaxiRank | null;
  destination_rank?: TaxiRank | null;
}

export interface Fare {
  id: string;
  route_id: string;
  fare_zar: number;
  currency: string;
  effective_date: string;
  verification_date: string | null;
  source: string | null;
  source_type: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface RouteWithDetails extends Route {
  association?: Association | null;
  origin_rank?: TaxiRank | null;
  destination_rank?: TaxiRank | null;
  fare?: Fare | null;
}

export interface CommunityReport {
  id: string;
  route_id: string | null;
  reported_fare: number | null;
  report_type: string;
  description: string;
  submitted_at: string;
  status: string;
}

export interface RouteLeg {
  route: RouteWithDetails;
  fare: Fare;
  association: Association | null;
}

export interface ConnectedJourney {
  legs: RouteLeg[];
  totalCost: number;
  transfers: number;
  numberOfLegs: number;
}

export interface SearchResult {
  directRoutes: RouteLeg[];
  connectedJourneys: ConnectedJourney[];
}
