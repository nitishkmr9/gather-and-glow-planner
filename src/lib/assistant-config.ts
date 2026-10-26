export const ASSISTANT_IDS = ["stadium", "election", "carbon", "worldcup"] as const;
export type AssistantId = (typeof ASSISTANT_IDS)[number];
