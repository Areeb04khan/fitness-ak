import { google } from "@ai-sdk/google";

/**
 * Returns a Gemini model via the @ai-sdk/google provider.
 * Reads GOOGLE_GENERATIVE_AI_API_KEY from the environment automatically.
 */
export function createGeminiModel(modelId = "gemini-2.5-flash") {
  return google(modelId);
}
