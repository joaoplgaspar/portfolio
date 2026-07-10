import Reveal from "@/components/fx/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="max-w-2xl">
      <Reveal>
        <p className="text-label text-accent-lift">{eyebrow}</p>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="text-h2 mt-4">{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={140}>
          <p className="mt-4 text-lg text-muted">{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
