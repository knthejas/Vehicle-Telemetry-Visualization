import test from "node:test";
import assert from "node:assert/strict";
import { filterVehicles, fleetSummary, initialFleet, ingestTelemetry } from "../src/telemetry.js";

test("fleet summary counts online, moving, low battery, and average speed", () => {
  assert.deepEqual(fleetSummary(initialFleet), { online: 6, moving: 3, lowBattery: 2, averageSpeed: 37 });
});

test("empty fleet summary returns zero counts and average speed", () => {
  assert.deepEqual(fleetSummary([]), { online: 0, moving: 0, lowBattery: 0, averageSpeed: 0 });
});

test("vehicle filtering matches status and case-insensitive search", () => {
  assert.deepEqual(filterVehicles(initialFleet, { filter: "moving", query: "PORTLAND" }).map((vehicle) => vehicle.id), ["NL-204", "NL-118", "NL-087"]);
  assert.deepEqual(filterVehicles(initialFleet, { query: "331" }).map((vehicle) => vehicle.id), ["NL-331"]);
});

test("whitespace-only search leaves all vehicles visible", () => {
  assert.deepEqual(filterVehicles(initialFleet, { query: "   " }), initialFleet);
});

test("telemetry ingestion updates a vehicle and appends speed history", () => {
  const updated = ingestTelemetry(initialFleet, { id: "NL-204", speed: 51, battery: 80, lat: 45.52, lon: -122.67 });
  assert.equal(updated[0].speed, 51);
  assert.equal(updated[0].history.at(-1), 51);
  assert.equal(updated[0].status, "moving");
  assert.equal(initialFleet[0].speed, 48);
});

test("telemetry ingestion accepts inclusive battery and GPS boundaries", () => {
  const updated = ingestTelemetry(initialFleet, { id: "NL-204", speed: 0, battery: 0, lat: -90, lon: 180 });
  assert.equal(updated[0].battery, 0);
  assert.equal(updated[0].lat, -90);
  assert.equal(updated[0].lon, 180);
  assert.equal(updated[0].status, "idle");
});

test("telemetry ingestion rejects invalid values and unknown vehicles", () => {
  assert.throws(() => ingestTelemetry(initialFleet, { id: "NL-204", speed: -1, battery: 50, lat: 45, lon: -122 }), RangeError);
  assert.throws(() => ingestTelemetry(initialFleet, { id: "MISSING", speed: 1, battery: 50, lat: 45, lon: -122 }), /Unknown vehicle/);
});