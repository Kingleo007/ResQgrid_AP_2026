// frontend/src/components/SampleBadge.jsx
// Small "SAMPLE" label shown on seeded/demo records to distinguish them from real data.

/**
 * Displays a "SAMPLE" badge for seed/demo records.
 */
export default function SampleBadge() {
  return (
    <span className="sample-badge" aria-label="Sample record" title="This is a seeded demo record">
      SAMPLE
    </span>
  );
}
