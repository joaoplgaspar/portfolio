export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="flex w-max gap-16 pr-16 animate-[marquee_30s_linear_infinite]">
        {row.map((item, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length}
            className="whitespace-nowrap font-display text-2xl font-medium text-muted/70"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
