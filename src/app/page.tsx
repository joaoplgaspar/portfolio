import HeroBatman from "@/components/sections/HeroBatman";
import SobreBatcave from "@/components/sections/SobreBatcave";
import SkillsBatcave from "@/components/sections/SkillsBatcave";
import ProjetosLego from "@/components/sections/ProjetosLego";
import ContatoBatsignal from "@/components/sections/ContatoBatsignal";
import Footer from "@/components/layout/Footer";
import SectionSeam from "@/components/ui/SectionSeam";

export default function Home() {
  return (
    <main>
      <HeroBatman />
      <SectionSeam from="#06070b" to="#0c0c14" />
      <SobreBatcave />
      <SectionSeam from="#02040a" to="#0a0b10" />
      <SkillsBatcave />
      <SectionSeam from="#0a0b10" to="#14161f" />
      <ProjetosLego />
      <SectionSeam from="#14161f" to="#0a0b10" />
      <ContatoBatsignal />
      <Footer />
    </main>
  );
}
