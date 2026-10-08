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

# 13. Verification System

Citizen-generated information should not automatically be treated as verified information.

A report can move through:

```text
Citizen Report
      ↓
Automated Validation
      ↓
Authority Review
      ↓
Field Verification
      ↓
Verified Incident
```

Verification can consider:

- Multiple reports from the same area
- Uploaded media
- Reporter history
- Nearby official reports
- Field officer confirmation
- Sensor or weather data

---

# 14. Risk Prediction

ResQGrid can estimate disaster risk before a disaster occurs.

Potential inputs include:

- Rainfall
- Temperature
- Terrain
- Elevation
- Soil type
- River proximity
- Historical disasters
- Drainage characteristics
- Land use
- Population density
- Previous flooding
- Infrastructure condition

Example:

```text
                Environmental Data
                       │
                       ▼
              ┌─────────────────┐
              │ Risk Assessment │
              │     Model       │
              └────────┬────────┘
                       │
                       ▼
                 Risk Score
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
         Low         Medium        High
```

---

# 15. Risk Levels

An area can receive a risk score between 0 and 100.

```text
0–25     Low
26–50    Moderate
51–75    High
76–100   Critical
```

Example:

```text
Village A

Flood Risk: 82
Landslide Risk: 21

Overall Risk: CRITICAL
```

The thresholds should be configurable rather than hard-coded.

---

# 16. Alert System

When risk crosses a predefined threshold, ResQGrid can generate alerts.

Example:

```text
⚠ HIGH FLOOD RISK

Village: XYZ
Risk Score: 81

Expected heavy rainfall may increase
flooding risk over the next 12 hours.

Recommended Action:
Prepare evacuation resources.
Monitor river levels.
```

Alerts can potentially be delivered through:

- Dashboard notifications
- SMS
- Email
- Push notifications
- Public warning systems

The first version can implement dashboard alerts before adding external notification providers.

---

# 17. Resource Management

Authorities can track emergency resources.

Examples:

- Rescue teams
- Ambulances
- Boats
- Medical supplies
- Food
- Water
- Temporary shelters
- Vehicles
- Equipment

Example:

```text
Resource: Rescue Boat
Quantity: 8

Available: 5
Deployed: 3
```

Resources can be associated with locations and incidents.

---

# 18. Rescue Team Assignment

An authority can assign a team to an incident.

Example:

```text
Incident:
Flood in Village A

Priority:
Critical

Required:
Rescue Team
Boat
Ambulance

Available Team:
Team 07

Distance:
4.2 km

[Assign Team]
```

The system can later recommend teams based on:

- Distance
- Availability
- Equipment
- Current workload
- Incident requirements

---

# 19. Dashboard

The central dashboard should provide a common operational picture.

Possible dashboard layout:

```text
┌──────────────────────────────────────────────┐
│ RESQGRID                     🚨 ALERTS: 4    │
├──────────────────────────────────────────────┤
│                                              │
│  ACTIVE INCIDENTS       MAP                  │
│  ───────────────        ┌───────────────┐   │
│  Critical: 8             │               │   │
│  High: 17                │   LIVE MAP    │   │
│  Medium: 31              │               │   │
│  Low: 12                 └───────────────┘   │
│                                              │
├──────────────────────────────────────────────┤
│ Affected Villages │ Roads Blocked │ Teams    │
│       24          │      18        │   32     │
└──────────────────────────────────────────────┘
```

---

# 20. Suggested Database Structure

## Users

```text
users
-----
id
name
email
phone
role
organization_id
created_at
```

## Organizations

```text
organizations
-------------
id
name
type
district
created_at
```

## Incidents

```text
incidents
---------
id
type
title
description
severity
status
location
reported_by
verified_by
created_at
updated_at
```

`location` can use a PostGIS geographic point.

---

## Incident Media

```text
incident_media
--------------
id
incident_id
media_type
file_url
uploaded_by
created_at
```

---

## Resources

```text
resources
---------
id
name
type
quantity
available_quantity
location
status
```

---

## Rescue Teams

```text
rescue_teams
------------
id
name
organization_id
status
location
capacity
```

---

## Alerts

```text
alerts
------
id
type
severity
message
location
risk_score
created_at
expires_at
```

