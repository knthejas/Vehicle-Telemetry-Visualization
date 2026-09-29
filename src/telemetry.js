export const initialFleet = [
  { id: "NL-204", name: "Transit Van 204", location: "Market Street, Portland", status: "moving", speed: 48, battery: 82, lat: 45.5231, lon: -122.6765, updatedAt: "Just now", history: [31, 35, 33, 42, 39, 48, 46, 48] },
  { id: "NL-118", name: "Cargo EV 118", location: "SE Hawthorne Blvd, Portland", status: "moving", speed: 36, battery: 64, lat: 45.5124, lon: -122.6228, updatedAt: "Just now", history: [24, 29, 31, 28, 34, 33, 39, 36] },
  { id: "NL-052", name: "Transit Van 052", location: "NW 23rd Avenue, Portland", status: "idle", speed: 0, battery: 91, lat: 45.5306, lon: -122.6982, updatedAt: "1 min ago", history: [22, 18, 12, 7, 2, 0, 0, 0] },
  { id: "NL-331", name: "Cargo EV 331", location: "Burnside Bridge, Portland", status: "alert", speed: 58, battery: 18, lat: 45.5237, lon: -122.6691, updatedAt: "Just now", history: [38, 41, 45, 49, 55, 61, 57, 58] },
  { id: "NL-087", name: "Transit Van 087", location: "Waterfront Park, Portland", status: "moving", speed: 27, battery: 43, lat: 45.5188, lon: -122.6712, updatedAt: "2 min ago", history: [19, 24, 20, 26, 29, 25, 31, 27] },
  { id: "NL-413", name: "Cargo EV 413", location: "Lloyd District, Portland", status: "idle", speed: 0, battery: 12, lat: 45.5312, lon: -122.6573, updatedAt: "1 min ago", history: [14, 10, 6, 3, 0, 0, 0, 0] },
];

export function fleetSummary(fleet) {
  const moving = fleet.filter((vehicle) => vehicle.status === "moving");
  return {
    online: fleet.length,
    moving: moving.length,
    lowBattery: fleet.filter((vehicle) => vehicle.battery < 25).length,
    averageSpeed: moving.length ? Math.round(moving.reduce((sum, vehicle) => sum + vehicle.speed, 0) / moving.length) : 0,
  };
}

export function filterVehicles(fleet, { query = "", filter = "all" } = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  return fleet.filter((vehicle) => {
    const matchesFilter = filter === "all" || vehicle.status === filter;
    const matchesQuery = !normalizedQuery || `${vehicle.id} ${vehicle.name} ${vehicle.location}`.toLowerCase().includes(normalizedQuery);
    return matchesFilter && matchesQuery;
  });
}

export function ingestTelemetry(fleet, packet) {
  if (!packet || typeof packet.id !== "string" || !packet.id.trim()) throw new TypeError("Telemetry packet requires a vehicle id");
  if (!Number.isFinite(packet.speed) || !Number.isFinite(packet.battery) || !Number.isFinite(packet.lat) || !Number.isFinite(packet.lon)) {
    throw new TypeError("Telemetry packet requires numeric speed, battery, latitude, and longitude");
  }
  if (packet.speed < 0 || packet.battery < 0 || packet.battery > 100 || packet.lat < -90 || packet.lat > 90 || packet.lon < -180 || packet.lon > 180) {
    throw new RangeError("Telemetry values are outside valid ranges");
  }
  const exists = fleet.some((vehicle) => vehicle.id === packet.id);
  if (!exists) throw new RangeError(`Unknown vehicle: ${packet.id}`);
  return fleet.map((vehicle) => vehicle.id === packet.id ? {
    ...vehicle,
    ...packet,
    location: packet.location ?? vehicle.location,
    status: packet.status ?? (packet.speed > 0 ? "moving" : "idle"),
    updatedAt: "Just now",
    history: [...vehicle.history.slice(-7), packet.speed],
  } : vehicle);
}