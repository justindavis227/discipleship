import Hero from "./components/Hero";
import Philosophy from "./components/Philosophy";
import FourChairs from "./components/FourChairs";
import Resources from "./components/Resources";
import Mantras from "./components/Mantras";
import Quote from "./components/Quote";

export default function Home() {
  return (
    <>
      <Hero />
      <Quote />
      <Philosophy />
      <FourChairs />
      <Resources />
      <Mantras />
    </>
  );
}
