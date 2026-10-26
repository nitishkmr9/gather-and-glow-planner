import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AssistantPanel, PageHeader } from "@/components/AssistantPanel";
import { footprint, type Habits } from "@/lib/carbon";

export const Route = createFileRoute("/carbon")({
  head: () => ({
    meta: [
      { title: "Carbon Coach — Track & shrink your footprint | Fête" },
      { name: "description", content: "Estimate your yearly carbon footprint and get personalized, simple actions to reduce it." },
      { property: "og:title", content: "Carbon Coach" },
      { property: "og:description", content: "Understand, track and reduce your carbon footprint." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Carbon,
});

const FIELDS: { k: keyof Habits; label: string; max: number; unit: string }[] = [
  { k: "carKm", label: "Car travel", max: 1000, unit: "km / week" },
  { k: "flights", label: "Flights", max: 20, unit: "short flights / year" },
  { k: "kwh", label: "Electricity", max: 1000, unit: "kWh / month" },
  { k: "meatMeals", label: "Meat meals", max: 21, unit: "per week" },
  { k: "shopping", label: "New clothes & gadgets", max: 50, unit: "items / year" },
];

function Carbon() {
  const [h, setH] = useState<Habits>({ carKm: 100, flights: 2, kwh: 200, meatMeals: 5, shopping: 12 });
  const [done, setDone] = useState<string[]>([]);
  const r = footprint(h);
  const ACTIONS = ["Swap 2 car trips for transit/cycling", "Go meat-free 2 days a week", "Switch to LED & unplug standby", "Buy second-hand once a month"];

  return (
    <main>
      <PageHeader eyebrow="Carbon coach" title="Small swaps," accent="real impact." sub="Estimate your yearly footprint, track simple actions and get personalized tips." />
      <div className="mx-auto grid max-w-6xl gap-8 px-6 pb-20 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <div className="panel">
            <p className="text-sm text-muted-foreground">Estimated yearly footprint</p>
            <p className="display text-5xl text-primary">{(r.total / 1000).toFixed(1)} t CO₂e</p>
            <p className="text-xs text-muted-foreground">Global target by 2030: ~2.3 t per person</p>
            <div className="mt-5 space-y-4">
              {FIELDS.map((f) => (
                <label key={f.k} className="block">
                  <div className="flex justify-between text-sm"><span className="font-medium">{f.label}</span><span>{h[f.k]} {f.unit} · {Math.round(r.parts[f.k])} kg</span></div>
                  <input type="range" min={0} max={f.max} value={h[f.k]} onChange={(e) => setH({ ...h, [f.k]: Number(e.target.value) })} className="w-full accent-[var(--primary)]" />
                </label>
              ))}
            </div>
          </div>
          <div className="panel">
            <h3 className="sec">This week's actions</h3>
            <ul className="mt-3 space-y-2">
              {ACTIONS.map((a) => (
                <li key={a} className="flex items-center gap-3">
                  <input type="checkbox" className="h-4 w-4 accent-[var(--primary)]" checked={done.includes(a)} onChange={(e) => setDone((d) => (e.target.checked ? [...d, a] : d.filter((x) => x !== a)))} />
                  <span className={done.includes(a) ? "line-through text-muted-foreground" : ""}>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <AssistantPanel id="carbon" name="Your sustainability coach"
          context={`Estimated footprint ${Math.round(r.total)} kg CO2e/yr. Breakdown (kg/yr): ${FIELDS.map((f) => `${f.label} ${Math.round(r.parts[f.k])} (${h[f.k]} ${f.unit})`).join(", ")}. Actions done this week: ${done.join(", ") || "none"}.`}
          suggestions={["Give me my top 3 actions", "Where is my biggest impact?", "Plan a low-carbon week", "Explain my footprint simply"]} />
      </div>
    </main>
  );
}
