import Image from "next/image";

/** O mesmo perfil nos quatro temas pagos. */
export default function Themes({
  items,
  fig,
  caption,
}: {
  items: { src: string; name: string }[];
  fig: string;
  caption: string;
}) {
  return (
    <figure>
      <div className="grid grid-cols-4 gap-3 lg:gap-6">
        {items.map((t) => (
          <div key={t.name}>
            <div className="rounded-[30px] border-[1.25px] border-fg bg-[var(--plate)] p-[6px]">
              <div className="relative overflow-hidden rounded-[24px]" style={{ aspectRatio: "430 / 787" }}>
                <Image src={t.src} alt="" fill sizes="(min-width: 1024px) 22vw, 24vw" className="object-cover object-top" />
              </div>
            </div>
            <p className="t-small mt-2 text-center">{t.name}</p>
          </div>
        ))}
      </div>
      <figcaption className="t-small mt-4">
        <span className="t-fig mr-2">{fig}</span>
        {caption}
      </figcaption>
    </figure>
  );
}
