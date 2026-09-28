import { Activity, Ambulance, House, TriangleAlert } from "lucide-react";

const stats = [
  { label: "Active incidents", value: "12", detail: "3 need immediate action", icon: TriangleAlert, tone: "text-rose-600 bg-rose-50" },
  { label: "Rescue teams deployed", value: "8", detail: "24 responders on duty", icon: Activity, tone: "text-blue-600 bg-blue-50" },
  { label: "Shelter capacity", value: "1,280", detail: "68% currently available", icon: House, tone: "text-emerald-600 bg-emerald-50" },
  { label: "Hospital availability", value: "42", detail: "beds available nearby", icon: Ambulance, tone: "text-violet-600 bg-violet-50" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-blue-700">Overview</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Emergency dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">A quick view of the current response network.</p>
        </div>
        <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">System operational</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, detail, icon: Icon, tone }) => (
          <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <span className={`rounded-lg p-2 ${tone}`}><Icon size={18} /></span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{detail}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div><h2 className="font-semibold text-slate-900">Response activity</h2><p className="mt-1 text-sm text-slate-500">Last 24 hours</p></div>
            <button className="text-sm font-medium text-blue-700">View details</button>
          </div>
          <div className="mt-8 flex h-36 items-end gap-3 border-b border-slate-100 pb-1">
            {[38, 54, 35, 68, 48, 82, 58, 72, 45, 64, 52, 88].map((height, index) => <div key={index} className="flex-1 rounded-t bg-blue-500/80" style={{ height: `${height}%` }} />)}
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">Priority alerts</h2>
          <div className="mt-4 space-y-3">
            {[["Flood warning", "Riverside district", "High"], ["Road blockage", "NH-48 corridor", "Medium"], ["Power outage", "North zone", "Low"]].map(([title, place, level]) => <div key={title} className="rounded-lg border border-slate-100 p-3"><div className="flex justify-between gap-2"><p className="text-sm font-medium text-slate-800">{title}</p><span className="text-xs text-slate-500">{level}</span></div><p className="mt-1 text-xs text-slate-500">{place}</p></div>)}
          </div>
        </section>
      </div>
    </div>
  );
}
