import { useEffect, useMemo, useState } from 'react';
import { GeoJSON, MapContainer } from 'react-leaflet';

const STATE_ALIASES = {
  'Andaman & Nicobar': ['andaman and nicobar islands', 'andaman and nicobar'],
  'Dadra,Nagar Haveli,Daman & Diu': [
    'dadra and nagar haveli and daman and diu',
    'dadra nagar haveli',
    'daman and diu',
  ],
  'Delhi': ['nct of delhi', 'national capital territory of delhi', 'new delhi'],
  'Jammu & Kashmir': ['jammu and kashmir'],
  'Odisha': ['orissa'],
  'Puducherry': ['pondicherry'],
  'Uttarakhand': ['uttaranchal'],
};

function normalize(value = '') {
  return value
    .toLocaleLowerCase('en-IN')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function matchState(value, states) {
  const normalizedValue = ` ${normalize(value)} `;
  if (!normalizedValue.trim()) return null;

  for (const feature of states?.features || []) {
    const stateName = feature.properties.state;
    const candidates = [stateName, ...(STATE_ALIASES[stateName] || [])];
    if (candidates.some((candidate) => normalizedValue.includes(` ${normalize(candidate)} `))) {
      return stateName;
    }
  }
  return null;
}

function incidentState(incident, states) {
  return matchState(incident.state || incident.stateName || incident.locationName || '', states);
}

function fillForCount(count) {
  if (count >= 5) return '#b93824';
  if (count >= 3) return '#d85b30';
  if (count >= 2) return '#ec8b54';
  if (count === 1) return '#f5c9a5';
  return '#edf1f5';
}

export default function IndiaIncidentMap({ incidents = [], loading = false, error = '' }) {
  const [selectedState, setSelectedState] = useState('');
  const [statesData, setStatesData] = useState(null);
  const [boundaryError, setBoundaryError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/data/india-states.json')
      .then((response) => {
        if (!response.ok) throw new Error('State boundary request failed');
        return response.json();
      })
      .then((data) => { if (!cancelled) setStatesData(data); })
      .catch(() => { if (!cancelled) setBoundaryError('Could not load India state boundaries.'); });
    return () => { cancelled = true; };
  }, []);

  const stateSummary = useMemo(() => {
    const counts = new Map();
    for (const incident of incidents) {
      const state = incidentState(incident, statesData);
      if (state) counts.set(state, (counts.get(state) || 0) + 1);
    }
    return counts;
  }, [incidents, statesData]);

  const activeStates = useMemo(() => (
    [...stateSummary.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  ), [stateSummary]);

  const mapKey = `${selectedState}::${[...stateSummary.entries()].map(([name, count]) => `${name}:${count}`).join('|')}`;

  function styleState(feature) {
    const name = feature.properties.state;
    const count = stateSummary.get(name) || 0;
    const selected = selectedState === name;
    return {
      color: selected ? '#1f3a5f' : '#ffffff',
      weight: selected ? 2.2 : 1.2,
      opacity: 1,
      fillColor: fillForCount(count),
      fillOpacity: count ? 0.92 : 0.82,
    };
  }

  function bindState(feature, layer) {
    const name = feature.properties.state;
    const count = stateSummary.get(name) || 0;
    const countLabel = `${count} ${count === 1 ? 'incident' : 'incidents'}`;
    layer.bindTooltip(`${name} · ${countLabel}`, { sticky: true, direction: 'top', className: 'india-map__tooltip' });
    layer.on({
      click: () => setSelectedState((current) => current === name ? '' : name),
      mouseover: (event) => event.target.setStyle({ weight: 2, color: '#1f3a5f' }),
      mouseout: (event) => event.target.setStyle(styleState(feature)),
    });
  }

  return (
    <section className="india-map-card" aria-labelledby="india-map-title">
      <div className="india-map-card__header">
        <div>
          <h2 id="india-map-title">Incidents across India</h2>
          <p>Reports grouped by state and union territory</p>
        </div>
        <div className="india-map-card__summary" aria-live="polite">
          <strong>{activeStates.length}</strong>
          <span>states with reports</span>
        </div>
      </div>

      {error && <p className="india-map-card__message" role="status">{error}</p>}
      {loading && <p className="india-map-card__message" role="status">Loading incident locations…</p>}

      <div className="india-map-card__body">
        <div className="india-map__canvas" aria-label="Map of India showing incident counts by state">
          {statesData ? (
            <MapContainer
              className="india-map__leaflet"
              bounds={[[5.5, 67.5], [37.8, 98.2]]}
              boundsOptions={{ padding: [12, 12] }}
              minZoom={3}
              maxZoom={8}
              zoomControl={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              attributionControl={false}
            >
              <GeoJSON
                key={mapKey}
                data={statesData}
                style={styleState}
                onEachFeature={bindState}
              />
            </MapContainer>
          ) : (
            <div className="india-map__loading" role="status">
              {boundaryError || 'Loading India state boundaries…'}
            </div>
          )}
          <div className="india-map__legend" aria-label="Incident count legend">
            <span><i className="india-map__swatch india-map__swatch--none" />No reports</span>
            <span><i className="india-map__swatch india-map__swatch--one" />1</span>
            <span><i className="india-map__swatch india-map__swatch--some" />2–4</span>
            <span><i className="india-map__swatch india-map__swatch--many" />5+</span>
          </div>
        </div>

        <aside className="india-map__states" aria-label="States with incidents">
          <div className="india-map__states-heading">
            <h3>{selectedState || 'Reported states'}</h3>
            {selectedState && <button type="button" onClick={() => setSelectedState('')}>Clear</button>}
          </div>
          {activeStates.length ? (
            <ul>
              {activeStates.map(([name, count]) => (
                <li key={name}>
                  <button
                    type="button"
                    className={selectedState === name ? 'india-map__state india-map__state--selected' : 'india-map__state'}
                    aria-pressed={selectedState === name}
                    onClick={() => setSelectedState((current) => current === name ? '' : name)}
                  >
                    <span className="india-map__state-dot" style={{ backgroundColor: fillForCount(count) }} />
                    <span>{name}</span>
                    <strong>{count}</strong>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="india-map__empty">No incident locations include a recognized state name yet.</p>
          )}
          {selectedState && (
            <p className="india-map__selection">
              {stateSummary.get(selectedState) || 0} recorded {(stateSummary.get(selectedState) || 0) === 1 ? 'incident' : 'incidents'}
            </p>
          )}
        </aside>
      </div>
      <p className="india-map-card__source">State boundaries: NIC BharatMaps administrative boundary layer.</p>
    </section>
  );
}
