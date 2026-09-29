# Design Brief

## Product
Northline Fleet is an at-a-glance operations console for dispatchers monitoring vehicle health and movement.

## Visual direction
- Calm field-operations palette: graphite navigation, soft mineral canvas, leaf-green live state, and restrained amber/coral alerts.
- Manrope headings, DM Sans interface text, and DM Mono telemetry labels.
- Dense, scan-friendly layout: summary strip above a searchable fleet list and a selected vehicle detail view.
- Small radii, fine dividers, generous whitespace, and a faint survey-grid canvas texture.
- Metric cards use restrained status-color rules; subtle lift and entrance motion reinforce focus without competing with telemetry.
- Reduced-motion preferences disable transitions and entrance effects.
- No decorative hero or dashboard clutter; the schematic map remains the primary visual element.

## Interaction
- Search across ID, vehicle name, and reported location; filter by moving, idle, or alert.
- Selecting a vehicle synchronizes its health, GPS coordinates, route map, and speed trend.
- Refresh redraws the current view; Export downloads fleet state as CSV.
- `window.ingestTelemetry(packet)` accepts an update containing `id`, `speed`, `battery`, `lat`, and `lon`; `location` and `status` are optional.

## Responsive behavior
At tablet widths, retain the sidebar and compress the two-column workspace. Below 780px, collapse navigation to a compact brand bar and stack fleet and vehicle details.

## Prototype boundary
The included Portland fleet is sample data and the map is a stylized schematic, not a live map service. Telemetry ingestion is in-memory; connect the exposed function to a trusted API or stream for production use.