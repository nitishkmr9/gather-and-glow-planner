import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ASSISTANT_IDS } from "./assistant-config";

const schema = z.object({
  id: z.enum(ASSISTANT_IDS),
  prompt: z.string().min(1).max(2000),
  context: z.string().max(4000),
});

export const ask = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const { askAssistant } = await import("./assistant.server");
    return { text: await askAssistant(data.id, data.prompt, data.context) };
  });