---

## Risk Zones

```text
risk_zones
----------
id
area
risk_type
risk_score
risk_level
valid_from
valid_until
```

---

# 21. API Structure

The backend can expose REST APIs.

## Authentication

```text
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
```

## Incidents

```text
GET    /api/incidents
GET    /api/incidents/:id
POST   /api/incidents
PATCH  /api/incidents/:id
DELETE /api/incidents/:id
```

## Reports

```text
POST /api/reports
GET  /api/reports
POST /api/reports/:id/verify
```

## Resources

```text
GET   /api/resources
POST  /api/resources
PATCH /api/resources/:id
```

## Teams

```text
GET   /api/teams
POST  /api/teams
PATCH /api/teams/:id
```

## Risk

```text
GET /api/risk
GET /api/risk/:area
POST /api/risk/predict
```

## Alerts

```text
GET  /api/alerts
POST /api/alerts
PATCH /api/alerts/:id
```

---

# 22. Geographic Queries

PostGIS enables queries such as:

### Incidents near a location

```text
Find all incidents within 5 km
of a rescue team's location.
```

### Villages inside a flood zone

```text
Find all villages whose geographic
boundaries intersect the flood polygon.
```

### Nearest hospital

```text
Find the nearest available hospital
to a critical incident.
```

### Blocked roads

```text
Find roads intersecting an affected area.
```

These queries form an important part of ResQGrid's geographic intelligence layer.

---

# 23. Machine Learning Pipeline

The ML system can eventually follow:

```text
Historical Data
      │
      ▼
Data Cleaning
      │
      ▼
Feature Engineering
      │
      ▼
Model Training
      │
      ▼
Model Evaluation
      │
      ▼
Risk Prediction
      │
      ▼
API
      │
      ▼
ResQGrid Dashboard
```

Possible models:

- Logistic Regression
- Random Forest
- XGBoost
- Gradient Boosting
- Neural Networks

The first implementation should preferably start with a simpler interpretable model before moving to more complex models.

---

# 24. Example Risk Prediction

Input:

```text
Rainfall: 185 mm
Elevation: 72 m
River Distance: 1.2 km
Soil Saturation: 78%
Historical Floods: 4
Population Density: High
```

Output:

```text
Flood Risk Score: 87/100

Risk Level: CRITICAL

Recommended Action:
Prepare evacuation resources and
monitor the area continuously.
```

---

# 25. Media Intelligence

Uploaded images can eventually be analyzed automatically.

Potential use cases:

```text
Image
  ↓
Computer Vision Model
  ↓
Possible Damage Detection
  ↓
Classification
  ↓
Incident Metadata
```

Possible classifications:

- Flooded road
- Collapsed building
- Fallen tree
- Fire
- Damaged bridge
- Landslide
- Normal / irrelevant

The ML result should assist human verification rather than automatically declaring an incident to be genuine.

---

# 26. Security

Because ResQGrid handles potentially sensitive emergency information, security is an important component.

Potential measures:

- JWT-based authentication
- Role-based access control
- Password hashing
- Input validation
- Rate limiting
- API authentication
- Secure file uploads
- File type validation
- Database access controls
- Audit logs

Example roles:

```text
ADMIN
DISTRICT_ADMIN
DISASTER_AUTHORITY
FIELD_OFFICER
EMERGENCY_SERVICE
INFRASTRUCTURE_AUTHORITY
CITIZEN
```

Each role should only access the functionality required for its responsibilities.

---

# 27. Audit Logging

Important actions should be recorded.

Example:

```text
User:
Officer 104

Action:
Updated incident status

Incident:
INC-1042

Previous:
Reported

New:
Verified

Time:
14:48
```

This improves accountability and makes it possible to reconstruct decisions after an emergency.

---

# 28. Suggested Project Structure

```text
ResQGrid/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── models/
│   │   ├── utils/
│   │   └── server.js
│   │
│   └── package.json
│
├── ml/
│   ├── data/
│   ├── models/
│   ├── notebooks/
│   ├── preprocessing/
│   └── inference/
│
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfiles/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── deployment.md
│
├── scripts/
│   ├── seed.js
│   └── setup.js
│
├── .env.example
├── .gitignore
└── README.md
```

---

