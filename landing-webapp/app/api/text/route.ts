import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Please provide text to analyze.' }, { status: 400 });
    }
    const trimmed = text.trim().slice(0, 16000); // cap input

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing OPENROUTER_API_KEY' }, { status: 500 });
    }

    const prompt = `You are a misinformation detector.
Task: Review the user's multi-line text. Only extract claims that are likely false or misleading. For each, return the line index (1-based), the exact quoted snippet, a correction (what is true), and a concise explanation with 2-5 citations (strict HTTPS URLs). Also include a 1-2 sentence summary of the text overall.

Return STRICT JSON ONLY matching this TypeScript schema exactly:
{
  "findings": Array<{
    "line": number,                 // 1-based index of the line containing the claim
    "snippet": string,              // exact quote of the claim
    "correction": string,           // the truthful correction in one sentence
    "reason": string,               // brief explanation (max ~200 chars)
    "verdict": "false"|"misleading"|"unclear",
    "citations": string[]           // 2-5 direct source links (HTTPS URLs only)
  }>,
  "summary": string                 // 1-2 sentences
}

IMPORTANT:
- Only include items that are likely false/misleading. Do not list every sentence.
- Citations must be valid HTTPS URLs only (no titles, no markdown, no extra text).
- Keep JSON valid and do not include explanations outside JSON.

User text (lines preserved):\n${trimmed}`;

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
            messages: [
              { role: 'system', content: 'You are a strict misinformation detector. Respond only with valid JSON for programmatic parsing.' },
              { role: 'user', content: prompt },
            ],
            temperature: 0.2,
            max_tokens: 1100,
          }),
        });
        if (!resp.ok) { lastError = { message: await resp.text().catch(()=>''), code: resp.status }; continue; }
        const data = await resp.json();
        const raw = data?.choices?.[0]?.message?.content ?? '';
        let parsed: any = null; try { parsed = JSON.parse(raw); } catch { parsed = null; }
        if (!parsed) continue;
        const urlExtract = (s: any) => Array.from(String(s || '').matchAll(/https?:\/\/[\w\-\.:%#@?&=\/~+]+/g)).map(m => m[0]);
        const findings = Array.isArray(parsed?.findings)
          ? parsed.findings.map((it: any) => {
              const baseCites = Array.isArray(it?.citations) ? it.citations.flatMap(urlExtract) : [];
              // Backfill URLs if the model embedded them in reason/correction
              let cites = [...baseCites, ...urlExtract(it?.reason), ...urlExtract(it?.correction)];
              // Deduplicate and enforce https only
              const seen = new Set<string>();
              cites = cites.filter((u: string) => {
                try { const ok = /^https:\/\//i.test(u); if (!ok) return false; const norm = new URL(u).toString(); if (seen.has(norm)) return false; seen.add(norm); return true; } catch { return false; }
              }).slice(0,5);
              return {
                snippet: String(it?.snippet || ''),
                reason: String(it?.reason || ''),
                verdict: it?.verdict === 'false' || it?.verdict === 'misleading' || it?.verdict === 'unclear' ? it.verdict : 'unclear',
                correction: String(it?.correction || ''),
                line: typeof it?.line === 'number' ? it.line : undefined,
                citations: cites,
              };
            })
          : [];
        const summary = typeof parsed?.summary === 'string' ? parsed.summary : '';
        if (findings.length > 0 || summary) {
          return NextResponse.json({ findings, summary, provider: model });
        }
      } catch (e:any) {
        lastError = { message: e?.message || 'error', code: 500 };
        continue;
      }
    }
    if (lastError) {
      const status = lastError.code;
      let friendly = 'The AI service is temporarily unavailable. Please try again in a moment.';
      if (status === 429) friendly = 'The free model is rate-limited right now. Please retry shortly.';
      if (status >= 500) friendly = 'The AI provider is experiencing issues. Please try again soon.';
      return NextResponse.json({ findings: [], summary: '', error: friendly }, { status: status || 502 });
    }
    return NextResponse.json({ findings: [], summary: '' });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}


