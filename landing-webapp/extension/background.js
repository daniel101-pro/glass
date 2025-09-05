// Background service worker for Glass AI fact-checking
// - Stores OpenRouter defaults
// - Handles AI requests from content scripts to avoid CSP issues

// Pre-seeded key (user provided)
const OPENROUTER_PRESET_KEY = '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';

const DEFAULTS = {
  openrouter_enabled: true,
  openrouter_model: 'deepseek/deepseek-r1:free',
  // Optionally prefill a key here for dev only. Leave blank for safety.
  openrouter_key: (typeof OPENROUTER_PRESET_KEY !== 'undefined' && OPENROUTER_PRESET_KEY) ? OPENROUTER_PRESET_KEY : '',
};

function initDefaults() {
  try {
    chrome.storage.sync.get(DEFAULTS, (res) => {
      const updates = {};
      for (const k of Object.keys(DEFAULTS)) {
        if (typeof res[k] === 'undefined' || (k === 'openrouter_key' && !res[k] && DEFAULTS.openrouter_key)) {
          updates[k] = DEFAULTS[k];
        }
      }
      if (Object.keys(updates).length) chrome.storage.sync.set(updates);
    });
  } catch (_) {}
}

try { chrome.runtime.onInstalled.addListener(() => initDefaults()); } catch(_) {}
try { chrome.runtime.onStartup.addListener(() => initDefaults()); } catch(_) {}

async function callOpenRouter(model, key, messages, maxTokens = 600, temperature = 0) {
  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'X-Title': 'Glass Fact-Check',
      'HTTP-Referer': self.location?.origin || 'http://localhost',
    },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
  });
  if (!resp.ok) return { ok: false, status: resp.status, content: await resp.text().catch(()=> '') };
  const data = await resp.json();
  const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  return { ok: true, content: content || '' };
}

const FREE_MODELS = [
  'deepseek/deepseek-r1:free',
  'mistralai/mistral-nemo:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'qwen/qwen-2.5-7b-instruct:free',
  'google/gemma-2-9b-it:free',
];

try {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    (async () => {
      if (msg && msg.type === 'GLASS_AI_FACTCHECK_SINGLE') {
        const { sentence } = msg;
        const prefs = await chrome.storage.sync.get(DEFAULTS);
        if (!prefs.openrouter_enabled || !prefs.openrouter_key) return sendResponse({ ok: false });
        const messages = [
          { role: 'system', content: 'Reply with a single word only: Correct, Incorrect, or Unclear.' },
          { role: 'user', content: `Claim: ${sentence}` },
        ];
        let last = null;
        for (const model of [prefs.openrouter_model, ...FREE_MODELS.filter(m => m !== prefs.openrouter_model)]) {
          const r = await callOpenRouter(model, prefs.openrouter_key, messages, 10, 0);
          if (r.ok && r.content) return sendResponse({ ok: true, text: r.content, provider: model });
          last = r;
        }
        return sendResponse({ ok: false, text: last?.content || '' });
      }
      if (msg && msg.type === 'GLASS_AI_FACTCHECK_BATCH') {
        const { items } = msg; // [{id,text}]
        const prefs = await chrome.storage.sync.get(DEFAULTS);
        if (!prefs.openrouter_enabled || !prefs.openrouter_key) return sendResponse({ ok: false });
        const system = 'You are an expert fact-checker. Respond with STRICT JSON only matching {"incorrect": {"id": string, "reason": string}[]}. Include only items that are likely incorrect or misleading. Use the provided ids to reference claims.';
        const user = 'Claims (array of {id,text}):\n' + JSON.stringify(items);
        let last = null;
        for (const model of [prefs.openrouter_model, ...FREE_MODELS.filter(m => m !== prefs.openrouter_model)]) {
          const r = await callOpenRouter(model, prefs.openrouter_key, [ { role:'system', content: system }, { role:'user', content: user } ], 700, 0);
          if (r.ok && r.content) return sendResponse({ ok: true, text: r.content, provider: model });
          last = r;
        }
        return sendResponse({ ok: false, text: last?.content || '' });
      }
    })();
    return true; // keep the message channel open for async
  });
} catch (_) {}


