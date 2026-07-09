import ReactMarkdown from "react-markdown";

export function AiOutput({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="prose-ai rounded-lg border border-border bg-card p-5 shadow-soft">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}
