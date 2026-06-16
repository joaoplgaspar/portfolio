import HeroBatman from "@/components/sections/HeroBatman";
import SobreSubnautica from "@/components/sections/SobreSubnautica";
import SkillsBatcave from "@/components/sections/SkillsBatcave";
import ProjetosLego from "@/components/sections/ProjetosLego";
import ContatoBatsignal from "@/components/sections/ContatoBatsignal";
import Footer from "@/components/layout/Footer";
import SectionSeam from "@/components/ui/SectionSeam";

export default function Home() {
  return (
    <main>
      <HeroBatman />
      <SectionSeam from="#06070b" to="#0e5f70" />
      <SobreSubnautica />
      <SectionSeam from="#01070f" to="#0a0b10" />
      <SkillsBatcave />
      <SectionSeam from="#0a0b10" to="#14161f" />
      <ProjetosLego />
      <SectionSeam from="#14161f" to="#0a0b10" />
      <ContatoBatsignal />
      <Footer />
    </main>
  );
}
