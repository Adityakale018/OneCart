import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Background from "../components/Background";
import Product from "./Product";
import OurPolicy from "../components/OurPolicy";
import NewLetterBox from "../components/NewLetterBox";
import Footer from "../components/Footer";

function Home() {
  const heroData = [
    { text1: "30% OFF Limited Offer", text2: "Style that speaks" },
    { text1: "Discover Bold Fashion", text2: "Limited Time Only!" },
    { text1: "Explore Best Collection", text2: "Shop Now!" },
    { text1: "Perfect Fashion Fit", text2: "Now on Sale!" },
  ];

  const [heroCount, setHeroCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount(prevCount => (prevCount === 3 ?  0 :  prevCount + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="w-full h-auto md:h-[700px] bg-[#fbe7eb]">
        <div className="w-full h-full flex flex-col-reverse md:flex-row max-w-[1600px] mx-auto">

          {/* LEFT - Hero Text */}
          <div className="w-full md:w-1/2 min-h-[400px] md:h-full bg-[#fbe7eb]">
            <Hero
              heroData={heroData[heroCount]}
              heroCount={heroCount}
              setHeroCount={setHeroCount}
            />
          </div>

          {/* RIGHT - Background Image */}
          <div className="w-full md:w-1/2 h-[400px] md:h-full">
            <Background heroCount={heroCount} />
          </div>
          
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="w-full bg-white max-w-[1600px] mx-auto pt-16">
        <Product />
      </section>

      {/* OTHER SECTIONS */}
      <section className="w-full bg-white max-w-[1600px] mx-auto">
        <OurPolicy />
      </section>

      <section className="w-full bg-white max-w-[1600px] mx-auto">
        <NewLetterBox />
      </section>

      <Footer />
    </div>
  );
}

export default Home;