export default function ChapterTag({ number }: { number: string }) {
  return (
    <span className="inline-flex items-center gap-2 align-middle">
      <span className="font-display text-gradient">{number}</span>
      <span className="h-3 w-px bg-border" aria-hidden="true" />
    </span>
  );
}
