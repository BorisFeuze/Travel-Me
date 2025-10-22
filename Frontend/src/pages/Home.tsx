import { useEffect, useState } from "react";
import heroBg from "@/assets/images/image1.jpg"; // or ../../assets/images/image1.jpg
import {
  Filters,
  Heroheader,
  Features,
  TopHosts,
  Continents,
  Countries,
  Requiredskills,
  Joinus,
  Footer,
} from "@/components/UI";

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
      {/*Filters*/}
      <Filters />

      {/* HERO */}
      <Heroheader
        eyebrow="Travele & Work"
        title="Explore the World by Travel-Me"
        // subtitle="Discover your next adventure during working hours!"
        // primaryCta={{ label: "Explore now", href: "/countrylist" }}
        primaryCta={{ label: "Explore now", href: "/countrydetails" }}
        align="center"
        bgImageUrl={heroBg} // ← pass the imported URL
        overlayOpacity={0.45}
        media={{ type: "image", src: heroBg, alt: "Travel dashboard preview" }} // ← same here
      />

      {/* add main Features Section */}
      <Features />

      {/* Top hosts Scroller */}
      <TopHosts />

      {/* Display Continents */}
      <Continents />

      {/* Countries Grid */}
      <Countries />

      {/* Required skills/WORK TAGS */}
      <Requiredskills />

      {/* Join Us Section */}
      <Joinus />

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Home;
