import Footer from "./footer";
import HillsBackground from "./hills-background";
import InfoCards from "./info-cards";
import Navbar from "./navbar";
import TopControls from "./top-controls";

export default function Home() {
  return (
    <div className="relative w-full">
      <HillsBackground />
      <Navbar className="text-black dark:text-white" />
      <TopControls />

      <section className="relative z-10 min-h-screen w-full" />

      <InfoCards />
      <Footer />
    </div>
  );
}
