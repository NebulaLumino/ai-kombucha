import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { scobyHealth, batchSize, flavorDirection, roomTemp } = await req.json();
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert kombucha and fermented tea brewing assistant. Provide detailed brew timelines, pH testing schedules, second fermentation tips, and troubleshooting advice for kombucha. Use markdown with clear sections.`,
        },
        {
          role: "user",
          content: `Help me brew kombucha:\n- SCOBY health: ${scobyHealth}\n- Batch size: ${batchSize}\n- Flavor direction: ${flavorDirection}\n- Room temperature: ${roomTemp}°F\n\nProvide:\n1. Detailed brew timeline (first ferment)\n2. pH testing schedule\n3. Second fermentation tips and carbonation guidance\n4. Troubleshooting for flat/sour/mouldy batches\n5. Flavoring recommendations for ${flavorDirection}`,
        },
      ],
      temperature: 0.7,
    });
    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