# 29. Development Phases

## Phase 1 — Core Platform

Build:

- React dashboard
- Express backend
- PostgreSQL database
- User authentication
- Incident CRUD
- Basic map
- Incident markers

## Phase 2 — Geographic Intelligence

Add:

- PostGIS
- Spatial queries
- Affected villages
- Road analysis
- Hospitals and shelters
- Geographic filtering

## Phase 3 — Field Reporting

Add:

- Mobile-friendly reporting
- GPS location
- Image uploads
- Incident verification
- Field officer workflow

## Phase 4 — Resource Coordination

Add:

- Rescue teams
- Emergency vehicles
- Equipment
- Resource allocation
- Team assignment

## Phase 5 — Risk Intelligence

Add:

- Rainfall data
- Terrain data
- Soil data
- Historical disaster data
- Risk scoring
- Risk maps

## Phase 6 — Machine Learning

Add:

- Risk prediction
- Incident prioritization
- Image classification
- Anomaly detection

## Phase 7 — Alerts & Communication

Add:

- Dashboard alerts
- SMS
- Email
- Push notifications
- Public warnings

---

# 30. Example End-to-End Scenario

### Step 1 — Heavy Rainfall

The system receives rainfall data indicating unusually high rainfall.

```text
Rainfall: 210 mm
```

### Step 2 — Risk Increase

The risk model detects increasing flood probability.

```text
Flood Risk: 78
Risk Level: HIGH
```

### Step 3 — Alert

Authorities receive an alert.

```text
HIGH FLOOD RISK

Area: Village Cluster A
Risk Score: 78
```

### Step 4 — Citizen Report

A citizen reports flooding.

```text
Flood reported
Location: Village A
Photo uploaded
```

### Step 5 — Verification

A field officer confirms the report.

```text
Status: VERIFIED
Severity: HIGH
```

### Step 6 — Geographic Analysis

ResQGrid identifies:

```text
3 affected villages
2 blocked roads
1 damaged bridge
1 nearby hospital
```

### Step 7 — Prioritization

The system calculates:

```text
Urgency Score: 91
Priority: CRITICAL
```

### Step 8 — Resource Assignment

The district administration assigns:

```text
2 Rescue Teams
2 Boats
1 Ambulance
```

### Step 9 — Response

The field team updates the incident:

```text
Response in Progress
```

### Step 10 — Resolution

After the area is secured:

```text
Incident Status: Resolved
```

The complete incident is stored for future analysis.

---

# 31. Future Possibilities

Future versions of ResQGrid could integrate:

- Satellite imagery
- Weather APIs
- River-level sensors
- IoT devices
- Drone imagery
- Automatic road detection
- Real-time traffic information
- Emergency call-center data
- Social media disaster signals
- AI-assisted situation summaries
- Automated evacuation planning
- Digital twins of disaster-prone regions

---

# 32. Design Principles

ResQGrid should follow several principles.

### Human-in-the-loop

AI should assist emergency personnel rather than independently making critical decisions.

### Location-first

Disaster information is inherently geographic, so location should be a core part of the data model.

### Action-oriented

The system should not merely display information. It should help authorities decide:

```text
What is happening?
Where is it happening?
How serious is it?
Who is affected?
What should be done?
Which resources are available?
```

### Explainable

Risk and priority scores should provide understandable reasons whenever possible.

### Reliable

Emergency systems should continue functioning even when connectivity or individual services are unreliable.

---

# 33. Project Vision

ResQGrid aims to evolve from an incident reporting dashboard into a complete **disaster intelligence and emergency coordination platform**.

The long-term vision is to create a system where:

```text
                    DATA
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
   Weather       Field Data    Historical Data
       │             │             │
       └─────────────┼─────────────┘
                     ▼
               INTELLIGENCE
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      Risk       Incidents     Impact
        │            │            │
        └────────────┼────────────┘
                     ▼
                 DECISIONS
                     │
                     ▼
                 RESPONSE
                     │
                     ▼
                  RECOVERY
                     │
                     ▼
              HISTORICAL DATA
                     │
                     └──────► Better Predictions
```

ResQGrid's goal is to turn fragmented disaster information into a **shared, geographic, real-time operational picture** that enables faster and better-informed emergency response.
