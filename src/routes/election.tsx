import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AssistantPanel, PageHeader } from "@/components/AssistantPanel";

export const Route = createFileRoute("/election")({
  head: () => ({
    meta: [
      { title: "Election Guide — How voting works, step by step | Fête" },
      { name: "description", content: "An interactive, non-partisan guide to the election process, timelines and steps to vote." },
      { property: "og:title", content: "Election Guide" },
      { property: "og:description", content: "Understand registration, timelines and voting day, step by step." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Election,
});

const STEPS = [
  { t: "Check eligibility", d: "Confirm age, citizenship and residency requirements in your area." },
  { t: "Register to vote", d: "Enroll on the electoral roll before the deadline — often weeks before polling day." },
  { t: "Verify your details", d: "Check your name, address and polling station on the official voter list." },
  { t: "Know the candidates", d: "Read manifestos and official candidate information from neutral sources." },
  { t: "Plan your vote", d: "Pick in-person, early or postal voting, and gather accepted ID." },
  { t: "Cast your ballot", d: "Visit your polling station on time and follow the voting procedure." },
  { t: "Counting & results", d: "Votes are counted under observation and results officially declared." },
];

function Election() {
  const [active, setActive] = useState(0);
  const [done, setDone] = useState<boolean[]>(STEPS.map(() => false));
  const [country, setCountry] = useState("India");
  const s = STEPS[active] ?? STEPS[0]!;

  return (
    <main>
      <PageHeader eyebrow="Election guide" title="Your vote," accent="step by step." sub="Walk through the election process and ask the assistant anything — neutral, simple and tailored to your country." />
      <div className="mx-auto grid max-w-6xl gap-8 px-6 pb-20 lg:grid-cols-[1fr_1fr]">
        <div className="panel h-fit">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Country<input className="inp mt-1" value={country} onChange={(e) => setCountry(e.target.value)} /></label>
          <p className="mt-4 text-sm text-muted-foreground">{done.filter(Boolean).length} of {STEPS.length} steps done</p>
          <ol className="mt-3 space-y-2">
            {STEPS.map((st, i) => (
              <li key={st.t} className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4 accent-[var(--primary)]" checked={done[i]} onChange={(e) => setDone((d) => d.map((v, j) => (j === i ? e.target.checked : v)))} />
                <button type="button" onClick={() => setActive(i)} className={`text-left ${active === i ? "font-semibold text-primary" : ""}`}>{i + 1}. {st.t}</button>
              </li>
            ))}
          </ol>
          <div className="idea panel mt-5">
            <p className="display text-xl">{s.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        </div>
        <AssistantPanel id="election" name="Ask the civic guide" context={`Country: ${country}. User is currently on step: ${s.t}.`}
          suggestions={[`Explain "${s.t}" for ${country}`, "What's the typical election timeline?", "What ID do I need?", "How are votes counted?"]} />
      </div>
    </main>
  );
}
