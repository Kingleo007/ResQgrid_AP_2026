import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../layout/PageHeader.jsx';

const OFFICIAL_LINKS = {
  sachet: 'https://sachet.ndma.gov.in/DosDont',
  stateHelpdesk: 'https://sachet.ndma.gov.in/HelpDesk',
  mha112: 'https://www.mha.gov.in/emergency-response-support-system-erss',
  indiaHelplines: 'https://www.india.gov.in/directory/helpline',
  nhmAmbulance: 'https://nhm.gov.in/nhm_live/index1.php?lang=1&level=2&lid=189&sublinkid=1217',
  imd: 'https://mausam.imd.gov.in/',
  disasterControlRooms: 'https://ndmindia.mha.gov.in/ndmi/contact-us',
};

const PROTOCOLS = [
  {
    id: 'flood',
    name: 'Flood',
    summary: 'Protect people from rising water, fast currents and electrical hazards.',
    steps: [
      'Check official alerts and move to the designated safe location when directed.',
      'Keep away from floodwater, drains, bridges and submerged roads; do not walk or drive through water.',
      'Move to higher ground and keep the group together while accounting for everyone at the safe point.',
      'Report damaged power lines or trapped people to the control room; do not approach electrical hazards.',
    ],
    fieldNote: 'Do not return to an evacuated area until local authorities give the all-clear.',
  },
  {
    id: 'landslide',
    name: 'Landslide',
    summary: 'Move people away from slopes, debris paths and areas at risk of a second slide.',
    steps: [
      'Follow district warnings and move away from steep slopes, valleys and stream channels.',
      'If debris is moving, get clear of its path and alert others only when it is safe to do so.',
      'Notify the control room of blocked routes, damaged structures or people who may be trapped.',
      'Use an alternate route confirmed by authorities; avoid crossing fresh debris or unstable ground.',
    ],
    fieldNote: 'A second slide may follow the first. Wait for an official safety assessment before re-entry.',
  },
  {
    id: 'cyclone',
    name: 'Cyclone',
    summary: 'Use official warnings and evacuation instructions to reach a designated safe shelter.',
    steps: [
      'Monitor official IMD and district updates; do not rely on unverified messages or rumours.',
      'Evacuate when directed and use the route and shelter identified by local authorities.',
      'At the shelter, stay away from windows and keep communication devices available for updates.',
      'Report blocked routes, flooding or urgent needs through the control room when it is safe.',
    ],
    fieldNote: 'Do not go outdoors during a lull in the wind; wait for the official all-clear.',
  },
  {
    id: 'earthquake',
    name: 'Earthquake',
    summary: 'Protect people during shaking, then move carefully around damaged buildings.',
    steps: [
      'During shaking, Drop, Cover and Hold On; stay away from glass and objects that may fall.',
      'When shaking stops, check for immediate hazards and use stairs if leaving a damaged building.',
      'Move to an open area away from buildings, trees and power lines when it is safe to exit.',
      'Report injuries, fires, gas leaks or structural damage; avoid entering visibly damaged structures.',
    ],
    fieldNote: 'Do not use lifts in a damaged building. Follow local instructions for aftershocks and re-entry.',
  },
  {
    id: 'fire',
    name: 'Fire',
    summary: 'Raise the alarm, leave by a safe route and keep people out of smoke and heat.',
    steps: [
      'Raise the alarm and call the local emergency service; use 112 for a nationwide emergency response.',
      'Leave by the nearest safe exit and use stairs; do not enter smoke-filled areas or retrieve belongings.',
      'Move to the assembly point and keep access routes clear for fire and rescue teams.',
      'Tell responders if anyone may remain inside; do not re-enter until the incident commander permits it.',
    ],
    fieldNote: 'Do not attempt firefighting unless trained, equipped and directed under the local response plan.',
  },
];

