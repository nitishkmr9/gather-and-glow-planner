import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AssistantPanel, PageHeader } from "@/components/AssistantPanel";

export const Route = createFileRoute("/worldcup")({
  head: () => ({
    meta: [
      { title: "World Cup 2026 Matchday AI — Fans, volunteers & ops | Fête" },
      { name: "description", content: "GenAI assistant for FIFA World Cup 2026 stadiums: navigation, crowds, accessibility, transport and live decisions in any language." },
      { property: "og:title", content: "World Cup 2026 Matchday AI" },
      { property: "og:description", content: "Multilingual GenAI support for fans, volunteers, staff and organizers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldCup,
});

const ROLES = ["Fan", "Volunteer", "Venue staff", "Organizer"] as const;
const LANGS = ["English", "Español", "Français", "Português", "العربية", "हिन्दी", "日本語"];
const VENUES = ["MetLife Stadium (NY/NJ)", "Estadio Azteca (Mexico City)", "BC Place (Vancouver)", "SoFi Stadium (LA)", "AT&T Stadium (Dallas)"];
const PROMPTS: Record<(typeof ROLES)[number], string[]> = {
  Fan: ["How do I get to the stadium by transit?", "Find accessible seating and services", "Where's the least crowded entrance now?"],
  Volunteer: ["Brief me for my shift at Gate 3", "How do I help a lost child?", "Translate directions for a fan"],
  "Venue staff": ["Which zones need extra staff right now?", "Draft a PA announcement for gate congestion", "Accessibility incident checklist"],
  Organizer: ["Summarize current operational risks", "Recommend crowd-flow actions for egress", "Sustainability wins for this match"],
};

const snap = () => ({
  attendance: 70000 + Math.round(Math.random() * 12000),
  gates: ["North", "South", "East", "West"].map((g) => ({ g, load: Math.round(30 + Math.random() * 70) })),
  transit: Math.round(5 + Math.random() * 20),
  incidents: Math.round(Math.random() * 4),
});

function WorldCup() {
  const [role, setRole] = useState<(typeof ROLES)[number]>("Fan");
  const [lang, setLang] = useState("English");
  const [venue, setVenue] = useState(VENUES[0]);
  const [s, setS] = useState<ReturnType<typeof snap> | null>(null);
  useEffect(() => { setS(snap()); const t = setInterval(() => setS(snap()), 10000); return () => clearInterval(t); }, []);
  const context = `Role: ${role}. Reply language: ${lang}. Venue: ${venue}. Simulated live snapshot: ${s ? `attendance ${s.attendance}; gate loads ${s.gates.map((g) => `${g.g} ${g.load}%`).join(", ")}; next transit departure wait ${s.transit} min; open incidents ${s.incidents}` : "loading"}.`;

  return (
    <main>
      <PageHeader eyebrow="FIFA World Cup 2026 · Matchday AI" title="One assistant," accent="every role." sub="Navigation, crowd management, accessibility, transport and live decision support — in your language." />
      <div className="mx-auto grid max-w-6xl gap-8 px-6 pb-20 lg:grid-cols-[1fr_1fr]">
        <div className="panel h-fit space-y-5">
          <div className="flex gap-2">{ROLES.map((r) => <button key={r} type="button" onClick={() => setRole(r)} className={`chip ${role === r ? "chip-on" : ""}`}>{r}</button>)}</div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Venue<select className="inp mt-1" value={venue} onChange={(e) => setVenue(e.target.value)}>{VENUES.map((v) => <option key={v}>{v}</option>)}</select></label>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Language<select className="inp mt-1" value={lang} onChange={(e) => setLang(e.target.value)}>{LANGS.map((v) => <option key={v}>{v}</option>)}</select></label>
          </div>
          {s && (
            <div>
              <div className="flex items-center justify-between"><h3 className="sec">Live ops</h3><span className="tag">Demo data</span></div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-muted p-3"><p className="display text-2xl">{(s.attendance / 1000).toFixed(1)}k</p><p className="text-xs text-muted-foreground">in venue</p></div>
                <div className="rounded-lg bg-muted p-3"><p className="display text-2xl">{s.transit}m</p><p className="text-xs text-muted-foreground">transit wait</p></div>
                <div className="rounded-lg bg-muted p-3"><p className="display text-2xl">{s.incidents}</p><p className="text-xs text-muted-foreground">incidents</p></div>
              </div>
              <ul className="mt-4 space-y-3">{s.gates.map((g) => (
                <li key={g.g}><div className="flex justify-between text-sm"><span>{g.g} gate</span><span className={g.load > 80 ? "text-destructive" : ""}>{g.load}%</span></div>
                  <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${g.load}%` }} /></div></li>
              ))}</ul>
            </div>
          )}
        </div>
        <AssistantPanel key={role} id="worldcup" name={`${role} assistant`} context={context} suggestions={PROMPTS[role]} />
      </div>
    </main>
  );
}
