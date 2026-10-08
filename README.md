# ResQGrid

## Disaster Intelligence & Emergency Response Platform

ResQGrid is a disaster intelligence and emergency response platform designed to help authorities, rescue teams, infrastructure departments, and citizens coordinate before, during, and after disasters.

The platform combines **real-time incident reporting, geographic intelligence, risk assessment, resource coordination, and disaster monitoring** into a single system.

The primary objective is to convert scattered disaster information into actionable intelligence.

---

# 1. Problem Statement

During disasters such as floods, landslides, cyclones, earthquakes, and extreme rainfall, emergency response is often affected by:

- Delayed information from affected areas
- Lack of centralized incident information
- Poor visibility of blocked roads and damaged infrastructure
- Difficulty identifying the most urgent incidents
- Limited coordination between departments
- Lack of reliable information from remote locations
- Difficulty predicting which areas are likely to become high-risk
- Information being distributed across different communication channels

ResQGrid attempts to solve these problems by providing a centralized disaster intelligence platform.

---

# 2. Core Objectives

ResQGrid aims to:

1. Detect and collect disaster-related information.
2. Display incidents geographically on a live map.
3. Prioritize incidents according to severity and urgency.
4. Identify affected villages, roads, bridges, hospitals, and other infrastructure.
5. Allow field officers and citizens to submit reports.
6. Analyze environmental and historical data to estimate disaster risk.
7. Alert authorities and communities when risk levels increase.
8. Help authorities coordinate emergency resources.
9. Maintain historical disaster data for future analysis.
10. Provide a common operational picture during an emergency.

---

# 3. Target Users

## District Administration

District administrators can use ResQGrid to:

- View the overall disaster situation
- Monitor active incidents
- Identify high-priority areas
- Allocate rescue teams and resources
- Monitor road connectivity
- Track response progress

## Disaster Management Authorities

They can:

- Monitor disaster risks
- Track incidents
- Configure alerts
- Analyze historical disaster patterns
- Coordinate multiple departments

## Field / Rescue Teams

Field teams can:

- Report incidents
- Upload photographs and videos
- Report blocked roads
- Report infrastructure damage
- Update incident status
- Provide ground-level information

## Citizens

Citizens can:

- Report disasters
- Submit locations
- Upload photographs
- Receive warnings
- Receive evacuation or safety instructions

## Emergency Services

Police, fire departments, medical services, and other emergency organizations can:

- Identify incident locations
- Prioritize emergencies
- Find affected areas
- Coordinate assistance

## Infrastructure Authorities

Road and infrastructure departments can:

- Monitor damaged roads
- Track blocked routes
- Identify damaged bridges
- Monitor critical infrastructure
- Restore connectivity based on priority

---

# 4. System Architecture

```text
                         ┌─────────────────────┐
                         │      Citizens       │
                         └──────────┬──────────┘
                                    │
                         Incident Reports
                                    │
                                    ▼
┌────────────────┐       ┌─────────────────────┐
│ Field Officers │──────▶│                     │
└────────────────┘       │    ResQGrid API     │
                         │   Node + Express    │
┌────────────────┐       │                     │
│ Emergency      │──────▶│                     │
│ Services       │       └──────────┬──────────┘
└────────────────┘                  │
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
             ┌────────────┐  ┌─────────────┐  ┌─────────────┐
             │ PostgreSQL │  │   PostGIS   │  │ ML / Risk   │
             │ Database   │  │ Geographic  │  │ Assessment  │
             └────────────┘  └─────────────┘  └─────────────┘
                    │               │                │
                    └───────────────┼────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    React Dashboard  │
                         │      + Vite         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Live Disaster Map   │
                         │ Alerts & Analytics  │
                         └─────────────────────┘
```

---

# 5. Technology Stack

## Frontend

- React
- Vite
- JavaScript
- HTML
- CSS
- Mapping library such as Leaflet or MapLibre

The frontend provides dashboards, maps, incident management, alerts, and analytics.

## Backend

- Node.js
- Express.js

The backend provides REST APIs for:

- Authentication
- Incident management
- User management
- Disaster information
- Geographic queries
- Resource management
- Alerts
- Risk information

## Database

- PostgreSQL
- PostGIS

PostGIS enables geographic operations such as:

- Finding incidents within an area
- Finding nearby hospitals
- Finding affected villages
- Calculating distances
- Determining whether roads intersect affected zones
- Spatial filtering and analysis

