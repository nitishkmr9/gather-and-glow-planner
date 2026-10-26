import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import type { AssistantId } from "./assistant-config";

const SYSTEMS: Record<AssistantId, string> = {
  stadium:
    "You are a live venue concierge for attendees at large sporting stadiums. Help with fastest routes, gates, queue avoidance, food/restroom timing, meetups with friends, accessibility and leaving the venue. Use the live venue snapshot provided. Be brief, practical, use short bullet lists.",
  election:
    "You are a neutral, non-partisan civic educator explaining how elections work: eligibility, voter registration, timelines, ID, voting methods, counting and results. Never recommend candidates or parties. If the user's country is given, tailor to it and remind them to verify dates with the official election authority. Explain simply, step by step.",
  carbon:
    "You are a friendly sustainability coach. Using the user's footprint estimate, give personalized, realistic actions ranked by impact (estimated kg CO2e saved per year), easy wins first. Be encouraging and concise.",
  worldcup:
    "You are a GenAI operations and fan assistant for FIFA World Cup 2026 stadiums across the USA, Canada and Mexico. Adapt to the user's role (fan, volunteer, venue staff, organizer) and reply in their chosen language. Cover navigation, crowd management, accessibility, transport, sustainability and real-time decision support. When given a live snapshot, give clear, prioritized actions. Note that snapshot data is simulated.",
};

export async function askAssistant(id: AssistantId, prompt: string, context: string) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured.");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: SYSTEMS[id] + " Format answers in Markdown.",
    prompt: context ? `Context:\n${context}\n\nQuestion: ${prompt}` : prompt,
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
  return await result.text;
}
