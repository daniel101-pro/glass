import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { imageBase64, mime } = await req.json();
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json({ error: 'Missing imageBase64' }, { status: 400 });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing OPENROUTER_API_KEY' }, { status: 500 });
    }

    const dataUrl = imageBase64.startsWith('data:') ? imageBase64 : `data:${mime || 'image/jpeg'};base64,${imageBase64}`;

    const system = 'You are an expert at detecting AI-generated imagery (photorealistic, CGI, or synthetic). Respond with strict JSON only: {"ai_generated": boolean, "confidence": number, "reason": string} (confidence 0..1). Keep reason concise.';
    const userContent = [
      { type: 'text', text: 'Determine if this image is AI-generated. Return only the JSON object.' },
      { type: 'input_image', image_url: dataUrl },
    ];

    const models = ['gpt-4o-mini'];

    let lastError: { message: string; code: number } | null = null;
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
            messages: [ { role: 'system', content: system }, { role: 'user', content: userContent as any } ],
            temperature: 0,
            max_tokens: 200,
          }),
        });
        if (!resp.ok) { lastError = { message: await resp.text().catch(()=>''), code: resp.status }; continue; }
        const data = await resp.json();
        const text = data?.choices?.[0]?.message?.content || '';
        let parsed: any = null; try { parsed = JSON.parse(text); } catch { parsed = null; }
        if (parsed && typeof parsed.ai_generated === 'boolean') {
          return NextResponse.json({
            ai_generated: !!parsed.ai_generated,
            confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
            reason: typeof parsed.reason === 'string' ? parsed.reason : '',
            provider: model,
          });
        }
      } catch (e:any) {
        lastError = { message: e?.message || 'error', code: 500 };
        continue;
      }
    }
    if (lastError) {
      const status = lastError.code || 502;
      let friendly = 'The AI service is temporarily unavailable. Please try again shortly.';
      if (status === 429) friendly = 'The free vision model is rate-limited. Please retry shortly.';
      return NextResponse.json({ error: friendly }, { status });
    }
    return NextResponse.json({ error: 'Unable to analyze image at this time.' }, { status: 502 });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
