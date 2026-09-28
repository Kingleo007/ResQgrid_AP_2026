import { ArrowRight, Radio } from "lucide-react";
import { Link } from "react-router-dom";

export default function AnnouncementBar() {
  return (
    <div className="bg-blue-100 px-4 py-2.5 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm sm:gap-x-4">
        <span className="inline-flex items-center gap-2 font-semibold">
          <Radio aria-hidden="true" size={16} className="text-orange-600" />
          Grid is Live
        </span>
        <span aria-label="India" role="img" className="text-base">🇮🇳</span>
        <Link
          to="/about"
          className="inline-flex items-center gap-1 font-medium text-blue-800 transition hover:text-blue-950"
        >
          Know more about it <ArrowRight aria-hidden="true" size={15} />
        </Link>
      </div>
    </div>
  );
}
