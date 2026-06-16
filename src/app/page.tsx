import HeroBatman from "@/components/sections/HeroBatman";
import SobreSubnautica from "@/components/sections/SobreSubnautica";
import SkillsFifa from "@/components/sections/SkillsFifa";
import ProjetosLego from "@/components/sections/ProjetosLego";
import ContatoBatsignal from "@/components/sections/ContatoBatsignal";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <HeroBatman />
      <SobreSubnautica />
      <SkillsFifa />
      <ProjetosLego />
      <ContatoBatsignal />
      <Footer />
    </main>
  );
}
