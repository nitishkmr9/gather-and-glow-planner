import { createServerFn } from "@tanstack/react-start";
import { inputSchema } from "./plan-schema";

export const createPlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }) => {
    const { generatePlan } = await import("./planner.server");
    return generatePlan(data);
  });
