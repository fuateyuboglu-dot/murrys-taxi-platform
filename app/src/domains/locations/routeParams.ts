import type { Route } from './types';

export type RouteMetricParams = {
  routeDistanceMeters?: string;
  routeDurationSeconds?: string;
};

function getStringParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function getRouteMetricsFromParams(params: Record<string, string | string[] | undefined>) {
  const distanceMeters = Number(getStringParam(params.routeDistanceMeters));
  const durationSeconds = Number(getStringParam(params.routeDurationSeconds));

  return {
    distanceMeters: Number.isFinite(distanceMeters) && distanceMeters > 0 ? distanceMeters : undefined,
    durationSeconds: Number.isFinite(durationSeconds) && durationSeconds > 0 ? durationSeconds : undefined,
  };
}

export function toRouteMetricParams(route: Route | null): RouteMetricParams {
  if (!route) {
    return {};
  }

  return {
    routeDistanceMeters: String(route.distanceMeters),
    routeDurationSeconds: String(route.durationSeconds),
  };
}
