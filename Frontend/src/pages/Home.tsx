import { useEffect, useState } from "react";

import {
  // Heroheader,
  // Features,
  TopHosts,
  // Continents,
  // Requiredskills,
  // Joinus,
  // Footer,
  JobFilterCard,
} from "@/components/UI";
// import RightPanel from "@/components/UI/RightPanel";
import JobSectionsTabs from "@/components/UI/JobSelectionTab";
import video from "@/assets/images/3018669-hd_1920_1080_24fps.mp4";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data or perform any side effects here
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen ">
      <div className="w-full mb-4 relative rounded-2xl overflow-hidden shadow-md border-2">
        {/* 🔹 Video di sfondo */}
        <video
          src={video} // <-- assicurati che sia nella cartella public/
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-48 sm:h-184 object-cover"
        ></video>

        {/* 🔹 Testo centrato sopra il video */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="flex flex-col">
            <h2 className="text-white text-xl sm:text-5xl font-semibold text-center">
              Your next adventure starts here!
            </h2>
            <h2 className="text-white text-md sm:text-3xl font-semibold text-center mt-3">
              Find the perfect job for your Trip
            </h2>
          </div>
        </div>
      </div>
      {/* NAV placeholder */}

      {/* HERO */}
      {/* <Heroheader
        eyebrow="Travele & Work"
        title="Explore the World by Travel-Me"
        // subtitle="Discover your next adventure during working hours!"
        // primaryCta={{ label: "Explore now", href: "/countrylist" }}
        primaryCta={{ label: "Explore now" }}
        align="center"
        bgImageUrl={heroBg} // ← pass the imported URL
        overlayOpacity={0.45}
        media={{ type: "image", src: heroBg, alt: "Travel dashboard preview" }} // ← same here
      /> */}

      {/* add main Features Section */}
      {/* <Features /> */}

      <JobFilterCard />
      {/* Top hosts Scroller */}
      {/* Display Continents */}

      <TopHosts />
      {/* Required skills/WORK TAGS */}
      <JobSectionsTabs />

      {/* Join Us Section */}
      {/* <Joinus /> */}

      {/* FOOTER */}
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
