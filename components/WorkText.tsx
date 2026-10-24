/** A literal preview, never a summary. The complete stored text stays available. */
export default function WorkText({ text, label, limit = 220, className }: { text: string; label: string; limit?: number; className?: string }) {
  return <div className={className}>
    <p>{text.length > limit ? `${text.slice(0, limit)}…` : text}</p>
    {text.length > limit && <details><summary>Read full {label}</summary><p>{text}</p></details>}
  </div>;
}
