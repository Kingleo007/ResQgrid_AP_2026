# ResQGrid

ResQGrid is a disaster intelligence and emergency response platform designed to help coordinate emergency information, resources, incidents, and geographic intelligence.

## Summary
ResQGrid monitors disaster-prone areas, helps authorities understand what is happening, identifies where help is needed, and coordinates the response.

## Architecture

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL + PostGIS
- Infrastructure: Docker Compose

## Project Structure

frontend/     React frontend
backend/      Express API
docker/       Infrastructure configuration
docs/         Documentation
ml/           Machine learning components
scripts/      Development scripts

## Users
District Administration - See overall disaster situation and decide where to send resources
Disaster Management Authorities - Monitor risks/incidents and coordinate emergency response
Field/Rescue Teams - Report incidents, road blockages, damage, and on-ground conditions
Local Communities / Citizens - Report disasters and receive warnings/instructions
Emergency Services - Know where incidents are happening and prioritize assistance
Infrastructure/Road Authorities - Monitor damaged or blocked roads and connectivity


## Features (if possible to implement)
Display disasters/incidents on a live map and show their location, severity, and status.

Identify affected villages, roads, infrastructure, etc and rank incidents by urgency.

Field officer/citizen submits an incident, location + photo/video + description , it appears on the central dashboard.

Rainfall + terrain + soil + historical data → risk level, if an area becomes high-risk, authorities/community receive an alert.