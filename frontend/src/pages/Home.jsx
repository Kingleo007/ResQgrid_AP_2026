import AnnouncementBar from "../components/AnnouncementBar.jsx";
import HomeHero from "../components/HomeHero.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import ImpactStats from "../components/ImpactStats.jsx";
import SiteHeader from "../components/SiteHeader.jsx";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <HomeHero />
        <ImpactStats />
        <HowItWorks />
      </main>
    </>
  );
}