## Infrastructure

- Docker
- Docker Compose

Docker Compose can be used to run:

```text
Frontend
Backend
PostgreSQL
PostGIS
ML services
```

as separate services.

## Machine Learning

The `ml/` directory contains components for:

- Disaster risk prediction
- Incident prioritization
- Image classification
- Anomaly detection
- Historical disaster analysis

---

# 6. Major Modules

## 6.1 Incident Management

Every disaster-related event is represented as an incident.

Example:

```text
Incident ID: INC-1042
Type: Flood
Location: Village X
Severity: High
Status: Active
Reported By: Field Officer
Time: 14:32
```

Possible incident types:

- Flood
- Landslide
- Earthquake
- Cyclone
- Fire
- Road blockage
- Infrastructure damage
- Building collapse
- Medical emergency
- Missing persons
- Other

### Incident Lifecycle

```text
Reported
   ↓
Verified
   ↓
Assigned
   ↓
Response in Progress
   ↓
Resolved
   ↓
Closed
```

Incidents can also be marked as:

- Unverified
- False report
- Duplicate
- Escalated

---

# 7. Live Disaster Map

The map is one of the primary components of ResQGrid.

The map can display:

- Active incidents
- Disaster zones
- Flooded areas
- Blocked roads
- Damaged infrastructure
- Rescue teams
- Hospitals
- Shelters
- Important government facilities
- Risk zones

Different incident severities can be represented using different visual indicators.

Example:

```text
🔴 Critical
🟠 High
🟡 Medium
🟢 Low
```

Clicking an incident marker should display:

```text
Incident
──────────────
Type: Flood
Severity: Critical
Location: Village X
Reported: 12 min ago
Status: Active

People affected: 320
Roads blocked: 2

[View Details]
[Assign Team]
[Update Status]
```

---

# 8. Incident Prioritization

Not every incident requires the same response.

ResQGrid can calculate an urgency score based on multiple factors.

Example:

```text
Urgency Score =
Severity
+ Population affected
+ Infrastructure importance
+ Accessibility
+ Number of people at risk
+ Time since report
+ Proximity to critical facilities
```

A simplified model could be:

```text
Priority =
0.30 × Severity
+ 0.25 × Population Impact
+ 0.20 × Infrastructure Impact
+ 0.15 × Accessibility Risk
+ 0.10 × Time Factor
```

The exact formula can later be replaced with a machine learning model.

---

# 9. Affected Area Identification

ResQGrid can use geographic data to determine which locations are affected by a disaster.

For example, if a flood zone is detected:

```text
Flood Zone
     │
     ├── Village A
     ├── Village B
     ├── Village C
     ├── Road 17
     ├── Bridge 4
     └── Hospital X
```

PostGIS can perform spatial queries to identify infrastructure and settlements inside or near the affected area.

This allows authorities to understand the actual impact of an incident instead of looking only at the original report location.

---

# 10. Road & Connectivity Intelligence

Road connectivity is particularly important during disasters.

ResQGrid can track:

- Blocked roads
- Flooded roads
- Damaged bridges
- Partially accessible roads
- Alternative routes

Example:

```text
Road A → BLOCKED

Road B → AVAILABLE

Road C → PARTIALLY BLOCKED

Nearest alternative route → Road B
```

Future versions could integrate routing engines to automatically calculate alternative emergency routes.

---

# 11. Field Reporting

Field officers can submit reports directly from the field.

A report may contain:

```text
Incident Type
Location
Description
Severity
Photograph
Video
Timestamp
Reporter
```

Example:

```text
Type:
Road Blockage

Location:
28.XXXX, 77.XXXX

Description:
Road blocked due to fallen trees.

Severity:
High

Photo:
IMG_1042.jpg
```

Once submitted, the report enters the central dashboard.

---

# 12. Citizen Reporting

Citizens can also submit reports.

The citizen interface should remain simple because users may be reporting during an emergency.

Example:

```text
What happened?

[ Flood ]
[ Fire ]
[ Road Blocked ]
[ Building Damage ]
[ Other ]

Location:
[ Use Current Location ]

Photo:
[ Upload ]

Description:
[................]

[ Submit Report ]
```

Citizen reports can initially have an `Unverified` status.

Authorities or field teams can verify them before they influence official response decisions.

---

# 13.
