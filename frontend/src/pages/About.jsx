import { ArrowLeft, Radio, ShieldCheck, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import AnnouncementBar from "../components/AnnouncementBar.jsx";
import SiteHeader from "../components/SiteHeader.jsx";

const principles = [
  { icon: Radio, title: "One shared picture", body: "Bring reports and response updates into one place for a clearer view of what is happening." },
  { icon: UsersRound, title: "Connected responders", body: "Help response teams coordinate assignments and share progress across an incident." },
  { icon: ShieldCheck, title: "Safer communities", body: "Make shelters and other safe locations easier to discover during an emergency." },
];

export default function About() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="min-h-[calc(100vh-5rem)] bg-slate-50 px-5 py-16 text-slate-900 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"><ArrowLeft size={16} /> Back to home</Link>
          <p className="mt-10 text-sm font-semibold uppercase tracking-widest text-blue-700">About ResQGrid</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">A clearer way to coordinate emergency response.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">ResQGrid is being built to connect incident information, response teams and safe locations in one coordinated experience.</p>
          <div id="platform" className="mt-12 grid gap-4 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, body }, index) => (
              <article id={index === 1 ? "how-it-works" : index === 2 ? "response-network" : undefined} key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={21} /></span>
                <h2 className="mt-5 text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
