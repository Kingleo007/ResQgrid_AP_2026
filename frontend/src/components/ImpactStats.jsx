import { Activity, Layers3, Radio } from "lucide-react";

const stats = [
  {
    value: "01",
    title: "shared response view",
    detail: "Incidents, teams and safe locations in one place.",
    icon: Layers3,
  },
  {
    value: "03",
    title: "response essentials",
    detail: "Incident awareness, team coordination and safe locations.",
    icon: Activity,
  },
  {
    value: "LIVE",
    title: "situational updates",
    detail: "A clearer picture as response activity changes.",
    icon: Radio,
  },
];

export default function ImpactStats() {
  return (
    <section aria-labelledby="impact-heading" className="bg-white px-5 py-16 text-slate-900 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Impact at a glance</p>
          <h2 id="impact-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            One grid. A more coordinated response.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Put the information people need to respond in a shared, easy-to-follow view.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 md:grid-cols-3">
          {stats.map(({ value, title, detail, icon: Icon }, index) => (
            <article
              key={title}
              className={`relative p-6 sm:p-8 ${index > 0 ? "border-t border-slate-200 md:border-t-0 md:border-l" : ""}`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
                  {value}
                </p>
                <span className="flex size-11 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/80">
                  <Icon aria-hidden="true" size={20} />
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold capitalize text-slate-900">{title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">{detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
