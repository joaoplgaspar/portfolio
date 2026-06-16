import HeroBatman from "@/components/sections/HeroBatman";
import SobreSubnautica from "@/components/sections/SobreSubnautica";
import SkillsBatcave from "@/components/sections/SkillsBatcave";
import ProjetosLego from "@/components/sections/ProjetosLego";
import ContatoBatsignal from "@/components/sections/ContatoBatsignal";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <HeroBatman />
      <SobreSubnautica />
      <SkillsBatcave />
      <ProjetosLego />
      <ContatoBatsignal />
      <Footer />
    </main>
  );
}
