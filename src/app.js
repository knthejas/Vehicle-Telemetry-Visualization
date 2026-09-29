import { filterVehicles, fleetSummary, initialFleet, ingestTelemetry } from "./telemetry.js";

let fleet = initialFleet;
let selectedId = fleet[0].id;
let activeFilter = "all";
const list = document.querySelector("#vehicle-list");
const detail = document.querySelector("#detail-panel");
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function renderSummary() {
  const summary = fleetSummary(fleet);
  document.querySelector("#online-count").textContent = summary.online;
  document.querySelector("#moving-count").textContent = String(summary.moving).padStart(2, "0");
  document.querySelector("#battery-count").textContent = String(summary.lowBattery).padStart(2, "0");
  document.querySelector("#average-speed").innerHTML = `${summary.averageSpeed}<small> km/h</small>`;
  document.querySelector("#vehicle-total").textContent = fleet.length;
  document.querySelector("#filter-all").textContent = fleet.length;
}

function renderList() {
  const visible = filterVehicles(fleet, { query: document.querySelector("#search").value, filter: activeFilter });
  list.innerHTML = visible.length ? visible.map((vehicle) => `
    <button class="vehicle-row ${vehicle.id === selectedId ? "selected" : ""}" data-id="${esc(vehicle.id)}" aria-pressed="${vehicle.id === selectedId}">
      <span class="vehicle-symbol">⌖</span><span><span class="vehicle-name">${esc(vehicle.name)} <span style="color:#929a94;font-weight:400">${esc(vehicle.id)}</span></span><span class="vehicle-location">${esc(vehicle.location)}</span></span>
      <span class="row-right"><span class="row-speed">${vehicle.speed} km/h</span><span class="row-state ${vehicle.status === "alert" ? "warning" : ""}">${vehicle.status === "alert" ? "Low battery" : vehicle.status}</span></span>
    </button>`).join("") : '<div class="empty-state">No vehicles match this view.</div>';
  list.querySelectorAll("[data-id]").forEach((button) => button.addEventListener("click", () => { selectedId = button.dataset.id; render(); }));
}

function renderDetail() {
  const vehicle = fleet.find((item) => item.id === selectedId) ?? fleet[0];
  if (!vehicle) { detail.innerHTML = '<div class="empty-state">No telemetry available.</div>'; return; }
  const statusClass = vehicle.status === "alert" ? "alert" : vehicle.status === "idle" ? "idle" : "";
  detail.innerHTML = `
    <div class="detail-top"><div><div class="vehicle-id">VEHICLE / ${esc(vehicle.id)}</div><h2 class="vehicle-title">${esc(vehicle.name)}</h2><div class="location-line">${esc(vehicle.location)}</div></div><span class="status-pill ${statusClass}">${esc(vehicle.status === "alert" ? "Battery alert" : vehicle.status)}</span></div>
    <div class="map-box" aria-label="Map showing vehicle location"><svg viewBox="0 0 600 240" preserveAspectRatio="none" aria-hidden="true"><path d="M-20 60L620 185M-10 190L605 40M120-20L340 260M430-20L200 260" fill="none" stroke="#d4ded0" stroke-width="13"/><path d="M-20 60L620 185M-10 190L605 40M120-20L340 260M430-20L200 260" fill="none" stroke="#f8faf5" stroke-width="8"/><path d="M20 150C170 205 250 22 390 80S520 170 610 80" fill="none" stroke="#87a890" stroke-width="3" stroke-dasharray="7 6"/><path d="M35 120l75 19M400 154l95-19" stroke="#bac9b8" stroke-width="2"/></svg><span class="map-label" style="left:12%;top:18%">PEARL DISTRICT</span><span class="map-label" style="right:8%;top:25%">DOWNTOWN</span><span class="map-label" style="left:38%;bottom:18%">W BURNSIDE ST</span><span class="map-point"><span>•</span></span><span class="map-caption">⌖ &nbsp;${esc(vehicle.location)}</span></div>
    <div class="telemetry-heading"><h3>Speed telemetry</h3><span class="range">LAST 40 MIN &nbsp;⌄</span></div>
    <div class="chart"><svg viewBox="0 0 600 100" preserveAspectRatio="none" aria-label="Vehicle speed trend"><defs><linearGradient id="fade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#70a17d" stop-opacity=".19"/><stop offset="1" stop-color="#70a17d" stop-opacity="0"/></linearGradient></defs><path class="chart-grid" d="M0 25H600M0 55H600M0 85H600"/><polygon class="chart-fill" points="0,100 ${vehicle.history.map((speed, index) => `${(index / (vehicle.history.length - 1)) * 600},${90 - speed}`).join(" ")} 600,100"/><polyline class="chart-line" points="${vehicle.history.map((speed, index) => `${(index / (vehicle.history.length - 1)) * 600},${90 - speed}`).join(" ")}"/></svg></div><div class="chart-labels"><span>10:20</span><span>10:30</span><span>10:40</span><span>10:50</span><span>11:00</span></div>
    <div class="detail-stats"><div class="detail-stat"><span>CURRENT SPEED</span><strong>${vehicle.speed}<small> km/h</small></strong></div><div class="detail-stat"><span>BATTERY LEVEL</span><strong>${vehicle.battery}<small>%</small></strong></div><div class="detail-stat"><span>LAST UPDATE</span><strong style="font-size:12px">${esc(vehicle.updatedAt)}</strong></div></div><div class="gps-row"><span>GPS COORDINATES</span><strong>${vehicle.lat.toFixed(4)}° N &nbsp; ${Math.abs(vehicle.lon).toFixed(4)}° W</strong></div>`;
}

function render() { renderSummary(); renderList(); renderDetail(); }

document.querySelector("#search").addEventListener("input", renderList);
document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach((filter) => filter.classList.toggle("active", filter === button));
  renderList();
}));
document.querySelector("#refresh-button").addEventListener("click", render);
document.querySelector("#export-button").addEventListener("click", () => {
  const csv = ["id,name,location,speed,battery,status,lat,lon", ...fleet.map((v) => [v.id, v.name, v.location, v.speed, v.battery, v.status, v.lat, v.lon].map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))].join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = "northline-fleet.csv";
  link.click();
  URL.revokeObjectURL(link.href);
});
document.querySelector("#today").textContent = new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date());
document.querySelector("#district-date").textContent = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date()).toUpperCase();

window.ingestTelemetry = (packet) => { fleet = ingestTelemetry(fleet, packet); render(); };
render();