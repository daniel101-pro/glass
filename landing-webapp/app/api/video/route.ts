import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.startsWith('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
    }
    const form = await (req as any).formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Max 5MB' }, { status: 400 });

    // For simplicity, compute a few lightweight heuristics; then ask a language model for AI/edited likelihood using metadata
    const bytes = Buffer.from(await file.arrayBuffer());
    const mime = file.type || 'video/mp4';
    const base64Head = bytes.subarray(0, Math.min(bytes.length, 120000)).toString('base64');

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Server missing OPENROUTER_API_KEY' }, { status: 500 });

    const models = ['gpt-4o-mini'];
    const system = 'You analyze short video clips for synthetic/AI generation or deepfake signs based on limited header/metadata cues and user description. Respond with strict JSON only: {"ai_generated": boolean, "confidence": number, "reason": string}. Confidence 0..1. Keep reason concise. If unsure, set ai_generated=false and low confidence.';
    const user = `We provide the first ~120KB of the video (base64) and mime: ${mime}. Use known signatures (container/codec hints) and common artifacts reasoning. base64_head: ${base64Head}`;

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
            max_tokens: 250,
          }),
        });
        if (!resp.ok) continue;
        const data = await resp.json();
        const text = data?.choices?.[0]?.message?.content || '';
        let parsed: any = null; try { parsed = JSON.parse(text); } catch { parsed = null; }
        if (parsed && typeof parsed.ai_generated === 'boolean') {
          return NextResponse.json({ ai_generated: !!parsed.ai_generated, confidence: Number(parsed.confidence||0), reason: String(parsed.reason||''), provider: model });
        }
      } catch {}
    }
    return NextResponse.json({ error: 'Unable to analyze video.' }, { status: 502 });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}


