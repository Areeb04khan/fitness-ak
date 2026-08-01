import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Gemini via the Lovable AI Gateway (no user API key needed).
 */
export function createGeminiModel(modelId = "google/gemini-2.5-flash") {
  const gateway = createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: process.env["LOVABLE_API_KEY"]!,
  });
  return gateway(modelId);
}
