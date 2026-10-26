import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AssistantPanel, PageHeader } from "@/components/AssistantPanel";

export const Route = createFileRoute("/stadium")({
  head: () => ({
    meta: [
      { title: "Stadium Companion — Skip queues & move smarter | Fête" },
      { name: "description", content: "Live wait times, crowd levels and an AI concierge for large sporting venues." },
      { property: "og:title", content: "Stadium Companion" },
      { property: "og:description", content: "Live waits, crowd flow and an AI concierge for match day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Stadium,
});

const SPOTS = ["Gate A", "Gate B", "Gate C", "Food court North", "Food court South", "Restrooms L1", "Restrooms L2", "Merch store", "Metro exit"];
const rand = () => SPOTS.map((s) => ({ s, wait: Math.round(Math.random() * 25), crowd: Math.round(20 + Math.random() * 80) }));

function Stadium() {
  const [data, setData] = useState<{ s: string; wait: number; crowd: number }[]>([]);
  const [seat, setSeat] = useState("Section 214, Row K");
  useEffect(() => { setData(rand()); const t = setInterval(() => setData(rand()), 8000); return () => clearInterval(t); }, []);
  const context = `Attendee seat: ${seat}. Live venue snapshot (simulated): ` + data.map((d) => `${d.s}: ${d.wait} min wait, ${d.crowd}% crowded`).join("; ");

  return (
    <main>
      <PageHeader eyebrow="Stadium companion" title="Less queueing," accent="more cheering." sub="Live wait times and crowd levels across the venue, with an AI concierge that plans your next move." />
      <div className="mx-auto grid max-w-6xl gap-8 px-6 pb-20 lg:grid-cols-[1fr_1fr]">
        <div className="panel h-fit">
          <div className="flex items-center justify-between"><h3 className="sec">Live venue</h3><span className="tag">Demo data · refreshes 8s</span></div>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your seat<input className="inp mt-1" value={seat} onChange={(e) => setSeat(e.target.value)} /></label>
          <ul className="mt-4 space-y-3">
            {data.map((d) => (
              <li key={d.s}>
                <div className="flex justify-between text-sm"><span className="font-medium">{d.s}</span><span className={d.wait > 15 ? "text-destructive" : ""}>{d.wait} min</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${d.crowd}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
        <AssistantPanel id="stadium" name="Venue concierge" context={context}
          suggestions={["Quickest food with shortest wait?", "Best gate to leave after the match", "Meet my friends at halftime", "Step-free route to my seat"]} />
      </div>
    </main>
  );
}
