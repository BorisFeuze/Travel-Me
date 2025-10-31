import { useEffect, useState } from "react";
import heroBg from "@/assets/images/image1.jpg"; // or ../../assets/images/image1.jpg
import {
  Heroheader,
  Features,
  TopHosts,
  Continents,
  Requiredskills,
  Joinus,
  Footer,
  JobFilterCard,
} from "@/components/UI";
import RightPanel from "@/components/UI/RightPanel";
import JobSectionsTabs from "@/components/UI/JobSelectionTab";

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
    <div className="min-h-screen bg-gray-100">
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
