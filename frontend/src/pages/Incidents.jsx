import { Filter, Plus, TriangleAlert } from "lucide-react";

const incidents = [
  ["INC-0241", "Urban flooding", "Riverside district", "Critical", "10 min ago"],
  ["INC-0240", "Building fire", "Market road", "High", "28 min ago"],
  ["INC-0239", "Road accident", "NH-48 junction", "Medium", "1 hour ago"],
  ["INC-0238", "Power outage", "North zone", "Low", "2 hours ago"],
];

export default function Incidents() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-blue-700">Operations</p><h1 className="mt-1 text-2xl font-bold">Incidents</h1><p className="mt-1 text-sm text-slate-500">Monitor and coordinate active emergency reports.</p></div><button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white"><Plus size={16} /> Report incident</button></div>
      <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-xl border border-rose-100 bg-rose-50 p-4"><p className="text-sm text-rose-700">Critical</p><p className="mt-1 text-2xl font-bold text-rose-800">3</p></div><div className="rounded-xl border border-amber-100 bg-amber-50 p-4"><p className="text-sm text-amber-700">In progress</p><p className="mt-1 text-2xl font-bold text-amber-800">8</p></div><div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Resolved today</p><p className="mt-1 text-2xl font-bold">17</p></div></div>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 p-4"><div className="flex items-center gap-2 font-semibold"><TriangleAlert size={18} className="text-rose-600" /> Active reports</div><button className="inline-flex items-center gap-2 text-sm text-slate-600"><Filter size={16} /> Filter</button></div><div className="overflow-x-auto"><table className="w-full min-w-[42.5rem] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["ID", "Incident", "Location", "Priority", "Updated"].map((head) => <th key={head} className="px-5 py-3 font-medium">{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{incidents.map(([id, type, place, priority, time]) => <tr key={id}><td className="px-5 py-4 font-medium text-blue-700">{id}</td><td className="px-5 py-4 font-medium text-slate-800">{type}</td><td className="px-5 py-4 text-slate-500">{place}</td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{priority}</span></td><td className="px-5 py-4 text-slate-500">{time}</td></tr>)}</tbody></table></div></section>
    </div>
  );
}
