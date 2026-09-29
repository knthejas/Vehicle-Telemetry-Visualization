# Test Cases

| ID | Scenario | Expected result |
|---|---|---|
| TC-01 | Load dashboard | Fleet summary, vehicle list, map panel, speed trend, and selected vehicle render. |
| TC-02 | Search by vehicle ID, name, or location | List narrows case-insensitively; unmatched text shows the empty state. |
| TC-03 | Choose Moving, Idle, or Alert | Only vehicles in the chosen state remain; All restores the fleet. |
| TC-04 | Select a vehicle | Detail panel updates location, coordinates, battery, speed, status, and trend. |
| TC-05 | Ingest valid telemetry | Matching vehicle values and speed history update; summary recalculates. |
| TC-06 | Ingest invalid telemetry or unknown ID | Input is rejected without modifying fleet data. |
| TC-07 | Export report | A CSV file downloads with fleet telemetry rows. |
| TC-08 | Use narrow viewport | Navigation, summary metrics, list, and details stack without horizontal overflow. |
| TC-09 | Summarize an empty fleet | Counts and average speed are all zero. |
| TC-10 | Search with whitespace only | Search normalization treats it as an empty query and returns all vehicles. |
| TC-11 | Ingest boundary telemetry | Battery at 0% and GPS at valid coordinate extremes are accepted. |

Run automated data tests with `npm test`.