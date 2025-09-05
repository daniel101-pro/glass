'use client';

import { useEffect, useRef, useState } from 'react';

export default function GlassOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('glass_enabled') : null;
    setEnabled(stored === 'true');
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'glass_enabled') {
        setEnabled(e.newValue === 'true');
      }
    };
    const onCustom = (e: any) => {
      if (e?.detail?.enabled !== undefined) setEnabled(!!e.detail.enabled);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('glass_enabled_changed', onCustom as any);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Minimal speech recognition demo (browser dependent)
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    recognitionRef.current = rec;

    const onResult = (e: any) => {
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      // naive detector demo
      if (/fake|lie|misinfo|misinformation|not true/i.test(transcript)) {
        setStatus('Potential misinformation detected');
      } else {
        setStatus('Listening…');
      }
    };

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = onResult;
    try { rec.start(); } catch {}

    return () => {
      try { rec.stop(); } catch {}
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      {/* dark HUD base */}
      <div className="absolute inset-0 bg-black/0" />

      {/* top toolbar */}
      <div className="pointer-events-auto fixed top-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-2 bg-white/5 border border-white/10 backdrop-blur-[10px] flex items-center gap-3 text-white">
        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">00:44</div>
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
        <div className="px-4 py-2 rounded-full bg-white/8 border border-white/15 flex items-center gap-2">
          <span>Fact-Check</span>
          <button
            ref={toggleRef}
            aria-label={enabled ? 'Turn Glass off' : 'Turn Glass on'}
            onClick={() => {
              const next = !enabled;
              // update storage so overlay disappears/appears globally
              try {
                localStorage.setItem('glass_enabled', next ? 'true' : 'false');
                window.dispatchEvent(new CustomEvent('glass_enabled_changed', { detail: { enabled: next } }));
              } catch {}
              setEnabled(next);
            }}
            className={`inline-flex items-center w-12 h-6 rounded-full border transition-colors duration-200 ${
              enabled ? 'bg-emerald-400/30 border-emerald-400/40' : 'bg-white/10 border-white/20'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full transition-transform duration-200 ${
                enabled ? 'bg-emerald-400 translate-x-6' : 'bg-white/60 translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* twin panels */}
      <div className="absolute top-24 left-4 right-4 max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* left panel */}
        <div className="pointer-events-auto cursor-grab active:cursor-grabbing select-none relative rounded-2xl bg-white/5 backdrop-blur-[1px] border border-white/10 text-white p-6" draggable={false} onMouseDown={(e)=>{
          // Simple drag without external libs
          const panel = e.currentTarget as HTMLDivElement;
          const startX = e.clientX;
          const startY = e.clientY;
          const rect = panel.getBoundingClientRect();
          const offsetX = startX - rect.left;
          const offsetY = startY - rect.top;
          const onMove = (ev: MouseEvent) => {
            panel.style.position = 'fixed';
            panel.style.top = `${Math.max(60, ev.clientY - offsetY)}px`;
            panel.style.left = 'auto';
            panel.style.right = 'auto';
            panel.style.transform = 'none';
            panel.style.insetInlineStart = `${Math.max(8, ev.clientX - offsetX)}px`;
          };
          const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
          };
          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
        }}>
          <div className="flex items-center gap-3 text-white/85">
            <div className="w-6 h-6 rounded-full bg-white/20" />
            <span className="text-lg font-semibold">Live insights</span>
          </div>
          <div className="mt-6">
            <h4 className="text-white/90 text-xl font-semibold">Conversation Summary</h4>
            <p className="mt-2 text-white/80">Discussion on Nigeria’s oil exports and global energy market positioning.</p>
          </div>
          <div className="mt-6">
            <h5 className="text-white/90 text-lg font-semibold">Core Highlights:</h5>
            <ul className="mt-2 space-y-2 text-white/85">
              <li>• Nigeria is Africa’s largest oil exporter.</li>
              <li>• Nigeria accounts for ~15% of world’s oil exports.</li>
            </ul>
          </div>
          <div className="mt-6">
            <h5 className="text-white/90 text-lg font-semibold">Actions</h5>
            <div className="mt-3 space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10">🌍 Compare Nigeria with other African exporters</button>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10">📄 View Nigeria’s current oil export share</button>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10">📑 Pull latest OPEC report</button>
            </div>
          </div>
        </div>
        {/* right panel */}
        <div className="pointer-events-auto relative rounded-2xl bg-white/5 backdrop-blur-[1px] border border-white/10 text-white p-6">
          <div className="flex items-center justify-between text-white/85">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20" />
              <span className="text-lg font-semibold">Glass Response</span>
            </div>
            <button className="px-3 py-1.5 rounded-full bg-white/5 border border-white/15">Open Chatbot</button>
          </div>
          <div className="mt-6">
            <h4 className="text-white/90 text-xl font-semibold">Claim</h4>
            <p className="mt-2 text-white/85">“Nigeria is Africa’s largest oil exporter.” <span className="ml-3 text-emerald-300">True</span></p>
            <ul className="mt-4 text-white/85 space-y-2">
              <li>• Nigeria is consistently the top crude oil exporter in Africa, ahead of Angola and Algeria.</li>
            </ul>
          </div>
          <div className="mt-6">
            <h5 className="text-white/90 text-lg font-semibold">Sources:</h5>
            <div className="mt-3 space-y-2">
              <button className="px-3 py-2 rounded-full bg-white/5 border border-white/15 underline">OPEC Annual Report (2024) →</button>
              <button className="px-3 py-2 rounded-full bg-white/5 border border-white/15 underline">EIA World Oil Data →</button>
            </div>
            <div className="mt-3">
              <button className="px-4 py-2 rounded-full bg-white/8 border border-white/15">Close Reasoning</button>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-white/85">“Nigeria accounts for ~15% of world’s oil exports.” <span className="ml-3 text-red-300">Inaccurate</span></p>
            <div className="mt-3">
              <button className="px-4 py-2 rounded-full bg-white/8 border border-white/15">See Reasoning</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


