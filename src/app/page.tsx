import Evidence from "@/components/Evidence";
import { Film, MakingOf } from "@/components/Film";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Log from "@/components/Log";
import Nav from "@/components/Nav";
import Scene from "@/components/Scene";
import Tape from "@/components/Tape";
import Team from "@/components/Team";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top" className="overflow-x-clip">
        <Hero />
        <div className="relative z-10 -my-6 -rotate-2 sm:-my-8">
          <Tape text="Crime scene — do not cross" />
        </div>
        <Scene />
        <Film />
        <div className="relative z-10 rotate-1">
          <Tape text="Evidence — handle with care" reverse />
        </div>
        <Evidence />
        <MakingOf />
        <Log />
        <Team />
      </main>
      <Footer />
    </>
  );
}
