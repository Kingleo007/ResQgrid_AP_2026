import { ArrowRight, ClipboardPlus, HeartHandshake, Waypoints } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Report",
    description: "An incident is reported with the details needed to understand what is happening and where help is needed.",
    outcome: "An incident enters the grid",
    icon: ClipboardPlus,
    accent: "text-orange-600 bg-orange-50 ring-orange-100",
  },
  {
    number: "02",
    title: "Coordinate",
    description: "Teams and available resources are coordinated around the incident and the needs on the ground.",
    outcome: "The response comes together",
    icon: Waypoints,
    accent: "text-blue-700 bg-blue-50 ring-blue-100",
  },
  {
    number: "03",
    title: "Support",
    description: "Help reaches the affected area while response progress stays clear to the people involved.",
    outcome: "Support reaches the community",
    icon: HeartHandshake,
    accent: "text-emerald-700 bg-emerald-50 ring-emerald-100",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="bg-slate-50 px-5 py-16 text-slate-900 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">How ResQGrid works</p>
          <h2 id="how-it-works-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            From the first report to support on the ground.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            One clear flow helps connect an incident with the people and resources ready to respond.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {steps.map(({ number, title, description, outcome, icon: Icon, accent }, index) => (
            <article key={number} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              {index < steps.length - 1 && (
                <ArrowRight aria-hidden="true" className="absolute -right-4 top-10 z-10 hidden rounded-full bg-slate-50 p-1 text-slate-400 lg:block" size={28} />
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold tracking-[0.16em] text-slate-400">STEP {number}</span>
                <span className={`flex size-12 items-center justify-center rounded-xl ring-1 ${accent}`}>
                  <Icon aria-hidden="true" size={22} />
                </span>
              </div>
              <h3 className="mt-7 text-2xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-3 min-h-18 text-sm leading-6 text-slate-600">{description}</p>
              <div className="mt-6 border-t border-slate-100 pt-4 text-sm font-medium text-slate-800">
                <span className="mr-2 text-blue-700">→</span>{outcome}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
