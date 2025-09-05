import { NextResponse } from 'next/server';

function isValidHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractBetween(html: string, start: RegExp, end: RegExp): string | null {
  const s = start.exec(html);
  if (!s) return null;
  end.lastIndex = s.index + s[0].length;
  const e = end.exec(html);
  if (!e) return null;
  return html.slice(s.index, e.index + e[0].length);
}

function extractMeta(html: string): { title?: string; description?: string } {
  const get = (re: RegExp) => {
    const m = re.exec(html); return m ? decodeEntities(m[1]).trim() : undefined;
  };
  return {
    title: get(/<title[^>]*>([\s\S]*?)<\/title>/i) || get(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i),
    description:
      get(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
      get(/<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
      get(/<meta[^>]+name=["']twitter:description["'][^>]*content=["']([^"']+)["'][^>]*>/i),
  };
}

function extractParagraphs(html: string, maxParas = 120): string[] {
  const content = extractBetween(html, /<article[\s\S]*?>/i, /<\/article>/i) || html;
  const paras: string[] = [];
  const re = /<p[\s\S]*?>([\s\S]*?)<\/p>/gi;
  let m: RegExpExecArray | null; let count = 0;
  while ((m = re.exec(content)) && count < maxParas) {
    const text = decodeEntities(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    if (text && text.length >= 40) { paras.push(text); count++; }
  }
  return paras;
}

function buildPageText(html: string): string {
  try {
    // Remove scripts/styles first
    let clean = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
    const meta = extractMeta(clean);
    const paras = extractParagraphs(clean);
    const header = [meta.title, meta.description].filter(Boolean).join(' — ');
    const body = paras.join('\n');
    const combined = [header, body].filter(Boolean).join('\n');
    return combined.replace(/\s+/g, ' ').trim();
  } catch {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string' || !isValidHttpUrl(url)) {
      return NextResponse.json({ error: 'Please provide a valid http(s) URL.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing OPENROUTER_API_KEY' }, { status: 500 });
    }

    // Fetch page content server-side (best-effort)
    let pageText = '';
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Upgrade-Insecure-Requests': '1',
        }
      });
      const html = await res.text();
      pageText = buildPageText(html).slice(0, 12000);
    } catch {
      // If fetch fails, still pass the URL for context
      pageText = `Unable to fetch content. Analyze the URL context only: ${url}`;
    }

    const prompt = `You are a misinformation detector.
Task: Review the extracted webpage text. Only extract claims that are likely false or misleading. For each, return the exact quoted snippet, a correction (what is true), a concise explanation, and 1-3 citations (urls if possible). Also include a 1-2 sentence summary of the page overall.

Return STRICT JSON ONLY matching this TypeScript schema exactly:
{
  "findings": Array<{
    "snippet": string,              // exact quote of the claim
    "correction": string,           // truthful correction in one sentence
    "reason": string,               // brief explanation (max ~200 chars)
    "verdict": "false"|"misleading"|"unclear",
    "confidence": number,           // 0..1
    "citations": string[]           // up to 3 source links
  }>,
  "summary": string                 // 1-2 sentences
}

IMPORTANT:
- Only include items that are likely false/misleading. Do not list every sentence.
- Keep JSON valid and do not include explanations outside JSON.

Webpage text:\n${pageText}`;

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
            max_tokens: 900,
          }),
        });
        if (!resp.ok) {
          lastError = { message: await resp.text().catch(()=>'error'), code: resp.status };
          continue;
        }
        const data = await resp.json();
        const raw = data?.choices?.[0]?.message?.content ?? '';
        let parsed: any = null;
        try { parsed = JSON.parse(raw); } catch { parsed = null; }
        if (!parsed) { continue; }
        const findings = Array.isArray(parsed?.findings)
          ? parsed.findings.map((it: any) => ({
              snippet: String(it?.snippet || ''),
              reason: String(it?.reason || ''),
              verdict: it?.verdict === 'false' || it?.verdict === 'misleading' || it?.verdict === 'unclear' ? it.verdict : 'unclear',
              correction: String(it?.correction || ''),
              confidence: typeof it?.confidence === 'number' ? it.confidence : 0,
              citations: Array.isArray(it?.citations) ? it.citations.slice(0, 5) : [],
            }))
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


