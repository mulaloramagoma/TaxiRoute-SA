import { supabase } from './supabase';
import type {
  Association,
  TaxiRank,
  Route,
  Fare,
  RouteWithDetails,
  CommunityReport,
  RouteLeg,
  ConnectedJourney,
  SearchResult,
} from '@/types';

const normalize = (s: string): string => s.trim().toLowerCase();

export async function getAssociations(): Promise<Association[]> {
  const { data, error } = await supabase
    .from('associations')
    .select('*')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getTaxiRanks(): Promise<TaxiRank[]> {
  const { data, error } = await supabase
    .from('taxi_ranks')
    .select('*')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getRoutes(): Promise<Route[]> {
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .order('route_code');
  if (error) throw error;
  return data ?? [];
}

export async function getActiveRoutes(): Promise<RouteWithDetails[]> {
  const { data, error } = await supabase
    .from('routes')
    .select(`
      *,
      association:associations(*),
      origin_rank:taxi_ranks!routes_origin_rank_id_fkey(*),
      destination_rank:taxi_ranks!routes_destination_rank_id_fkey(*)
    `)
    .eq('active', true)
    .order('route_code');
  if (error) throw error;
  return data ?? [];
}

export async function getRouteById(routeId: string): Promise<RouteWithDetails | null> {
  const { data, error } = await supabase
    .from('routes')
    .select(`
      *,
      association:associations(*),
      origin_rank:taxi_ranks!routes_origin_rank_id_fkey(*),
      destination_rank:taxi_ranks!routes_destination_rank_id_fkey(*)
    `)
    .eq('id', routeId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getFareForRoute(routeId: string): Promise<Fare | null> {
  const { data, error } = await supabase
    .from('fare_history')
    .select('*')
    .eq('route_id', routeId)
    .eq('status', 'published')
    .order('effective_date', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getFaresForRoutes(routeIds: string[]): Promise<Map<string, Fare>> {
  if (routeIds.length === 0) return new Map();
  const { data, error } = await supabase
    .from('fare_history')
    .select('*')
    .in('route_id', routeIds)
    .eq('status', 'published')
    .order('effective_date', { ascending: false });
  if (error) throw error;

  const map = new Map<string, Fare>();
  for (const fare of data ?? []) {
    if (!map.has(fare.route_id)) {
      map.set(fare.route_id, fare);
    }
  }
  return map;
}

export async function getAllLocations(): Promise<string[]> {
  const routes = await getActiveRoutes();
  const locations = new Set<string>();
  for (const r of routes) {
    locations.add(r.origin_name);
    locations.add(r.destination_name);
  }
  return Array.from(locations).sort((a, b) => a.localeCompare(b));
}

export async function searchDirectRoutes(
  origin: string,
  destination: string
): Promise<RouteLeg[]> {
  const routes = await getActiveRoutes();
  const routeIds = routes.map((r) => r.id);
  const fareMap = await getFaresForRoutes(routeIds);

  const originNorm = normalize(origin);
  const destNorm = normalize(destination);

  return routes
    .filter(
      (r) =>
        normalize(r.origin_name) === originNorm &&
        normalize(r.destination_name) === destNorm
    )
    .map((r) => {
      const fare = fareMap.get(r.id);
      if (!fare) return null;
      return {
        route: r,
        fare,
        association: r.association ?? null,
      } as RouteLeg;
    })
    .filter((leg): leg is RouteLeg => leg !== null);
}

export async function findConnectedJourneys(
  origin: string,
  destination: string
): Promise<ConnectedJourney[]> {
  const routes = await getActiveRoutes();
  const routeIds = routes.map((r) => r.id);
  const fareMap = await getFaresForRoutes(routeIds);

  const originNorm = normalize(origin);
  const destNorm = normalize(destination);

  const graph = new Map<string, RouteWithDetails[]>();
  for (const r of routes) {
    const key = normalize(r.origin_name);
    if (!graph.has(key)) graph.set(key, []);
    graph.get(key)!.push(r);
  }

  const results: ConnectedJourney[] = [];
  const seenJourneys = new Set<string>();
  const MAX_LEGS = 3;

  function dfs(
    currentLocation: string,
    target: string,
    path: RouteWithDetails[],
    visitedRoutes: Set<string>
  ): void {
    if (path.length >= MAX_LEGS) return;

    const edges = graph.get(currentLocation);
    if (!edges) return;

    for (const edge of edges) {
      if (visitedRoutes.has(edge.id)) continue;

      const nextLocation = normalize(edge.destination_name);
      const newPath = [...path, edge];
      const newVisited = new Set(visitedRoutes);
      newVisited.add(edge.id);

      if (nextLocation === target && newPath.length >= 2) {
        const journeyKey = newPath.map((r) => r.route_code).join(' → ');
        if (seenJourneys.has(journeyKey)) continue;
        seenJourneys.add(journeyKey);

        const legs: RouteLeg[] = [];
        let valid = true;
        let totalCost = 0;

        for (const r of newPath) {
          const fare = fareMap.get(r.id);
          if (!fare) {
            valid = false;
            break;
          }
          totalCost += Number(fare.fare_zar);
          legs.push({
            route: r,
            fare,
            association: r.association ?? null,
          });
        }

        if (valid && legs.length >= 2) {
          results.push({
            legs,
            totalCost,
            transfers: legs.length - 1,
            numberOfLegs: legs.length,
          });
        }
        continue;
      }

      dfs(nextLocation, target, newPath, newVisited);
    }
  }

  dfs(originNorm, destNorm, [], new Set());

  results.sort((a, b) => {
    if (a.transfers !== b.transfers) return a.transfers - b.transfers;
    return a.totalCost - b.totalCost;
  });

  return results;
}

export async function searchJourneys(
  origin: string,
  destination: string
): Promise<SearchResult> {
  const [directRoutes, connectedJourneys] = await Promise.all([
    searchDirectRoutes(origin, destination),
    findConnectedJourneys(origin, destination),
  ]);

  return { directRoutes, connectedJourneys };
}

export async function submitCommunityReport(
  report: Omit<CommunityReport, 'id' | 'submitted_at' | 'status'>
): Promise<void> {
  const { error } = await supabase.from('community_reports').insert({
    route_id: report.route_id,
    reported_fare: report.reported_fare,
    report_type: report.report_type,
    description: report.description,
    status: 'pending',
  });
  if (error) throw error;
}
