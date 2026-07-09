import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "openai/gpt-5.5";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(MODEL);
}

async function run(system: string, prompt: string) {
  try {
    const { text } = await generateText({
      model: getModel(),
      system,
      prompt,
    });
    return { text };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg.includes("429")) throw new Error("Rate limit reached. Please wait a moment and try again.");
    if (msg.includes("402")) throw new Error("AI credits exhausted. Please add credits to your Lovable workspace.");
    throw new Error(msg);
  }
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        recipient: z.string().optional().default(""),
        subject: z.string().optional().default(""),
        tone: z.enum(["Formal", "Friendly", "Persuasive"]),
        context: z.string().min(1),
      })
      .parse(d),
  )
  .handler(async ({ data }) =>
    run(
      "You are an expert professional email writer. Produce polished, ready-to-send emails. Return only the email (subject line + body), no commentary.",
      `Write a ${data.tone.toLowerCase()} email.\nRecipient: ${data.recipient || "(unspecified)"}\nSubject hint: ${data.subject || "(let the model decide)"}\nContext / what to convey:\n${data.context}`,
    ),
  );

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ notes: z.string().min(1) }).parse(d))
  .handler(async ({ data }) =>
    run(
      "You summarize meeting notes. Output clean Markdown with sections: ## Summary, ## Key Decisions, ## Action Items (with owner + deadline when present), ## Deadlines. Be concise and factual.",
      data.notes,
    ),
  );

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        tasks: z.string().min(1),
        horizon: z.enum(["Day", "Week"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) =>
    run(
      "You are a productivity coach. Build a realistic prioritized schedule in Markdown. Use Eisenhower-style prioritization (P1..P4), include time blocks, buffer time, and a short rationale at the end.",
      `Horizon: ${data.horizon}\nTasks & context:\n${data.tasks}`,
    ),
  );

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ topic: z.string().min(1) }).parse(d))
  .handler(async ({ data }) =>
    run(
      "You are a research assistant. Produce a structured Markdown briefing with: ## Overview, ## Key Points (bulleted), ## Insights, ## Recommendations, ## Further Reading (topics to explore). Note when claims may need verification.",
      data.topic,
    ),
  );

export const chat = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        messages: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
          .min(1),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const { text } = await generateText({
        model: getModel(),
        system:
          "You are a helpful, concise workplace productivity assistant. Give practical, actionable answers. Use Markdown when it helps readability.",
        messages: data.messages,
      });
      return { text };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      throw new Error(msg);
    }
  });