const STATES_AND_UTS = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const CONTACTS = [
  {
    id: '112',
    name: 'National emergency response',
    number: '112',
    telephone: '112',
    scope: 'Police, fire, health and other emergencies',
    note: 'Nationwide unified emergency number.',
    source: OFFICIAL_LINKS.mha112,
    sourceLabel: 'Ministry of Home Affairs',
  },
  {
    id: '108',
    name: 'Ambulance service',
    number: '108',
    telephone: '108',
    scope: 'Emergency ambulance in participating States and UTs',
    note: 'Availability and service routing vary by State/UT. Use 112 if unavailable.',
    source: OFFICIAL_LINKS.nhmAmbulance,
    sourceLabel: 'National Health Mission',
  },
  {
    id: '101',
    name: 'Fire service',
    number: '101',
    telephone: '101',
    scope: 'Fire and rescue',
    note: '112 is also the nationwide unified emergency number.',
    source: OFFICIAL_LINKS.indiaHelplines,
    sourceLabel: 'National Portal of India',
  },
  {
    id: 'ndrf',
    name: 'NDRF Headquarters',
    number: '011-24363260',
    telephone: '+911124363260',
    scope: 'National Disaster Response Force contact',
    note: 'Headquarters contact listed by the Disaster Management Division.',
    source: OFFICIAL_LINKS.disasterControlRooms,
    sourceLabel: 'MHA Disaster Management Division',
  },
];

const SEVERITY_GUIDE = [
  {
    level: 'Critical',
    className: 'critical',
    criteria: 'Immediate threat to life, multiple casualties, or essential infrastructure at risk.',
    response: 'Immediate duty-officer attention; follow the local incident command plan.',
    escalation: 'Escalate immediately to the designated supervisor and relevant response authority.',
  },
  {
    level: 'High',
    className: 'high',
    criteria: 'Serious harm or significant disruption is likely without a prompt response.',
    response: 'Prioritize at the next operator action; apply the local response target.',
    escalation: 'Notify the supervisor if impact grows, resources are delayed or scope is uncertain.',
  },
  {
    level: 'Moderate',
    className: 'moderate',
    criteria: 'A verified incident needs coordinated attention but no immediate life threat is reported.',
    response: 'Use the standard queue target defined by the department SOP.',
    escalation: 'Raise priority if new evidence indicates worsening impact or spread.',
  },
  {
    level: 'Low',
    className: 'low',
    criteria: 'Limited impact, stable conditions and no immediate danger identified.',
    response: 'Review and schedule follow-up according to the department SOP.',
    escalation: 'Reassess if the situation changes, reports are corroborated or impacts expand.',
  },
];

const STATUS_GUIDE = [
  ['Reported', 'A report has been received and is awaiting review or verification.'],
  ['Active', 'The incident has been accepted for response; coordination is underway.'],
  ['Contained', 'The immediate hazard or spread is controlled; monitoring or support may continue.'],
  ['Resolved', 'Response objectives are met and the incident is ready for final review.'],
  ['Closed', 'An authorized operator has completed the final review and closed the record.'],
];

const FAQS = [
  {
    question: 'How should I verify a citizen report?',
    answer: 'Follow your department’s verification SOP. Compare the report with available trusted sources, contact the reporting channel when permitted, record what is confirmed, and keep unverified details clearly marked. Do not delay an urgent life-safety escalation while seeking confirmation.',
  },
  {
    question: 'When should an incident be marked Contained instead of Resolved?',
    answer: 'Use Contained when the immediate hazard is under control but monitoring, recovery or support is still needed. Use Resolved only when the response objectives are complete and the record is ready for the department’s final review.',
  },
  {
    question: 'How do I choose a severity level?',
    answer: 'Use the criteria in the severity guide as a consistent starting point, document the evidence, and follow your State/UT or district SOP. Escalate when there is immediate danger, uncertainty about impact or a material change in conditions.',
  },
  {
    question: 'Are the phone numbers and hazard steps official instructions?',
    answer: 'The directory links to government sources for current information. The short hazard steps on this site are general quick-reference guidance, not a replacement for notified local SOPs, evacuation orders or instructions from incident command.',
  },
  {
    question: 'Can the ResQGrid reference pages receive emergency calls?',
    answer: 'No. These pages are an operator reference. For immediate danger, call 112 or the appropriate local emergency service.',
  },
];

function PageIntro({ children, tone = 'default' }) {
  return <div className={`reference-intro reference-intro--${tone}`}>{children}</div>;
}

function SourceLinks({ links }) {
  return (
    <div className="reference-sources" aria-label="Official sources">
      <span>Official sources</span>
      {links.map((link) => (
        <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
          {link.label}<span aria-hidden="true"> ↗</span>
        </a>
      ))}
    </div>
  );
}

