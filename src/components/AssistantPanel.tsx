import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ask } from "@/lib/assistant.functions";
import type { AssistantId } from "@/lib/assistant-config";

export function AssistantPanel({ id, name, suggestions, context = "" }: { id: AssistantId; name: string; suggestions: string[]; context?: string }) {
  const [q, setQ] = useState("");
  const [log, setLog] = useState<{ q: string; a: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setLoading(true); setError(""); setQ("");
    try {
      const r = await ask({ data: { id, prompt: text, context } });
      setLog((l) => [{ q: text, a: r.text }, ...l]);
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); setQ(text); }
    finally { setLoading(false); }
  }

  return (
    <div className="panel">
      <h3 className="sec">{name}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => <button key={s} type="button" onClick={() => send(s)} className="chip flex-none px-3">{s}</button>)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(q); }} className="mt-4 flex gap-2">
        <input className="inp" placeholder="Ask anything…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button disabled={loading} className="cta px-5">{loading ? "…" : "Ask"}</button>
      </form>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      {loading && <p className="mt-4 animate-pulse text-sm text-muted-foreground">Thinking…</p>}
      <div className="mt-4 space-y-5">
        {log.map((m, i) => (
          <div key={i}>
            <p className="text-sm font-semibold text-primary">{m.q}</p>
            <div className="prose-lite mt-1"><ReactMarkdown>{m.a}</ReactMarkdown></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, accent, sub }: { eyebrow: string; title: string; accent: string; sub: string }) {
  return (
    <header className="mx-auto max-w-6xl px-6 pt-14 pb-10">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display mt-3 text-5xl md:text-6xl">{title} <em className="text-primary">{accent}</em></h1>
      <p className="mt-5 max-w-xl text-muted-foreground">{sub}</p>
    </header>
  );
}
