import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { createPlan } from "@/lib/planner.functions";
import type { Plan, PlanInput } from "@/lib/plan-schema";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fête — AI Event Planner for Weddings, Birthdays & Gatherings" },
      { name: "description", content: "Get a personalized budget, timeline, vendor checklist and ideas for your wedding, birthday or community event." },
      { property: "og:title", content: "Fête — AI Event Planner" },
      { property: "og:description", content: "Personalized budgets, timelines, vendor checklists and ideas in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TYPES: PlanInput["eventType"][] = ["Wedding", "Birthday", "Community event"];

function Index() {
  const [form, setForm] = useState<PlanInput>({
    eventType: "Wedding", title: "", date: "", guests: 100, budget: 500000, currency: "INR", location: "", vibe: "",
  });
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const set = <K extends keyof PlanInput>(k: K, v: PlanInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setPlan(null); setDone({});
    try { setPlan(await createPlan({ data: form })); }
    catch (err) { setError(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setLoading(false); }
  }

  const total = plan?.budget.reduce((s, b) => s + b.amount, 0) ?? 0;
  const fmt = (n: number) => `${form.currency} ${Math.round(n).toLocaleString()}`;

  return (
    <main className="min-h-screen">
      <header className="mx-auto max-w-6xl px-6 pt-14 pb-10">
        <p className="eyebrow">Fête · AI event planner</p>
        <h1 className="display mt-3 text-5xl md:text-7xl">Plan the day,<br /><em className="text-primary">not the panic.</em></h1>
        <p className="mt-5 max-w-xl text-muted-foreground">Tell us about your wedding, birthday or community gathering. Get a budget, timeline, vendor checklist and ideas made for you.</p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 pb-20 lg:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="panel h-fit space-y-4 lg:sticky lg:top-6">
          <div className="flex gap-2">
            {TYPES.map((t) => (
              <button type="button" key={t} onClick={() => set("eventType", t)} className={`chip ${form.eventType === t ? "chip-on" : ""}`}>{t}</button>
            ))}
          </div>
          <Field label="Event name"><input className="inp" placeholder="Aisha & Rohan's wedding" value={form.title} onChange={(e) => set("title", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><input type="date" className="inp" value={form.date} onChange={(e) => set("date", e.target.value)} /></Field>
            <Field label="Guests"><input type="number" min={1} className="inp" value={form.guests} onChange={(e) => set("guests", Number(e.target.value) || 1)} /></Field>
          </div>
          <div className="grid grid-cols-[1fr_90px] gap-3">
            <Field label="Total budget"><input type="number" min={0} className="inp" value={form.budget} onChange={(e) => set("budget", Number(e.target.value) || 0)} /></Field>
            <Field label="Currency"><input className="inp" value={form.currency} onChange={(e) => set("currency", e.target.value.toUpperCase())} /></Field>
          </div>
          <Field label="Location"><input className="inp" placeholder="Jaipur, outdoor" value={form.location} onChange={(e) => set("location", e.target.value)} /></Field>
          <Field label="Vibe & preferences"><textarea rows={3} className="inp" placeholder="Pastel florals, vegetarian menu, live music…" value={form.vibe} onChange={(e) => set("vibe", e.target.value)} /></Field>
          <button disabled={loading} className="cta w-full">{loading ? "Crafting your plan…" : "Create my plan"}</button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        <section className="min-w-0">
          {!plan && !loading && <div className="panel grid min-h-80 place-items-center text-center text-muted-foreground"><p className="display text-2xl">Your plan will appear here.</p></div>}
          {loading && <div className="panel min-h-80 animate-pulse"><p className="display text-2xl text-muted-foreground">Sketching budgets, booking imaginary florists…</p></div>}
          {plan && (
            <div className="space-y-6">
              <div className="panel">
                <h2 className="display text-3xl">{plan.headline}</h2>
                <p className="mt-2 text-muted-foreground">{plan.summary}</p>
              </div>

              <div className="panel">
                <div className="flex items-baseline justify-between"><h3 className="sec">Budget</h3><span className="text-sm text-muted-foreground">{fmt(total)}</span></div>
                <ul className="mt-4 space-y-3">
                  {plan.budget.map((b) => (
                    <li key={b.category}>
                      <div className="flex justify-between text-sm"><span className="font-medium">{b.category}</span><span>{fmt(b.amount)}</span></div>
                      <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${total ? (b.amount / total) * 100 : 0}%` }} /></div>
                      <p className="mt-1 text-xs text-muted-foreground">{b.note}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel">
                <h3 className="sec">Timeline</h3>
                <ol className="mt-4 space-y-5 border-l-2 border-border pl-5">
                  {plan.timeline.map((t) => (
                    <li key={t.when} className="relative">
                      <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-accent" />
                      <p className="font-semibold">{t.when}</p>
                      <ul className="mt-1 list-disc pl-4 text-sm text-muted-foreground">{t.tasks.map((x) => <li key={x}>{x}</li>)}</ul>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="panel">
                <h3 className="sec">Vendor checklist</h3>
                <ul className="mt-4 divide-y divide-border">
                  {plan.vendors.map((v) => (
                    <li key={v.vendor} className="flex gap-3 py-3">
                      <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--primary)]" checked={!!done[v.vendor]} onChange={(e) => setDone((d) => ({ ...d, [v.vendor]: e.target.checked }))} />
                      <div>
                        <p className={`font-medium ${done[v.vendor] ? "line-through text-muted-foreground" : ""}`}>{v.vendor} <span className="tag">{v.priority}</span></p>
                        <p className="text-sm text-muted-foreground">{v.tip}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="sec mb-4">Personalized ideas</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {plan.ideas.map((i) => (
                    <div key={i.title} className="panel idea"><p className="display text-xl">{i.title}</p><p className="mt-1 text-sm text-muted-foreground">{i.description}</p></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>;
}
