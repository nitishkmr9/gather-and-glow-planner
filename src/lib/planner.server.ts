import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import { planSchema, type PlanInput } from "./plan-schema";

export async function generatePlan(input: PlanInput) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured.");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions:
      "You are an expert event planner. Produce a realistic, practical, personalized plan. Budget items must sum to roughly the total budget, in the user's currency. Timeline goes from now until the event day, ordered chronologically.",
    prompt: `Event type: ${input.eventType}
Name/occasion: ${input.title || "(none)"}
Date: ${input.date || "unspecified"}
Guests: ${input.guests}
Total budget: ${input.budget} ${input.currency}
Location: ${input.location || "unspecified"}
Style/vibe & preferences: ${input.vibe || "none given"}`,
    output: Output.object({ schema: planSchema }),
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  return await result.output;
}
