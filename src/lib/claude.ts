import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";
import { assessmentConfig } from "@/config";

let client: Anthropic | null = null;
function getClient() {
  if (!client) {
    // Reads ANTHROPIC_API_KEY from the environment. Server-side only.
    client = new Anthropic({ timeout: 110_000, maxRetries: 1 });
  }
  return client;
}

export class AiError extends Error {
  constructor(
    message: string,
    public readonly retryable: boolean,
  ) {
    super(message);
  }
}

/**
 * Calls Claude with structured JSON output, validates against the zod schema,
 * and retries once if the output is missing, truncated or invalid.
 */
export async function structuredCall<S extends z.ZodType>(opts: {
  system: string;
  user: string;
  schema: S;
  maxTokens: number;
  effort: "low" | "medium" | "high";
}): Promise<z.infer<S>> {
  const format = zodOutputFormat(opts.schema);
  let lastProblem = "unknown";

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await getClient().messages.parse({
        model: assessmentConfig.model,
        max_tokens: opts.maxTokens,
        system: opts.system,
        messages: [{ role: "user", content: opts.user }],
        output_config: { format, effort: opts.effort },
      });

      if (res.stop_reason === "refusal") {
        throw new AiError("The model declined to assess this input.", false);
      }
      if (res.stop_reason === "max_tokens") {
        lastProblem = "output truncated at max_tokens";
        continue;
      }

      const checked = opts.schema.safeParse(res.parsed_output);
      if (checked.success) return checked.data;
      lastProblem = `schema validation failed: ${checked.error.message.slice(0, 300)}`;
    } catch (err) {
      if (err instanceof AiError) throw err;
      if (err instanceof Anthropic.RateLimitError) {
        throw new AiError("AI service is busy. Please retry in a moment.", true);
      }
      if (err instanceof Anthropic.APIError) {
        // SDK already retried transient errors once; surface as retryable if server-side.
        const status = err.status ?? 0;
        console.error("[claude] API error", status, err.message);
        throw new AiError("AI service error.", status >= 500 || status === 0);
      }
      // JSON / zod parse errors thrown by messages.parse: retry once.
      lastProblem = err instanceof Error ? err.message : String(err);
    }
    console.warn(`[claude] attempt ${attempt} invalid output: ${lastProblem}`);
  }

  throw new AiError(`Invalid AI output after retry (${lastProblem})`, true);
}
