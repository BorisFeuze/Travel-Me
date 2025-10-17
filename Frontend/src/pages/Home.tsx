import { useEffect, useState } from "react";
import {
  Filters,
  Heroheader,
  Joinus,
  Footer,
  Countries,
  Requiredskills,
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
      {/* HERO */}
      <Heroheader />

      {/*Filters*/}
      <Filters />

      {/* Top hosts Scroller */}
      {/* <TopHosts /> */}

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