export function ProtocolsPage() {
  const [query, setQuery] = useState('');
  const [activeHazard, setActiveHazard] = useState('all');
  const visibleProtocols = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return PROTOCOLS.filter((protocol) => {
      const matchesHazard = activeHazard === 'all' || protocol.id === activeHazard;
      const searchableText = [protocol.name, protocol.summary, protocol.fieldNote, ...protocol.steps].join(' ').toLowerCase();
      return matchesHazard && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeHazard, query]);

  return (
    <div className="page reference-page">
      <PageHeader title="Emergency protocols & SOPs" subtitle="Quick-reference actions by hazard type" />

      <PageIntro tone="caution">
        <strong>Use with your local response plan.</strong>
        <p>These concise actions help orient operators. Notified State/UT and district SOPs, evacuation orders and incident-command instructions take precedence.</p>
      </PageIntro>

      <section className="reference-controls" aria-label="Find a protocol">
        <label className="reference-search">
          <span>Search protocols</span>
          <input
            className="form-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search actions, hazards or risks"
          />
        </label>
        <div className="reference-filter" role="group" aria-label="Filter by hazard type">
          <span className="reference-filter__label">Hazard</span>
          <div className="reference-filter__options">
            {[['all', 'All hazards'], ...PROTOCOLS.map(({ id, name }) => [id, name])].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`reference-filter__button${activeHazard === id ? ' is-active' : ''}`}
                aria-pressed={activeHazard === id}
                onClick={() => setActiveHazard(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="protocol-list" aria-label="Hazard protocols" aria-live="polite">
        {visibleProtocols.map((protocol) => (
          <article className="protocol-section" key={protocol.id}>
            <div className="protocol-section__heading">
              <h2>{protocol.name}</h2>
              <p>{protocol.summary}</p>
            </div>
            <div className="protocol-section__body">
              <h3>First-response actions</h3>
              <ol className="protocol-steps">
                {protocol.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <p className="protocol-field-note"><strong>Field reminder</strong>{protocol.fieldNote}</p>
            </div>
          </article>
        ))}
        {visibleProtocols.length === 0 && (
          <div className="reference-empty" role="status">
            <strong>No matching protocols</strong>
            <p>Try another term or clear the hazard filter.</p>
            <button type="button" className="btn btn-secondary" onClick={() => { setQuery(''); setActiveHazard('all'); }}>
              Clear search and filters
            </button>
          </div>
        )}
      </section>

      <section className="triage-guide" aria-labelledby="triage-title">
        <div>
          <h2 id="triage-title">Operational priority cues</h2>
          <p>These labels support incident queue consistency; they are not clinical triage categories.</p>
        </div>
        <ul>
          <li><span className="severity-tag severity-tag--critical">Critical</span><span>Immediate threat to life; escalate now.</span></li>
          <li><span className="severity-tag severity-tag--high">High</span><span>Serious impact; prioritize prompt coordination.</span></li>
          <li><span className="severity-tag severity-tag--moderate">Moderate</span><span>Needs coordinated attention; apply the local target.</span></li>
          <li><span className="severity-tag severity-tag--low">Low</span><span>Stable, limited impact; schedule review per SOP.</span></li>
        </ul>
      </section>

      <SourceLinks links={[{ href: OFFICIAL_LINKS.sachet, label: 'NDMA SACHET hazard advice' }]} />
    </div>
  );
}

export function DirectoryPage() {
  const [selectedState, setSelectedState] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  async function copyNumber(contact) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(contact.number);
      } else {
        const field = document.createElement('textarea');
        field.value = contact.number;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('Clipboard unavailable');
      }
      setCopyStatus(`${contact.name} number copied.`);
    } catch {
      setCopyStatus(`Could not copy ${contact.name}. Select the number and copy it manually.`);
    }
  }

  return (
    <div className="page reference-page">
      <PageHeader title="Emergency helplines & directory" subtitle="National contacts and official State/UT listings" />

      <PageIntro tone="caution">
        <strong>Immediate danger: use 112.</strong>
        <p>Contact availability can vary by State/UT. Confirm local routing with the linked official directory and your department’s contact list.</p>
      </PageIntro>

      <section className="directory-section" aria-labelledby="national-contacts-title">
        <div className="reference-section-heading">
          <div>
            <h2 id="national-contacts-title">National contacts</h2>
            <p>Tap a call link on a supported device, or copy a number for dispatch notes.</p>
          </div>
        </div>
        <ul className="directory-contact-list">
          {CONTACTS.map((contact) => (
            <li className="directory-contact" key={contact.id}>
              <div className="directory-contact__main">
                <h3>{contact.name}</h3>
                <p>{contact.scope}</p>
                <span className="directory-contact__note">{contact.note}</span>
                <a className="directory-contact__source" href={contact.source} target="_blank" rel="noreferrer">
                  {contact.sourceLabel}<span aria-hidden="true"> ↗</span>
                </a>
              </div>
              <div className="directory-contact__actions">
                <a className="directory-number" href={`tel:${contact.telephone}`}>{contact.number}</a>
                <div className="directory-contact__buttons">
                  <a className="btn btn-secondary btn-sm" href={`tel:${contact.telephone}`}>Call</a>
                  <button className="btn btn-ghost btn-sm" type="button" onClick={() => copyNumber(contact)}>Copy</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="sr-only" role="status" aria-live="polite">{copyStatus}</p>
      </section>

      <section className="directory-section directory-state" aria-labelledby="state-contacts-title">
        <div className="reference-section-heading">
          <div>
            <h2 id="state-contacts-title">State / UT disaster authority</h2>
            <p>Choose a jurisdiction to open its current SDMA, SDRF and control-room listing.</p>
          </div>
        </div>
        <label className="reference-search directory-state__select">
          <span>Filter by State or Union Territory</span>
          <select className="form-select" value={selectedState} onChange={(event) => setSelectedState(event.target.value)}>
            <option value="">Select a State / UT</option>
            {STATES_AND_UTS.map((state) => <option value={state} key={state}>{state}</option>)}
          </select>
        </label>
        {selectedState ? (
          <div className="directory-state__result" aria-live="polite">
            <div>
              <span className="directory-state__eyebrow">Selected jurisdiction</span>
              <h3>{selectedState}</h3>
              <p>NDMA SACHET publishes the current State/UT helpdesk details. Confirm the selected jurisdiction on the official page before using a contact.</p>
            </div>
            <a className="btn btn-primary" href={OFFICIAL_LINKS.stateHelpdesk} target="_blank" rel="noreferrer">
              Open official helpdesk <span aria-hidden="true">↗</span>
            </a>
          </div>
        ) : (
          <p className="directory-state__empty">Select a jurisdiction to see the official State/UT helpdesk link.</p>
        )}
      </section>

      <section className="directory-weather" aria-labelledby="weather-title">
        <div>
          <h2 id="weather-title">Weather alerts</h2>
          <p>Use the India Meteorological Department’s current forecasts and warnings.</p>
        </div>
        <a className="btn btn-secondary" href={OFFICIAL_LINKS.imd} target="_blank" rel="noreferrer">Open IMD Mausam <span aria-hidden="true">↗</span></a>
      </section>

      <SourceLinks links={[
        { href: OFFICIAL_LINKS.indiaHelplines, label: 'National Portal helpline directory' },
        { href: OFFICIAL_LINKS.stateHelpdesk, label: 'NDMA SACHET State/UT helpdesk' },
      ]} />
    </div>
  );
}

export function GuidelinesPage() {
  return (
    <div className="page reference-page">
      <PageHeader title="Severity & escalation guide" subtitle="A shared reference for incident classification and status updates" />

      <PageIntro tone="caution">
        <strong>Suggested ResQGrid guidance; local policy governs.</strong>
        <p>Use department-approved criteria and response targets. The examples below do not establish official response-time SLAs or replace State/UT and district procedures.</p>
      </PageIntro>

      <section className="guideline-section" aria-labelledby="severity-title">
        <div className="reference-section-heading">
          <div>
            <h2 id="severity-title">Severity levels</h2>
            <p>Severity describes the potential impact and the urgency of attention.</p>
          </div>
        </div>
        <div className="reference-table-wrap">
          <table className="reference-table">
            <thead><tr><th scope="col">Level</th><th scope="col">Operational criteria</th><th scope="col">Response expectation</th><th scope="col">Escalate when</th></tr></thead>
            <tbody>
              {SEVERITY_GUIDE.map((item) => (
                <tr key={item.level}>
                  <th scope="row"><span className={`severity-tag severity-tag--${item.className}`}>{item.level}</span></th>
                  <td>{item.criteria}</td><td>{item.response}</td><td>{item.escalation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="reference-table-note">Set numeric response targets in the agency’s approved SOP; no fixed times are configured on this static page.</p>
      </section>

      <section className="guideline-section" aria-labelledby="lifecycle-title">
        <div className="reference-section-heading">
          <div>
            <h2 id="lifecycle-title">Status lifecycle</h2>
            <p>Status records response progress; it is separate from severity.</p>
          </div>
        </div>
        <ol className="status-lifecycle">
          {STATUS_GUIDE.map(([status, description], index) => (
            <li key={status}>
              <span className="status-lifecycle__step">{index + 1}</span>
              <div><h3>{status}</h3><p>{description}</p></div>
              {index < STATUS_GUIDE.length - 1 && <span className="status-lifecycle__arrow" aria-hidden="true">→</span>}
            </li>
          ))}
        </ol>
      </section>

      <section className="guideline-section" aria-labelledby="consistency-title">
        <div className="guideline-reminder">
          <h2 id="consistency-title">Keep the record consistent</h2>
          <p>Record the reason for a severity or status change, include the latest verified information, and make the next action clear to the receiving operator.</p>
        </div>
      </section>
    </div>
  );
}

export function ChangelogPage() {
  return (
    <div className="page reference-page">
      <PageHeader title="System status & release notes" subtitle="A transparent view of demo content and example product updates" />

      <PageIntro tone="neutral">
        <strong>Static demo page — no live health checks run here.</strong>
        <p>Service indicators below describe what this page can verify. They do not represent production availability or active alert-feed monitoring.</p>
      </PageIntro>

      <section className="status-section" aria-labelledby="system-status-title">
        <div className="reference-section-heading">
          <div>
            <h2 id="system-status-title">Service visibility</h2>
            <p>No live monitoring signal is configured on this page.</p>
          </div>
          <span className="status-page-badge">Demo view</span>
        </div>
        <ul className="system-status-list">
          <li><div><h3>Application API</h3><p>Health is not checked by this page.</p></div><span className="system-status__state">Not monitored</span></li>
          <li><div><h3>Map tiles</h3><p>Tile-provider health is not checked by this page.</p></div><span className="system-status__state">Not monitored</span></li>
          <li><div><h3>Alert engine</h3><p>No live alert-feed connection is shown here.</p></div><span className="system-status__state">Not monitored</span></li>
        </ul>
      </section>

      <section className="status-section" aria-labelledby="release-notes-title">
        <div className="reference-section-heading">
          <div>
            <h2 id="release-notes-title">Example release notes</h2>
            <p>Illustrative entries for a product walkthrough; verify against the actual release record before publication.</p>
          </div>
        </div>
        <ol className="release-timeline">
          <li><span className="release-timeline__version">v1.2</span><div><h3>State-wise incident map</h3><p>Example update: added an India map view for incident locations and operational context.</p></div><span className="release-timeline__tag">Illustrative</span></li>
          <li><span className="release-timeline__version">v1.1</span><div><h3>Role-based admin access</h3><p>Example update: added role-aware access for administrative workflows.</p></div><span className="release-timeline__tag">Illustrative</span></li>
          <li><span className="release-timeline__version">v1.0</span><div><h3>Incident register and status workflow</h3><p>Example baseline: introduced incident records, severity labels and response status tracking.</p></div><span className="release-timeline__tag">Illustrative</span></li>
        </ol>
      </section>

      <section className="status-section" aria-labelledby="roadmap-title">
        <div className="reference-section-heading">
          <div><h2 id="roadmap-title">Possible next modules</h2><p>Ideas for future planning; these are not committed delivery dates.</p></div>
        </div>
        <ul className="roadmap-list">
          <li><strong>Regional language references</strong><span>Operator guidance and emergency terms for additional languages.</span></li>
          <li><strong>Offline reference access</strong><span>Read-only emergency guidance for low-connectivity situations.</span></li>
          <li><strong>Audit and handover support</strong><span>Clearer incident history for shift transitions and review.</span></li>
        </ul>
      </section>
    </div>
  );
}

export function HelpPage() {
  return (
    <div className="page reference-page">
      <PageHeader title="Help & operator guide" subtitle="Common workflows, answers and keyboard basics" />

      <section className="quick-tour" aria-labelledby="quick-tour-title">
        <div className="reference-section-heading">
          <div><h2 id="quick-tour-title">A quick dashboard tour</h2><p>Three starting points for a control-room shift.</p></div>
        </div>
        <ol>
          <li><span>1</span><div><h3>Scan priority incidents</h3><p>Start at the dashboard and review open critical and high-severity reports.</p></div><Link to="/dashboard">Open dashboard <span aria-hidden="true">→</span></Link></li>
          <li><span>2</span><div><h3>Review the incident register</h3><p>Search, sort and open a report to confirm its current details.</p></div><Link to="/incidents">Open incidents <span aria-hidden="true">→</span></Link></li>
          <li><span>3</span><div><h3>Record a new report</h3><p>Use the incident form and follow local verification and escalation procedures.</p></div><Link to="/incidents/new">Create incident <span aria-hidden="true">→</span></Link></li>
        </ol>
      </section>

      <section className="help-section" aria-labelledby="faq-title">
        <div className="reference-section-heading">
          <div><h2 id="faq-title">Frequently asked questions</h2><p>Expand a question to see the guidance.</p></div>
        </div>
        <div className="faq-list">
          {FAQS.map(({ question, answer }) => (
            <details className="faq-item" key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="help-section" aria-labelledby="keyboard-title">
        <div className="reference-section-heading">
          <div><h2 id="keyboard-title">Keyboard basics</h2><p>Standard browser keyboard behavior; no custom ResQGrid shortcuts are configured.</p></div>
        </div>
        <div className="reference-table-wrap">
          <table className="reference-table keyboard-table">
            <thead><tr><th scope="col">Key</th><th scope="col">Action</th></tr></thead>
            <tbody>
              <tr><th scope="row"><kbd>Tab</kbd></th><td>Move focus to the next link or control.</td></tr>
              <tr><th scope="row"><kbd>Shift</kbd> + <kbd>Tab</kbd></th><td>Move focus to the previous link or control.</td></tr>
              <tr><th scope="row"><kbd>Enter</kbd></th><td>Open the focused link or activate a button.</td></tr>
              <tr><th scope="row"><kbd>Space</kbd></th><td>Activate a focused button or toggle a disclosure.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <PageIntro tone="caution">
        <strong>These pages do not receive emergency calls.</strong>
        <p>For immediate danger, call 112. Follow notified local SOPs and directions from the responsible incident command.</p>
      </PageIntro>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="page reference-page about-page">
      <PageHeader title="About ResQGrid" subtitle="A shared workspace for incident coordination" />

      <section className="about-lead">
        <div className="about-lead__mark" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 4.5 39 10v12.3c0 9.3-6.3 16.2-15 20-8.7-3.8-15-10.7-15-20V10l15-5.5Z" />
            <path d="m17.5 23.5 4.3 4.3 9.2-9.7" />
          </svg>
        </div>
        <div>
          <p className="about-lead__label">Response operations</p>
          <h2>One place to review reports, track response and find reference guidance.</h2>
          <p>ResQGrid brings incident records, priority cues, location context and operator references into one workspace for disaster-response coordination.</p>
        </div>
      </section>

      <section className="about-workflow" aria-labelledby="about-workflow-title">
        <div className="reference-section-heading">
          <div><h2 id="about-workflow-title">How the workspace is organized</h2><p>Operational pages sit alongside static reference material.</p></div>
        </div>
        <ol>
          <li><span>1</span><p>Review incident activity, priority reports and mapped locations.</p><Link to="/dashboard">Go to dashboard <span aria-hidden="true">→</span></Link></li>
          <li><span>2</span><p>Open reports, check details and follow the status lifecycle.</p><Link to="/incidents">Go to incidents <span aria-hidden="true">→</span></Link></li>
          <li><span>3</span><p>Find hazard guidance, official contacts and severity definitions.</p><Link to="/protocols">Browse protocols <span aria-hidden="true">→</span></Link></li>
        </ol>
      </section>

      <PageIntro tone="neutral">
        <strong>Operational support, not an emergency service.</strong>
        <p>ResQGrid does not replace official warnings, emergency numbers or notified government procedures. Use 112 for immediate danger and follow your department’s approved SOPs.</p>
      </PageIntro>

      <SourceLinks links={[
        { href: OFFICIAL_LINKS.mha112, label: 'Emergency Response Support System (112)' },
        { href: OFFICIAL_LINKS.stateHelpdesk, label: 'NDMA SACHET helpdesk' },
      ]} />
    </div>
  );
}
