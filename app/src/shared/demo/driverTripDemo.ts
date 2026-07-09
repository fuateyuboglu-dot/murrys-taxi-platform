export const demoPassenger = {
  name: 'Sarah Johnson',
  phoneNumber: '+16135550102',
};

export function formatDemoRouteDuration(durationSeconds: number | undefined, fallback = '4 min') {
  if (!durationSeconds) {
    return fallback;
  }

  const minutes = Math.max(1, Math.round(durationSeconds / 60));

  return `${minutes} min`;
}

export function formatDemoRouteDistance(distanceMeters: number | undefined) {
  if (!distanceMeters) {
    return 'Demo route';
  }

  if (distanceMeters >= 1000) {
    return `${(distanceMeters / 1000).toFixed(1)} km`;
  }

  return `${Math.round(distanceMeters)} m`;
}
