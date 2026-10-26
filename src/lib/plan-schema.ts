import { z } from "zod";

export const inputSchema = z.object({
  eventType: z.enum(["Wedding", "Birthday", "Community event"]),
  title: z.string().max(120),
  date: z.string().max(40),
  guests: z.number().int().min(1).max(100000),
  budget: z.number().min(0).max(1e10),
  currency: z.string().max(8),
  location: z.string().max(120),
  vibe: z.string().max(600),
});
export type PlanInput = z.infer<typeof inputSchema>;

export const planSchema = z.object({
  headline: z.string(),
  summary: z.string(),
  budget: z.array(z.object({ category: z.string(), amount: z.number(), note: z.string() })),
  timeline: z.array(z.object({ when: z.string(), tasks: z.array(z.string()) })),
  vendors: z.array(z.object({ vendor: z.string(), priority: z.enum(["Essential", "Recommended", "Optional"]), tip: z.string() })),
  ideas: z.array(z.object({ title: z.string(), description: z.string() })),
});
export type Plan = z.infer<typeof planSchema>;
