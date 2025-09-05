import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    },
  });
}

export async function POST(req: Request) {
  try {
    const { items } = await req.json(); // [{id,text}]
    if (!Array.isArray(items)) {
      return withCORS(NextResponse.json({ error: 'Bad payload' }, { status: 400 }));
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return withCORS(NextResponse.json({ error: 'Server missing OPENROUTER_API_KEY' }, { status: 500 }));
    }

    const system = 'You are an expert fact-checker. Respond with STRICT JSON only matching {"incorrect": {"id": string, "reason": string}[]}. Include only items that are likely incorrect or misleading. Use the provided ids to reference claims.';
    const user = 'Claims (array of {id,text}):\n' + JSON.stringify(items);

    const models = ['gpt-4o-mini'];

    for (const model of models) {
      try {
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [ { role: 'system', content: system }, { role: 'user', content: user } ],
            temperature: 0,
            max_tokens: 700,
          }),
        });
        if (!resp.ok) continue;
        const data = await resp.json();
        const text = data?.choices?.[0]?.message?.content || '';
        let parsed: any = null; try { parsed = JSON.parse(text); } catch { parsed = null; }
        if (parsed && Array.isArray(parsed.incorrect)) {
          return withCORS(NextResponse.json({ incorrect: parsed.incorrect, provider: model }));
        }
      } catch {}
    }
    return withCORS(NextResponse.json({ incorrect: [] }, { status: 200 }));
  } catch (e: any) {
    return withCORS(NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 }));
  }
}

function withCORS(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Vary', 'Origin');
  return res;
}


