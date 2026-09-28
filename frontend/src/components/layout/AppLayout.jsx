import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  TriangleAlert,
  Map,
  House,
  Hospital,
  Users,
  ChartNoAxesCombined,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Incidents",
    path: "/incidents",
    icon: TriangleAlert,
  },
  {
    name: "Map",
    path: "/map",
    icon: Map,
  },
  {
    name: "Shelters",
    path: "/shelters",
    icon: House,
  },
  {
    name: "Hospitals",
    path: "/hospitals",
    icon: Hospital,
  },
  {
    name: "Rescue Teams",
    path: "/rescue-teams",
    icon: Users,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: ChartNoAxesCombined,
  },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <h1 className="text-xl font-bold text-blue-900">
              ResQGrid
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Emergency Response Platform
            </p>
          </div>

          <nav className="space-y-1 p-3">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-800"
                        : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Emergency Operations
              </p>
            </div>

            <div className="text-sm text-slate-500">
              ResQGrid System
            </div>
          </header>

          <section className="p-6">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}