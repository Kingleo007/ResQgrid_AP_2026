import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function TeamCarousel({ members }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const member = members[activeIndex];

  function selectMember(index) {
    setActiveIndex((index + members.length) % members.length);
    setImageFailed(false);
  }

  return (
    <div
      className="relative mx-auto w-full min-w-0 max-w-[680px]"
      role="region"
      aria-roledescription="carousel"
      aria-label="ResQGrid team member introductions"
    >
      <div className="grid min-w-0 grid-cols-1 items-center gap-x-8 gap-y-5 sm:grid-cols-[1.15fr_0.85fr] lg:gap-x-9">
        <figure className="relative min-w-0">
          <div className="relative overflow-hidden bg-slate-100">
            {!imageFailed ? (
              <img
                key={member.id}
                src={member.image}
                alt={`Illustrative placeholder portrait for ${member.name}; this is not an actual ResQGrid team photo.`}
                onError={() => setImageFailed(true)}
                className="block aspect-[4/4.5] w-full object-cover object-center"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="flex aspect-[4/4.5] items-center justify-center bg-gradient-to-br from-orange-100 via-slate-100 to-emerald-100 text-7xl font-semibold text-slate-400" aria-hidden="true">
                {member.name.split(" ").map((part) => part[0]).join("")}
              </div>
            )}
            <button
              type="button"
              onClick={() => selectMember(activeIndex - 1)}
              aria-label="Show previous team member"
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition-colors hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              <ChevronLeft aria-hidden="true" size={20} />
            </button>
            <button
              type="button"
              onClick={() => selectMember(activeIndex + 1)}
              aria-label="Show next team member"
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition-colors hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <ChevronRight aria-hidden="true" size={20} />
            </button>
          </div>
          <figcaption className="mt-2 text-center text-[11px] text-slate-500">
            Illustrative placeholder portrait · not an actual team photo
          </figcaption>
        </figure>

        <div className="flex min-w-0 flex-col justify-center py-1 sm:py-4">
          <div aria-live="polite" aria-atomic="true">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">{member.role}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{member.name}</h2>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">{member.description}</p>
          <div className="mt-6 flex items-center gap-2" aria-label={`Team member ${activeIndex + 1} of ${members.length}`}>
            {members.map((person, index) => (
              <button
                key={person.id}
                type="button"
                onClick={() => selectMember(index)}
                aria-label={`Show ${person.name}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all ${activeIndex === index ? "w-7 bg-orange-600" : "w-1.5 bg-slate-300 hover:bg-emerald-500"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
