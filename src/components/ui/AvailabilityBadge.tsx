export default function AvailabilityBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-label text-muted">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-lift opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-accent-lift" />
      </span>
      {label}
    </span>
  );
}
