import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import TeamCarousel from "./TeamCarousel.jsx";
import { teamMembers } from "../data/teamMembers.js";

export default function HomeHero() {
  return (
    <section id="platform" className="overflow-hidden bg-white text-slate-900">
      <div className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:min-h-[660px] lg:grid-cols-[45fr_55fr] lg:gap-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="mb-6 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-emerald-800">
            <span className="h-px w-8 bg-orange-500" />
            ResQGrid · emergency coordination
          </p>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[4.25rem]">
            Emergency response,
            <span className="mt-1 block text-slate-900">coordinated<span className="text-orange-600">.</span></span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            ResQGrid brings incidents, response teams and safe locations together, helping communities act with clarity when every second counts.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-900/10 transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            >
              Explore ResQGrid <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link
              to="/about#how-it-works"
              className="rounded-lg px-3 py-3.5 text-sm font-semibold text-emerald-800 transition-colors hover:text-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Know More
            </Link>
          </div>
        </div>
        <TeamCarousel members={teamMembers} />
      </div>
    </section>
  );
}
