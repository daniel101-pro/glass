import { NextResponse } from 'next/server';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { audioBase64 } = await req.json();
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      return NextResponse.json({ error: 'Missing audioBase64' }, { status: 400 });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Server missing OPENAI_API_KEY' }, { status: 500 });

    // Use OpenAI audio/transcriptions (Whisper/gpt-4o-mini-transcribe) for robust STT
    const m = audioBase64.match(/^data:(.*?);base64,(.*)$/);
    if (!m) return NextResponse.json({ error: 'Invalid data URL' }, { status: 400 });
    const mime = m[1] || 'audio/webm';
    const b64 = m[2];
    const buf = Buffer.from(b64, 'base64');
    const blob = new Blob([buf], { type: mime });
    const form = new FormData();
    form.append('file', blob, 'chunk.webm');
    // Prefer gpt-4o-mini-transcribe if available; fallback to whisper-1
    form.append('model', 'gpt-4o-mini-transcribe');
    form.append('temperature', '0');
    form.append('response_format', 'json');

    let resp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: form as any,
    });
    if (!resp.ok) {
      // retry with whisper-1
      const form2 = new FormData();
      form2.append('file', blob, 'chunk.webm');
      form2.append('model', 'whisper-1');
      form2.append('temperature', '0');
      form2.append('response_format', 'json');
      resp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}` }, body: form2 as any,
      });
    }
    if (!resp.ok) {
      const txt = await resp.text().catch(()=> '');
      return NextResponse.json({ error: 'Transcription failed', detail: txt }, { status: 502 });
    }
    const data = await resp.json();
    const text = data?.text || data?.text?.content || '';
    return NextResponse.json({ text: String(text || '') });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}


