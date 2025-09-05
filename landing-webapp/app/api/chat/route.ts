import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Missing messages' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing OPENAI_API_KEY' }, { status: 500 });
    }

    // Enforce structured fact-check output
    const system = "You are a precise fact-checking assistant. For each user claim, return STRICT JSON only with this schema: {\n  verdict: 'true'|'false'|'unclear',\n  explanation: string,\n  sources: Array<{ name?: string, url: string }>,\n  suggestions?: Array<{ label: string, url: string, group?: string }>\n}.\nRules:\n- verdict must be exactly one of 'true','false','unclear'.\n- Keep explanation concise (<= 3 sentences).\n- Provide 2-5 reputable source URLs.\n- Include helpful suggestions links (group examples: 'Official Data','Research','News','Learn').\n- Reply with JSON only, no prose.";

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          ...messages,
        ],
        temperature: 0.2,
      }),
    });

    if (!resp.ok) {
      const status = resp.status;
      const bodyText = await resp.text().catch(() => '');
      let friendly = 'The AI service is temporarily unavailable. Please try again in a moment.';
      if (status === 429) friendly = 'The free model is rate-limited right now. Please retry shortly.';
      if (status >= 500) friendly = 'The AI provider is experiencing issues. Please try again soon.';
      // Do not leak raw provider JSON to users
      return NextResponse.json({ error: friendly, code: status }, { status });
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content ?? '';
    return NextResponse.json({ content });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}


