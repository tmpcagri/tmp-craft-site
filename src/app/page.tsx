import BackgroundTexture from "./background-texture";
import CommunitySlider from "./community-slider";
import Footer from "./footer";
import HeroSlider from "./hero-slider";
import HillsBackground from "./hills-background";
import InfoCards from "./info-cards";
import { getCurrentUser } from "./lib/auth";
import { getSiteContent } from "./lib/content";
import Navbar from "./navbar";
import SecondarySlider from "./secondary-slider";
import TopRightControls from "./top-right-controls";

export default async function Home() {
  const content = getSiteContent();
  const user = await getCurrentUser();

  return (
    <div className="relative w-full">
      <HillsBackground />
      <BackgroundTexture />
      <Navbar
        className="text-black dark:text-white"
        logoText={content.navbar.logoText}
        navLinks={content.footerLinks}
      />
      <TopRightControls user={user} />

      <section className="relative z-10 flex w-full items-center justify-center pb-4 pt-24">
        <HeroSlider />
      </section>

      <SecondarySlider />
      <InfoCards cards={content.infoCards} />
      <CommunitySlider />
      <Footer logoText={content.navbar.logoText} links={content.footerLinks} />
    </div>
  );
}
