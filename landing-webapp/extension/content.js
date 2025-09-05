(() => {
  console.log('Glass extension content script loaded v0.2.0');
  const ID = 'glass-overlay-root';
  if (document.getElementById(ID)) {
    console.log('Glass overlay already exists, skipping');
    return;
  }

  const root = document.createElement('div');
  root.id = ID;
  root.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    pointer-events: none;
    display: none;
  `;
  document.documentElement.appendChild(root);

  // Main overlay container
  root.innerHTML = `
    <style>
      @keyframes glassFadeIn {
        0% { opacity: 0; transform: translateY(-10px) scale(0.98); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes glassFadeOut {
        0% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-10px) scale(0.98); }
      }
      .glass-animate-in { animation: glassFadeIn 220ms ease forwards; }
      .glass-animate-out { animation: glassFadeOut 180ms ease forwards; }
      .glass-active-blob { display: none; }
      .glass-link-blob { display: none; }
      /* Larger readable body text (not headers) */
      p { font-size: 16px; line-height: 1.55; }
      li { font-size: 16px; line-height: 1.5; }
      .glass-settings-card label span { font-size: 16px; }
      /* Audio bars */
      .glass-audio { width: 56px; height: 28px; display:flex; align-items:flex-end; gap: 6px; }
      .glass-audio span { display:block; width: 4px; height: 6px; background: rgba(255,255,255,0.95); border-radius: 3px; box-shadow: 0 1px 0 rgba(0,0,0,0.25); transition: height 80ms linear, opacity 80ms linear; }
      @keyframes glassBlink { 0%, 60% { opacity: 1; } 61%, 100% { opacity: 0.2; } }
      /* Fact-check overlay */
      .glass-fc-highlight { position: fixed; background: rgba(239,68,68,0.22); border: 1px solid rgba(239,68,68,0.5); border-radius: 4px; pointer-events: none; z-index: 2147483646; animation: glassBlink 1.2s infinite; }
      .glass-fc-badge { position: fixed; font-size: 10px; color: #fff; background: rgba(239,68,68,0.9); padding: 2px 4px; border-radius: 4px; pointer-events: none; z-index: 2147483646; box-shadow: 0 1px 6px rgba(0,0,0,0.25); }
    </style>
    <!-- Top toolbar -->
    <div id="glass-toolbar" style="
      pointer-events: auto;
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 9999px;
      padding: 8px 12px;
      background: linear-gradient(135deg, rgba(30,30,30,0.18) 0%, rgba(60,60,60,0.16) 100%);
      border: 1px solid rgba(255,255,255,0.3);
      backdrop-filter: blur(30px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      text-shadow: 0 2px 8px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,0,0,0.3);
      position: fixed;
    ">
      <div id="glass-timer-pill" style="display:flex; align-items:center; gap:8px; padding: 8px 16px; border-radius: 9999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.2); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05);">
        <span id="glass-timer" style="min-width: 42px; text-align:center;">00:00</span>
        <span id="glass-mic-off-dot" title="Mic off" style="display:none; width:8px; height:8px; border-radius:9999px; background:#ef4444; box-shadow: 0 0 8px rgba(239,68,68,0.8); animation: glassBlink 1s infinite;"></span>
      </div>
      <div id="glass-audio-bars" class="glass-audio" title="Live audio levels" aria-label="Live audio levels"></div>
      <button id="glass-mic-toggle" title="Mute/Unmute microphone" aria-pressed="false" style="width: 36px; height: 36px; display:flex; align-items:center; justify-content:center; background: transparent; border: none; cursor: pointer;">
        <img id="glass-mic-icon" src="${chrome.runtime.getURL('icons/mic-off.svg')}" alt="Mic off" width="18" height="18" />
      </button>
      <div id="glass-nav-signal" role="button" tabindex="0" title="Signal" style="width: 36px; height: 36px; display:flex;align-items:center;justify-content:center; cursor: pointer;">
        <img alt="Signal" src="${chrome.runtime.getURL('icons/type-03.svg')}" width="18" height="18" style="display:block;" />
      </div>
      <div id="glass-nav-glass" role="button" tabindex="0" title="Glass" style="width: 36px; height: 36px; display:flex;align-items:center;justify-content:center; cursor: pointer;">
        <img alt="G" src="${chrome.runtime.getURL('icons/G.svg')}" width="18" height="18" style="display:block;" />
      </div>
      <span id="glass-active-blob" class="glass-active-blob"></span>
      <span id="glass-link-blob" class="glass-link-blob"></span>
      <div id="glass-nav-settings" role="button" tabindex="0" title="Settings" style="width: 36px; height: 36px; display:flex;align-items:center;justify-content:center; cursor: pointer;">
        <img alt="Settings" src="${chrome.runtime.getURL('icons/settings.svg')}" width="18" height="18" style="display:block;" />
      </div>
      <div style="
        padding: 8px 16px;
        border-radius: 9999px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        <span id="glass-toggle-label">Turn on ⌘ /</span>
        <button id="glass-ext-toggle" style="
          display: inline-flex;
          align-items: center;
          width: 48px;
          height: 24px;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.1);
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        ">
          <span id="glass-toggle-slider" style="
            width: 20px;
            height: 20px;
            border-radius: 9999px;
            background: rgba(255,255,255,0.6);
            transition: transform 0.2s;
            transform: translateX(4px);
          "></span>
        </button>
      </div>
    </div>

    <!-- Twin panels container -->
    <div style="
      position: absolute;
      top: 96px;
      left: 16px;
      right: 16px;
      max-width: 1100px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    ">
      <!-- Left panel -->
      <div id="glass-left-panel" style="
        pointer-events: auto;
        cursor: grab;
        user-select: none;
        position: relative;
        border-radius: 16px;
        background: linear-gradient(135deg, rgba(40,40,40,0.17) 0%, rgba(80,80,80,0.15) 100%);
        backdrop-filter: blur(3px);
        border: 1px solid rgba(255,255,255,0.25);
        box-shadow: 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
        color: white;
        padding: 24px;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
        text-shadow: 0 2px 8px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,0,0,0.4);
      ">
        <div style="display: flex; align-items: center; gap: 12px; opacity: 0.85;">
          <div style="width: 24px; height: 24px; display:flex;align-items:center;justify-content:center; border-radius: 6px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 16l5-5 4 3 5-6 4 5" stroke="white" stroke-opacity="0.9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span style="font-size: 18px; font-weight: 600;">Live insights</span>
        </div>
        <div style="margin-top: 24px;">
          <h4 style="opacity: 0.9; font-size: 20px; font-weight: 600; margin: 0;">Conversation Summary</h4>
          <p id="glass-live-summary" style="margin-top: 8px; opacity: 0.8;">Waiting for content…</p>
        </div>
        <div style="margin-top: 24px;">
          <h5 style="opacity: 0.9; font-size: 18px; font-weight: 600; margin: 0;">False Information:</h5>
          <ul id="glass-live-highlights" style="margin-top: 8px; padding-left: 0; list-style: none; opacity: 0.85;"></ul>
        </div>
        <div style="margin-top: 24px;">
          <h5 style="opacity: 0.9; font-size: 18px; font-weight: 600; margin: 0;">Actions</h5>
          <div id="glass-live-actions" style="margin-top: 12px;"></div>
        </div>
        <div style="margin-top: 24px;">
          <h5 style="opacity: 0.9; font-size: 18px; font-weight: 600; margin: 0;">Live Transcription</h5>
          <div id="glass-live-transcript" style="margin-top: 12px; max-height: 160px; overflow: auto; padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12);"></div>
        </div>
      </div>

      <!-- Right panel -->
      <div id="glass-right-panel" style="
        pointer-events: auto;
        position: relative;
        border-radius: 16px;
        background: linear-gradient(135deg, rgba(40,40,40,0.17) 0%, rgba(80,80,80,0.15) 100%);
        backdrop-filter: blur(3px);
        border: 1px solid rgba(255,255,255,0.25);
        box-shadow: 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
        color: white;
        padding: 24px;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
        text-shadow: 0 2px 8px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,0,0,0.4);
      ">
        <div style="display: flex; align-items: center; justify-content: space-between; opacity: 0.85;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 24px; height: 24px; display:flex;align-items:center;justify-content:center; border-radius: 6px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="12" rx="3" stroke="white" stroke-opacity="0.9" stroke-width="2"/>
                <path d="M8 10h8M8 13h6" stroke="white" stroke-opacity="0.9" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <span style="font-size: 18px; font-weight: 600;">Glass Response</span>
          </div>
          
        </div>
        <div style="margin-top: 24px;">
          <h5 style="opacity: 0.9; font-size: 18px; font-weight: 600; margin: 0;">Sources:</h5>
          <div id="glass-live-sources" style="margin-top: 12px;"></div>
          <div style="margin-top: 12px;">
            <button id="glass-see-reasoning" style="
              padding: 8px 16px;
              border-radius: 9999px;
              background: rgba(255,255,255,0.08);
              border: 1px solid rgba(255,255,255,0.15);
              color: white;
              cursor: pointer;
              font-family: inherit;
            ">See Reasoning</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Drag functionality for left panel
  const leftPanel = root.querySelector('#glass-left-panel');
  let isDown = false, sx = 0, sy = 0, ox = 0, oy = 0;
  
  leftPanel.addEventListener('mousedown', (e) => {
    isDown = true;
    leftPanel.style.cursor = 'grabbing';
    sx = e.clientX;
    sy = e.clientY;
    const rect = leftPanel.getBoundingClientRect();
    ox = rect.left;
    oy = rect.top;
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    leftPanel.style.position = 'fixed';
    leftPanel.style.left = Math.max(8, ox + dx) + 'px';
    leftPanel.style.top = Math.max(60, oy + dy) + 'px';
    leftPanel.style.right = 'auto';
    leftPanel.style.transform = 'none';
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    leftPanel.style.cursor = 'grab';
  });

  function applyVisibility(enabled) {
    console.log('Glass overlay visibility:', enabled);
    root.style.display = enabled ? 'block' : 'none';
    const toggle = document.getElementById('glass-ext-toggle');
    const slider = document.getElementById('glass-toggle-slider');
    const label = document.getElementById('glass-toggle-label');
    const rightPanel = root.querySelector('#glass-right-panel');
    if (toggle && slider) {
      if (enabled) {
        toggle.style.background = 'rgba(52, 211, 153, 0.3)';
        toggle.style.borderColor = 'rgba(52, 211, 153, 0.4)';
        slider.style.background = '#34d399';
        slider.style.transform = 'translateX(24px)';
      } else {
        toggle.style.background = 'rgba(255,255,255,0.1)';
        toggle.style.borderColor = 'rgba(255,255,255,0.2)';
        slider.style.background = 'rgba(255,255,255,0.6)';
        slider.style.transform = 'translateX(4px)';
      }
    }
    if (label) {
      label.textContent = enabled ? 'Turn off ⌘ /' : 'Turn on ⌘ /';
    }
    const leftPanelLocal = root.querySelector('#glass-left-panel');
    if (rightPanel) rightPanel.style.display = 'none';
    if (leftPanelLocal) leftPanelLocal.style.display = 'none';
    const activeBlob = root.querySelector('#glass-active-blob');
    const linkBlob = root.querySelector('#glass-link-blob');
    if (activeBlob) activeBlob.style.opacity = '0';
    if (linkBlob) linkBlob.style.opacity = '0';
    // Ensure media/timer state matches visibility and mic state
    isGlassVisible = enabled;
    if (isGlassVisible && micStateLoaded) synchronizeMicAndTimer(); else { stopAudioVisualization(); stopTimer(); }
  }

  // Chrome storage sync
  try {
    chrome.storage.sync.get({ glass_enabled: false }, (result) => {
      applyVisibility(!!result.glass_enabled);
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync' && 'glass_enabled' in changes) {
        applyVisibility(!!changes.glass_enabled.newValue);
      }
    });
  } catch (e) {
    applyVisibility(false);
  }

  // Keyboard shortcut: ⌘/ (or Ctrl/) to TURN OFF Glass
  let shortcutListener = null;
  function attachShortcutListener(enabled) {
    if (shortcutListener) {
      window.removeEventListener('keydown', shortcutListener);
      shortcutListener = null;
    }
    if (!enabled) return;
    shortcutListener = (e) => {
      const isSlash = e.key === '/' || e.code === 'Slash';
      const hasMeta = e.metaKey || e.ctrlKey;
      const target = e.target;
      const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (hasMeta && isSlash && !isTyping) {
        e.preventDefault();
        try {
          chrome.storage.sync.set({ glass_enabled: false });
        } catch (_) {}
      }
    };
    window.addEventListener('keydown', shortcutListener, { capture: true });
  }

  // Initialize shortcut preference
  try {
    chrome.storage.sync.get({ glass_shortcut_enabled: true }, (res) => {
      attachShortcutListener(!!res.glass_shortcut_enabled);
    });
  } catch (_) {
    attachShortcutListener(true);
  }

  // Toggle button functionality
  const toggleBtn = root.querySelector('#glass-ext-toggle');
  toggleBtn.addEventListener('click', () => {
    try {
      chrome.storage.sync.get({ glass_enabled: false }, (result) => {
        const nextState = !result.glass_enabled;
        chrome.storage.sync.set({ glass_enabled: nextState });
      });
    } catch (e) {
      console.log('Chrome storage not available');
    }
  });

  // Navbar buttons: animations and toggles
  function bindNav(id, action) {
    const el = root.querySelector(id);
    if (!el) return;
    const handler = () => {
      // Add active state styling
      const allNavs = root.querySelectorAll('[id^="glass-nav-"]');
      allNavs.forEach(nav => {
        nav.style.background = 'transparent';
        nav.style.border = 'none';
        nav.style.boxShadow = 'none';
      });

      const activeBlob = root.querySelector('#glass-active-blob');
      const linkBlob = root.querySelector('#glass-link-blob');
      const toolbar = root.querySelector('#glass-toolbar');
      function positionActiveAt(target) {
        if (!activeBlob || !toolbar || !target) return;
        const rect = target.getBoundingClientRect();
        const trect = toolbar.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) + 12;
        activeBlob.style.width = size + 'px';
        activeBlob.style.height = size + 'px';
        activeBlob.style.left = (rect.left - trect.left + rect.width / 2 - size / 2) + 'px';
        activeBlob.style.top = (rect.top - trect.top + rect.height / 2 - size / 2) + 'px';
        activeBlob.style.opacity = '1';
      }
      function positionLinkBetween(a, b) {
        if (!linkBlob || !toolbar || !a || !b) return;
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        const tr = toolbar.getBoundingClientRect();
        const midX = (ar.right + br.left) / 2;
        const midY = ar.top + ar.height / 2;
        linkBlob.style.left = (midX - tr.left - 14) + 'px';
        linkBlob.style.top = (midY - tr.top - 14) + 'px';
        linkBlob.style.opacity = '1';
      }

      if (action === 'toggle-panels') {
        const lp = root.querySelector('#glass-left-panel');
        const rp = root.querySelector('#glass-right-panel');
        const isVisible = lp && lp.style.display !== 'none';
        // Ensure settings modal is closed when opening panels
        if (!isVisible) closeSettingsModal();

        if (!isVisible) {
          if (lp) { lp.style.display = 'block'; lp.classList.remove('glass-animate-out'); lp.classList.add('glass-animate-in'); }
          if (rp) { rp.style.display = 'block'; rp.classList.remove('glass-animate-out'); rp.classList.add('glass-animate-in'); }
          positionActiveAt(el);
          positionLinkBetween(root.querySelector('#glass-nav-glass'), root.querySelector('#glass-nav-settings'));
        } else {
          if (lp) { lp.classList.remove('glass-animate-in'); lp.classList.add('glass-animate-out'); }
          if (rp) { rp.classList.remove('glass-animate-in'); rp.classList.add('glass-animate-out'); }
          if (activeBlob) activeBlob.style.opacity = '0';
          if (linkBlob) linkBlob.style.opacity = '0';
          setTimeout(() => {
            if (lp) lp.style.display = 'none';
            if (rp) rp.style.display = 'none';
          }, 180);
        }

        if (!isVisible) {
          el.style.background = 'rgba(255,255,255,0.06)';
          el.style.border = '1px solid rgba(255,255,255,0.2)';
          el.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.05)';
          el.style.borderRadius = '9999px';
        }
      }

      if (action === 'open-settings') {
        // Hide G panels if visible
        const lp = root.querySelector('#glass-left-panel');
        const rp = root.querySelector('#glass-right-panel');
        if (lp && lp.style.display !== 'none') { lp.classList.remove('glass-animate-in'); lp.classList.add('glass-animate-out'); setTimeout(() => (lp.style.display = 'none'), 180); }
        if (rp && rp.style.display !== 'none') { rp.classList.remove('glass-animate-in'); rp.classList.add('glass-animate-out'); setTimeout(() => (rp.style.display = 'none'), 180); }
        if (linkBlob) linkBlob.style.opacity = '1';
        positionActiveAt(el);
        positionLinkBetween(root.querySelector('#glass-nav-glass'), el);
        openSettingsModal();
      }

      if (action === 'toggle-factcheck') {
        const enabledNow = !factCheckEnabled;
        setFactCheckEnabled(enabledNow);
        // Visual feedback on icon when active
        if (enabledNow) {
          el.style.background = 'rgba(239,68,68,0.12)';
          el.style.border = '1px solid rgba(239,68,68,0.35)';
          el.style.borderRadius = '9999px';
          el.style.boxShadow = 'inset 0 0 0 1px rgba(239,68,68,0.15)';
        } else {
          el.style.background = 'transparent';
          el.style.border = 'none';
          el.style.boxShadow = 'none';
        }
      }
    };
    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
  }

  // Bind toggles
  bindNav('#glass-nav-glass', 'toggle-panels');
  bindNav('#glass-nav-settings', 'open-settings');
  bindNav('#glass-nav-signal', 'toggle-factcheck');

  // Settings modal
  let settingsModal = null;
  function closeSettingsModal() {
    if (!settingsModal) return;
    const card = settingsModal.firstElementChild;
    if (card) { card.classList.remove('glass-animate-in'); card.classList.add('glass-animate-out'); }
    setTimeout(() => { if (settingsModal) { settingsModal.remove(); settingsModal = null; } }, 180);
  }
  function openSettingsModal() {
    if (settingsModal) return;
    settingsModal = document.createElement('div');
    settingsModal.style.cssText = 'position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: auto; z-index: 2147483647; background: rgba(0,0,0,0.35)';
    settingsModal.innerHTML = `
      <div class="glass-animate-in glass-settings-card" style="min-width: 460px; max-width: 600px; width: 92vw; border-radius: 16px; background: linear-gradient(135deg, rgba(40,40,40,0.17) 0%, rgba(80,80,80,0.15) 100%); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.25); box-shadow: 0 10px 40px rgba(0,0,0,0.4); color: white; padding: 18px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; text-shadow: 0 2px 8px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,0,0,0.4);"> 
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${chrome.runtime.getURL('icons/settings.svg')}" width="18" height="18" />
            <span style="font-weight:700; letter-spacing:0.3px; font-size: 20px;">Glass Settings</span>
          </div>
          <button id="glass-settings-close" style="background: transparent; color: white; border: 1px solid rgba(255,255,255,0.25); border-radius: 9999px; padding: 6px 12px; cursor: pointer;">Close</button>
        </div>
        <div style="margin-top: 14px; display:grid; gap:12px;">
          <div style="padding:12px; border-radius:12px; background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.18);">
            <div style="font-weight:600; opacity:0.9;">General</div>
            <div style="margin-top:8px; display:grid; gap:10px;">
              <label style="display:flex; align-items:center; justify-content:space-between;">
                <span>Show toolbar at startup</span>
                <input id="glass-pref-autoshow" type="checkbox" />
              </label>
              <label style="display:flex; align-items:center; justify-content:space-between;">
                <span>Enable keyboard shortcut (⌘ /)</span>
                <input id="glass-pref-shortcut" type="checkbox" />
              </label>
              <label style="display:flex; align-items:center; justify-content:space-between;">
                <span>Reduce motion</span>
                <input id="glass-pref-reduce" type="checkbox" />
              </label>
            </div>
          </div>
          <div style="padding:12px; border-radius:12px; background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.18);">
            <div style="font-weight:600; opacity:0.9;">AI Fact Check (OpenRouter)</div>
            <div style="margin-top:8px; display:grid; gap:8px;">
              <label style="display:flex; align-items:center; gap:8px;">
                <span style="min-width:110px;">API Key</span>
                <input id="glass-or-key" type="password" placeholder="sk-or-..." style="flex:1; padding:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.3); background:rgba(0,0,0,0.2); color:white;" />
              </label>
              <label style="display:flex; align-items:center; gap:8px;">
                <span style="min-width:110px;">Model</span>
                <input id="glass-or-model" type="text" placeholder="deepseek/deepseek-r1:free" value="deepseek/deepseek-r1:free" style="flex:1; padding:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.3); background:rgba(0,0,0,0.2); color:white;" />
              </label>
              <label style="display:flex; align-items:center; justify-content:space-between;">
                <span>Use AI fact-check</span>
                <input id="glass-or-enabled" type="checkbox" />
              </label>
              <div style="font-size:12px; opacity:0.8;">Key stored locally in your browser storage.</div>
            </div>
          </div>
          <div style="padding:12px; border-radius:12px; background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.18);">
            <div style="font-weight:600; opacity:0.9;">Shortcuts</div>
            <div style="margin-top:8px; font-size:13px; opacity:0.9;">Toggle panels: G, Open Settings: icon, Turn off: ⌘ /</div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(settingsModal);
    const closeBtn = settingsModal.querySelector('#glass-settings-close');
    closeBtn.addEventListener('click', closeSettingsModal);
    settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) closeSettingsModal(); });

    // Load preferences and bind listeners
    try {
      chrome.storage.sync.get({ glass_shortcut_enabled: true, glass_autoshow: false, glass_reduce_motion: false, openrouter_key: '', openrouter_model: 'deepseek/deepseek-r1:free', openrouter_enabled: true }, (res) => {
        const cbShortcut = settingsModal.querySelector('#glass-pref-shortcut');
        const cbAutoshow = settingsModal.querySelector('#glass-pref-autoshow');
        const cbReduce = settingsModal.querySelector('#glass-pref-reduce');
        const orKey = settingsModal.querySelector('#glass-or-key');
        const orModel = settingsModal.querySelector('#glass-or-model');
        const orEnabled = settingsModal.querySelector('#glass-or-enabled');
        if (cbShortcut) { cbShortcut.checked = !!res.glass_shortcut_enabled; cbShortcut.addEventListener('change', () => { chrome.storage.sync.set({ glass_shortcut_enabled: cbShortcut.checked }); attachShortcutListener(cbShortcut.checked); }); }
        if (cbAutoshow) { cbAutoshow.checked = !!res.glass_autoshow; cbAutoshow.addEventListener('change', () => { chrome.storage.sync.set({ glass_autoshow: cbAutoshow.checked }); }); }
        if (cbReduce) { cbReduce.checked = !!res.glass_reduce_motion; cbReduce.addEventListener('change', () => { chrome.storage.sync.set({ glass_reduce_motion: cbReduce.checked }); }); }
        if (orKey) { orKey.value = res.openrouter_key || ''; orKey.addEventListener('change', () => { chrome.storage.sync.set({ openrouter_key: orKey.value }); }); }
        if (orModel) { orModel.value = res.openrouter_model || 'deepseek/deepseek-r1:free'; orModel.addEventListener('change', () => { chrome.storage.sync.set({ openrouter_model: orModel.value }); }); }
        if (orEnabled) { orEnabled.checked = !!res.openrouter_enabled; orEnabled.addEventListener('change', () => { chrome.storage.sync.set({ openrouter_enabled: orEnabled.checked }); }); }
      });
    } catch (_) {}
  }

  // Audio visualization using Web Audio API
  let audioStream = null;
  let audioCtx = null;
  let analyser = null;
  let rafId = null;
  const NUM_BARS = 4;
  const barsContainer = root.querySelector('#glass-audio-bars');
  if (barsContainer) {
    for (let i = 0; i < NUM_BARS; i++) {
      const span = document.createElement('span');
      span.style.height = '6px';
      barsContainer.appendChild(span);
    }
  }

  function startAudioVisualization() {
    if (!barsContainer || audioCtx) return;
    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        audioStream = stream;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const bars = Array.from(barsContainer.children);
        const bandEdges = [2, 6, 14, 40, 90]; // rough low→high bands (indices)
        const maxH = 28;
        const prevHeights = new Array(NUM_BARS).fill(6);
        function draw() {
          rafId = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);
          // Compute band averages
          const bandAvg = [];
          for (let b = 0; b < 4; b++) {
            const start = bandEdges[b];
            const end = bandEdges[b + 1];
            let sum = 0, count = 0;
            for (let j = start; j < end; j++) { sum += dataArray[j] || 0; count++; }
            bandAvg[b] = count ? (sum / count) : 0; // 0..255
          }
          // Map to bars: left=low, centers=weighted mids, right=high
          const displayAvg = [
            bandAvg[0],
            bandAvg[1] * 0.6 + bandAvg[2] * 0.4,
            bandAvg[1] * 0.4 + bandAvg[2] * 0.6,
            bandAvg[3],
          ];
          for (let i = 0; i < NUM_BARS; i++) {
            const avg = displayAvg[i];
            const norm = Math.min(1, Math.sqrt(avg / 255) * 1.5); // sensitive
            const target = Math.max(6, Math.min(maxH, norm * maxH));
            const smooth = prevHeights[i] * 0.5 + target * 0.5;
            prevHeights[i] = smooth;
            bars[i].style.height = smooth + 'px';
            bars[i].style.opacity = 0.6 + 0.4 * (smooth / maxH);
          }
        }
        draw();
      }).catch(() => {
        // Fallback: subtle idle animation
        idleBarsAnimation();
      });
    } catch (_) {
      idleBarsAnimation();
    }
  }

  function idleBarsAnimation() {
    if (!barsContainer) return;
    const bars = Array.from(barsContainer.children);
    let t = 0;
    function loop() {
      rafId = requestAnimationFrame(loop);
      t += 0.15;
      const amps = [1.0, 0.8, 0.8, 1.0];
      bars.forEach((b, i) => {
        const h = 10 + Math.sin(t + i * 0.9) * 10 * amps[i];
        b.style.height = Math.max(6, Math.min(28, h)) + 'px';
        b.style.opacity = 0.65 + 0.35 * Math.abs(Math.sin(t + i * 0.4));
      });
    }
    loop();
  }

  function stopAudioVisualization() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (analyser && audioCtx) { try { analyser.disconnect(); } catch(_){} }
    if (audioCtx) { try { audioCtx.close(); } catch(_){} audioCtx = null; }
    if (audioStream) { audioStream.getTracks().forEach(t => t.stop()); audioStream = null; }
    // Reset bars
    if (barsContainer) Array.from(barsContainer.children).forEach((b) => { b.style.height = '6px'; b.style.opacity = '0.8'; });
  }
  // End audio visualization

  // Mic toggle logic with persistence
  const micToggle = root.querySelector('#glass-mic-toggle');
  const micIcon = root.querySelector('#glass-mic-icon');
  const micOffDot = root.querySelector('#glass-mic-off-dot');
  const timerEl = root.querySelector('#glass-timer');
  let isGlassVisible = false;
  let micEnabled = false;
  let micStateLoaded = false;
  let timerAccumMs = 0;
  let timerLastStart = null;
  let timerId = null;
  function formatTime(ms) {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  function renderTimer(ms) { if (timerEl) timerEl.textContent = formatTime(ms); }
  function startTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
    timerLastStart = Date.now();
    timerId = setInterval(() => {
      renderTimer(timerAccumMs + (Date.now() - timerLastStart));
    }, 250);
  }
  function stopTimer() {
    if (!timerId) return;
    timerAccumMs += Date.now() - (timerLastStart || Date.now());
    clearInterval(timerId);
    timerId = null;
    renderTimer(timerAccumMs);
  }
  function resetTimer() { timerAccumMs = 0; timerLastStart = null; renderTimer(0); }
  function updateMicUI() {
    if (!micIcon) return;
    if (micEnabled) {
      micIcon.src = `${chrome.runtime.getURL('icons/mic-on.svg')}`;
      micIcon.alt = 'Mic on';
      micToggle.setAttribute('aria-pressed', 'true');
      if (isGlassVisible && micStateLoaded) { startAudioVisualization(); startTimer(); }
      if (micOffDot) micOffDot.style.display = 'none';
    } else {
      micIcon.src = `${chrome.runtime.getURL('icons/mic-off.svg')}`;
      micIcon.alt = 'Mic off';
      micToggle.setAttribute('aria-pressed', 'false');
      stopAudioVisualization();
      if (micOffDot) micOffDot.style.display = 'inline-block';
      stopTimer();
    }
  }
  function synchronizeMicAndTimer() { if (!micStateLoaded) { return; } if (micEnabled) { startAudioVisualization(); startTimer(); if (micOffDot) micOffDot.style.display = 'none'; } else { stopAudioVisualization(); stopTimer(); if (micOffDot) micOffDot.style.display = 'inline-block'; } }
  if (micToggle) {
    micToggle.addEventListener('click', () => {
      micEnabled = !micEnabled;
      try { chrome.storage.sync.set({ glass_mic_enabled: micEnabled }); } catch(_) {}
      updateMicUI();
    });
  }
  try {
    chrome.storage.sync.get({ glass_mic_enabled: false }, (res) => {
      micEnabled = !!res.glass_mic_enabled;
      micStateLoaded = true;
      resetTimer();
      updateMicUI();
    });
  } catch(_) { updateMicUI(); }

  // --- Real-time speech monitoring for misinformation (updates live panels) ---
  const liveSummaryEl = () => root.querySelector('#glass-live-summary');
  const liveHighlightsEl = () => root.querySelector('#glass-live-highlights');
  const liveClaimEl = () => root.querySelector('#glass-live-claim');
  const liveExplainEl = () => root.querySelector('#glass-live-explain');
  const liveSourcesEl = () => root.querySelector('#glass-live-sources');
  const liveTranscriptEl = () => root.querySelector('#glass-live-transcript');
  let transcriptBuffer = '';
  let transcriptLastAnalyzedAt = 0;
  const TRANSCRIPT_ANALYZE_MS = 6000;
  // Keep the most recent AI finding for the reasoning modal
  let latestFinding = null;

  let speechStream = null;
  let speechRecorder = null;
  let speechChunks = [];
  let speechLastSentAt = 0;
  const SPEECH_SEND_MS = 5000; // send every 5s while speaking
  // Web Speech API (low-latency on-device) – preferred when available
  let webSpeechRec = null;
  let webSpeechActive = false;
  let webSpeechInterim = '';
  let lastImmediateKey = '';

  async function startSpeechMonitor() {
    try {
      // Prefer Web Speech API for instant captions
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        webSpeechRec = new SR();
        webSpeechRec.continuous = true;
        webSpeechRec.interimResults = true;
        webSpeechRec.lang = 'en-US';
        webSpeechRec.onresult = (event) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i];
            const txt = res[0]?.transcript || '';
            if (!txt) continue;
            if (res.isFinal) {
              webSpeechInterim = '';
              const line = txt.trim();
              if (line) {
                appendTranscript(line);
                quickDetectAndUpdate(line);
                factCheckTextSnippet(line);
              }
            } else {
              webSpeechInterim = txt;
              // show interim as faint line
              const el = liveTranscriptEl(); if (el) {
                let ghost = el.querySelector('#glass-transcript-interim');
                if (!ghost) { ghost = document.createElement('p'); ghost.id = 'glass-transcript-interim'; ghost.style.cssText = 'margin:0 0 6px 0; opacity:0.5; font-size:13px; line-height:1.4; font-style:italic;'; el.appendChild(ghost); }
                ghost.textContent = webSpeechInterim;
                el.scrollTop = el.scrollHeight;
              }
              quickDetectAndUpdate(webSpeechInterim);
            }
          }
        };
        webSpeechRec.onerror = () => {};
        webSpeechRec.onend = () => { if (micEnabled && webSpeechActive) { try { webSpeechRec.start(); } catch(_) {} } };
        webSpeechRec.start();
        webSpeechActive = true;
        showToast('Fast transcription enabled', 'info');
        // Do not start MediaRecorder path while Web Speech is running
        return;
      }
      // Fallback to MediaRecorder chunk flow
      if (!speechStream) {
        speechStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        speechRecorder = new MediaRecorder(speechStream, { mimeType: 'audio/webm' });
        speechRecorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) speechChunks.push(e.data); };
        speechRecorder.onstop = () => {};
        speechRecorder.start(1000);
        tickSpeechSend();
      }
    } catch (e) {
      console.warn('Glass: speech monitor unavailable', e);
    }
  }
  function stopSpeechMonitor() {
    try { if (webSpeechRec) { webSpeechActive = false; try { webSpeechRec.stop(); } catch(_) {}; webSpeechRec = null; } } catch(_) {}
    try { if (speechRecorder && speechRecorder.state !== 'inactive') speechRecorder.stop(); } catch(_) {}
    try { if (speechStream) { speechStream.getTracks().forEach(t=>t.stop()); } } catch(_) {}
    speechStream = null; speechRecorder = null; speechChunks = []; webSpeechInterim = '';
  }
  async function tickSpeechSend() {
    if (!micEnabled) { stopSpeechMonitor(); return; }
    const now = Date.now();
    if ((now - speechLastSentAt) >= SPEECH_SEND_MS && speechChunks.length) {
      const blob = new Blob(speechChunks.splice(0), { type: 'audio/webm' });
      const base64 = await blobToBase64(blob);
      analyzeSpeechChunk(base64).catch(()=>{});
      speechLastSentAt = now;
    }
    setTimeout(tickSpeechSend, 1000);
  }
  function blobToBase64(blob) { return new Promise((resolve) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.readAsDataURL(blob); }); }

  async function analyzeSpeechChunk(audioB64) {
    try {
      // 1) Transcribe
      const tr = await fetch('/api/transcribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ audioBase64: audioB64 }) });
      const trData = await tr.json();
      if (!tr.ok || !trData?.text) { showToast('Transcription failed', 'error'); return; }
      const text = String(trData.text).trim();
      if (text) appendTranscript(text);
      // 2) Fact-check transcript snippet
      const resp = await fetch('/api/text', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      const data = await resp.json();
      if (!resp.ok) return;
      const findings = Array.isArray(data?.findings) ? data.findings : [];
      if (!findings.length) return;
      // Update right panel claim with first item
      const first = findings[0];
      const claimEl = liveClaimEl(); if (claimEl) { claimEl.innerHTML = `"${escapeHtml(first.snippet || '')}" <span style="margin-left:12px; ${first.verdict==='false'?'color:#fca5a5;':'color:#6ee7b7;'}">${first.verdict==='false'?'Inaccurate':'True'}</span>`; }
      const explainEl = liveExplainEl(); if (explainEl) {
        explainEl.innerHTML = '';
        const li = document.createElement('li'); li.textContent = `• ${first.reason || ''}`; explainEl.appendChild(li);
      }
      const srcEl = liveSourcesEl(); if (srcEl) {
        srcEl.innerHTML = '';
        (first.citations || []).slice(0,3).forEach((u) => {
          const btn = document.createElement('button');
          btn.style.cssText = 'padding:8px 12px; margin-right:8px; margin-bottom:8px; border-radius:9999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:white; cursor:pointer; text-decoration:underline; font-family:inherit;';
          btn.textContent = (new URL(u).hostname) + ' →';
          btn.onclick = () => window.open(u, '_blank');
          srcEl.appendChild(btn);
        });
      }
      // Update left panel summary/highlights/actions
      const sumEl = liveSummaryEl(); if (sumEl) sumEl.textContent = 'Detected a claim that needs review.';
      const hiEl = liveHighlightsEl(); if (hiEl) {
        hiEl.innerHTML = '';
        findings.slice(0,3).forEach((f) => {
          const li = document.createElement('li'); li.style.marginBottom = '8px'; li.textContent = `• ${f.verdict==='false'?'Inaccurate: ':''}${f.snippet}`; hiEl.appendChild(li);
        });
      }
      const actEl = liveActionsEl(); if (actEl) {
        actEl.innerHTML = '';
        const acts = [
          { label: '🔍 View sources', run: () => { const s = liveSourcesEl(); if (s) s.scrollIntoView({ behavior:'smooth' }); } },
          { label: '📰 Search reputable coverage', run: () => window.open(`https://news.google.com/search?q=${encodeURIComponent(first.snippet||'')}`, '_blank') },
          { label: '📊 Check official stats', run: () => window.open('https://bjs.ojp.gov/', '_blank') },
        ];
        acts.forEach(a => {
          const btn = document.createElement('button');
          btn.style.cssText = 'width:100%; text-align:left; padding:12px 16px; margin-bottom:8px; border-radius:12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.2); color:white; cursor:pointer; font-family:inherit;';
          btn.textContent = a.label; btn.onclick = a.run; actEl.appendChild(btn);
        });
      }
    } catch (e) { console.warn('Glass: analyzeSpeechChunk failed', e); }
  }
  function liveActionsEl() { return root.querySelector('#glass-live-actions'); }
  function appendTranscript(line) {
    const el = liveTranscriptEl(); if (!el) return;
    const ghost = el.querySelector('#glass-transcript-interim'); if (ghost) try { ghost.remove(); } catch(_) {}
    const p = document.createElement('p');
    p.style.cssText = 'margin:0 0 6px 0; opacity:0.9; font-size:13px; line-height:1.4;';
    p.textContent = line;
    el.appendChild(p);
    // keep last 40 lines
    while (el.childElementCount > 40) el.removeChild(el.firstElementChild);
    el.scrollTop = el.scrollHeight;
    // Update rolling transcript buffer
    transcriptBuffer = (transcriptBuffer + ' ' + line).slice(-8000);
    scheduleTranscriptAnalysis();
  }

  async function factCheckTextSnippet(text) {
    try {
      const resp = await fetch('/api/text', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      const data = await resp.json(); if (!resp.ok) return;
      const findings = Array.isArray(data?.findings) ? data.findings : [];
      if (!findings.length) return;
      const first = findings[0];
      const verdict = String(first.verdict || '').toLowerCase();
      const claimEl = liveClaimEl(); if (claimEl) { claimEl.innerHTML = `"${escapeHtml(first.snippet || '')}" <span style="margin-left:12px; ${verdict==='false'||verdict==='incorrect'?'color:#fca5a5;':'color:#6ee7b7;'}">${verdict==='false'||verdict==='incorrect'?'Inaccurate':'True'}</span>`; }
      const explainEl = liveExplainEl(); if (explainEl) { explainEl.innerHTML = ''; const li = document.createElement('li'); li.textContent = `• ${first.reason || ''}`; explainEl.appendChild(li); }
      const srcEl = liveSourcesEl(); if (srcEl) {
        srcEl.innerHTML='';
        const cites = Array.isArray(first.citations) ? first.citations.slice(0,3) : [];
        if (cites.length === 0) {
          const b=document.createElement('button'); b.style.cssText='padding:8px 12px; margin-right:8px; margin-bottom:8px; border-radius:9999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:white; cursor:pointer; text-decoration:underline; font-family:inherit;'; b.textContent='Search news →'; b.onclick=()=>window.open(`https://news.google.com/search?q=${encodeURIComponent(first.snippet||'')}`,'_blank'); srcEl.appendChild(b);
        } else {
          cites.forEach((u)=>{ try { const url = new URL(u); const b=document.createElement('button'); b.style.cssText='padding:8px 12px; margin-right:8px; margin-bottom:8px; border-radius:9999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:white; cursor:pointer; text-decoration:underline; font-family:inherit;'; b.textContent=(url.hostname)+' →'; b.onclick=()=>window.open(url.toString(),'_blank'); srcEl.appendChild(b); } catch(_){} });
        }
      }
      const actEl = liveActionsEl(); if (actEl) {
        actEl.innerHTML='';
        const acts = [
          { label: '🔍 View sources', run: () => { const s = liveSourcesEl(); if (s) s.scrollIntoView({ behavior:'smooth' }); } },
          { label: '📰 Search reputable coverage', run: () => window.open(`https://news.google.com/search?q=${encodeURIComponent(first.snippet||'')}`, '_blank') },
          { label: '📊 Check official stats', run: () => window.open('https://bjs.ojp.gov/', '_blank') },
        ];
        acts.forEach(a => { const btn = document.createElement('button'); btn.style.cssText = 'width:100%; text-align:left; padding:12px 16px; margin-bottom:8px; border-radius:12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.2); color:white; cursor:pointer; font-family:inherit;'; btn.textContent = a.label; btn.onclick = a.run; actEl.appendChild(btn); });
      }
      const sumEl = liveSummaryEl(); if (sumEl) { const s = typeof data?.summary === 'string' ? data.summary.trim() : ''; if (s) sumEl.textContent = s; }
    } catch (_) {}
  }

  function quickDetectAndUpdate(text) {
    try {
      const lower = String(text || '').toLowerCase();
      // Quick patterns: "<name> is dead/died" rumors
      const m = lower.match(/\b([a-z][a-z\s.'-]{1,40})\s+(is|was|has)\s+(dead|died)\b/);
      if (m) {
        const name = m[1].trim();
        const key = `death:${name}`;
        if (key === lastImmediateKey) return;
        lastImmediateKey = key;
        const claimEl = liveClaimEl(); if (claimEl) { claimEl.innerHTML = `"${escapeHtml(text.trim())}" <span style="margin-left:12px; color:#fca5a5;">Inaccurate</span>`; }
        const explainEl = liveExplainEl(); if (explainEl) { explainEl.innerHTML=''; const li=document.createElement('li'); li.textContent = `• Death rumor detected about ${name}. Verifying…`; explainEl.appendChild(li); }
      }
    } catch(_) {}
  }

  // Start/stop speech monitor with mic toggle
  function updateSpeechMonitor() {
    if (micEnabled) startSpeechMonitor(); else stopSpeechMonitor();
  }
  // observe mic state changes
  const micStateObserver = new MutationObserver(() => updateSpeechMonitor());
  if (micToggle) micStateObserver.observe(micToggle, { attributes: true, attributeFilter: ['aria-pressed'] });
  // initial sync
  updateSpeechMonitor();

  // --- Live Fact-Checking (heuristic, non-invasive DOM overlay) ---
  let factCheckEnabled = false;
  const fcOverlays = new Set(); // of { rectEl: HTMLElement, badgeEl: HTMLElement, targetRange: Range, rectIndex: number }
  let fcScanScheduled = false;
  let fcLastScanAt = 0;
  const MAX_FC_OVERLAYS = 8; // avoid flooding the page
  const aiCache = new Map(); // key -> { verdict: 'incorrect'|'unknown', ts }
  const AI_CACHE_TTL_MS = 5 * 60 * 1000;
  let aiInFlight = 0;
  const AI_MAX_CONCURRENT = 2;
  // Cooldown and content-change detection to avoid re-analyzing on scroll
  let aiLastRunAt = 0;
  let aiLastItemsKey = '';
  const AI_COOLDOWN_MS = 45000; // 45s between AI analyses unless content changed

  // Analysis modal & toasts
  let analysisModal = null;
  function showAnalysisModal(text) {
    try {
      if (analysisModal) return;
      analysisModal = document.createElement('div');
      analysisModal.style.cssText = 'position: fixed; inset: 0; z-index: 2147483646; background: rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; pointer-events:auto;';
      analysisModal.innerHTML = `
        <div style="min-width:280px; max-width: 420px; border-radius:14px; padding:18px; background: rgba(30,30,30,0.7); border:1px solid rgba(255,255,255,0.2); color:white; text-align:center; backdrop-filter: blur(8px)">
          <div style="display:flex; gap:10px; align-items:center; justify-content:center;">
            <div class="glass-spinner" style="width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation: glassSpin 0.9s linear infinite"></div>
            <span style="font-size:14px;">${text || 'Analyzing page…'}</span>
          </div>
        </div>`;
      const spinStyle = document.createElement('style');
      spinStyle.textContent = '@keyframes glassSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}';
      analysisModal.appendChild(spinStyle);
      root.appendChild(analysisModal);
    } catch(_) {}
  }
  function hideAnalysisModal() {
    try { if (analysisModal) { analysisModal.remove(); analysisModal = null; } } catch(_) {}
  }
  function showToast(text, kind) {
    try {
      const note = document.createElement('div');
      note.textContent = text;
      note.style.cssText = `position:fixed; top: 88px; left:50%; transform:translateX(-50%); background: ${kind==='error'?'rgba(190,30,30,0.9)':'rgba(0,0,0,0.7)'}; color:#fff; padding:8px 12px; border-radius:9999px; font-size:12px; z-index:2147483646; pointer-events:none;`;
      root.appendChild(note);
      setTimeout(() => { try { note.remove(); } catch(_) {} }, 2200);
    } catch(_) {}
  }

  function showReasoningModal(finding) {
    try {
      if (!finding) { showToast('No reasoning available yet', 'error'); return; }
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:fixed; inset:0; z-index:2147483647; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.45); pointer-events:auto;';
      const card = document.createElement('div');
      card.className = 'glass-animate-in';
      card.style.cssText = 'max-width:720px; width:92vw; border-radius:14px; padding:18px; background:rgba(30,30,30,0.8); border:1px solid rgba(255,255,255,0.2); color:white; font-family:inherit; text-shadow:0 2px 8px rgba(0,0,0,0.6)';
      const title = document.createElement('div');
      title.style.cssText = 'display:flex; align-items:center; justify-content:space-between; gap:12px;';
      const h = document.createElement('span'); h.style.cssText = 'font-weight:700; font-size:18px;'; h.textContent = 'Reasoning';
      const close = document.createElement('button'); close.textContent = 'Close'; close.style.cssText = 'background:transparent; color:white; border:1px solid rgba(255,255,255,0.25); border-radius:9999px; padding:6px 12px; cursor:pointer;';
      title.appendChild(h); title.appendChild(close);
      const body = document.createElement('div'); body.style.cssText = 'margin-top:12px; display:grid; gap:10px;';
      const snippet = document.createElement('p'); snippet.style.cssText='opacity:0.9;'; snippet.textContent = finding.snippet || '';
      const verdict = String(finding.verdict||'').toLowerCase();
      const verdictLine = document.createElement('p'); verdictLine.style.cssText='opacity:0.9;'; verdictLine.textContent = verdict==='false' || verdict==='incorrect' ? 'Verdict: Inaccurate' : (verdict==='misleading' ? 'Verdict: Misleading' : 'Verdict: Unclear');
      const correction = document.createElement('p'); correction.style.cssText='opacity:0.9;'; correction.textContent = finding.correction ? `Correction: ${finding.correction}` : '';
      const reason = document.createElement('p'); reason.style.cssText='opacity:0.9;'; reason.textContent = finding.reason ? `Why: ${finding.reason}` : '';
      const cites = document.createElement('div');
      const list = document.createElement('div'); list.style.cssText='margin-top:6px;';
      const c = Array.isArray(finding.citations) ? finding.citations.slice(0,5) : [];
      if (c.length) {
        c.forEach((u)=>{ try { const url=new URL(u); const btn=document.createElement('button'); btn.style.cssText='padding:8px 12px; margin-right:8px; margin-bottom:8px; border-radius:9999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:white; cursor:pointer; text-decoration:underline; font-family:inherit;'; btn.textContent=(url.hostname)+' →'; btn.onclick=()=>window.open(url.toString(),'_blank'); list.appendChild(btn);} catch(_){} });
      }
      cites.appendChild(list);
      body.appendChild(snippet); body.appendChild(verdictLine); if (correction.textContent) body.appendChild(correction); if (reason.textContent) body.appendChild(reason); body.appendChild(cites);
      card.appendChild(title); card.appendChild(body);
      wrap.appendChild(card);
      wrap.addEventListener('click', (e)=>{ if (e.target === wrap) try { wrap.remove(); } catch(_){} });
      close.addEventListener('click', ()=>{ try { wrap.remove(); } catch(_){} });
      document.body.appendChild(wrap);
    } catch(_) {}
  }

  function throttle(fn, delay) {
    let pending = false, lastArgs = null;
    return function(...args) {
      lastArgs = args;
      if (pending) return;
      pending = true;
      setTimeout(() => { pending = false; fn.apply(null, lastArgs); }, delay);
    };
  }

  function isElementVisible(el) {
    if (!el || !(el instanceof Element)) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    if (rect.bottom < 0 || rect.top > window.innerHeight) return false;
    const style = window.getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity || '1') === 0) return false;
    return true;
  }

  function sentenceCandidatesFrom(el) {
    const text = (el.textContent || '').trim();
    if (!text) return [];
    // Handle very short inputs (like search bars)
    if (text.length < 40) {
      if (/\b(is|are|was|were|has|have|died|dead|killed|only|always|never|largest|biggest|top|%|percent|\d)/i.test(text)) {
        return [text];
      }
      return [];
    }
    const sentences = text
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
      .filter(s => s && /\b(is|are|was|were|has|have|died|dead|killed|accounts?|constitutes?|represents?|only|always|never|largest|biggest|top|%|percent|\d)/i.test(s));
    return sentences.slice(0, 6); // cap per element for perf
  }

  function sentencesFromElementAll(el) {
    const text = (el.textContent || '').trim();
    if (!text) return [];
    const sentences = text
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
      .map(s => s.trim())
      .filter(s => s && s.length >= 12 && s.length <= 400);
    return sentences.slice(0, 12);
  }

  function collectFullTextAndElements(charLimit = 16000) {
    const elements = Array.from(document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, article, section, main, div'))
      .filter(el => el && !root.contains(el) && isElementVisible(el))
      .slice(0, 600);
    let total = 0;
    const parts = [];
    for (const el of elements) {
      const t = (el.textContent || '').trim();
      if (!t) continue;
      if (total + t.length > charLimit) break;
      parts.push(t);
      total += t.length;
    }
    const fullText = parts.join('\n');
    return { elements, fullText };
  }

  function looksLikeDisclaimer(sentence) {
    return /(may|might|can|could|often|sometimes|generally|typically|varies|depends|not\s+necessarily|approximately|about|around|roughly)/i.test(sentence);
  }

  function computeClaimScore(sentence) {
    // Lightweight scoring to reduce false positives
    let score = 0;
    const s = sentence.trim();
    const lower = s.toLowerCase();
    if (s.length >= 20 && s.length <= 280) score += 0.5; // reasonable length
    if (/(only|always|never|largest|biggest|top|all|every|none)/i.test(s)) score += 1.0; // absolutist
    if (/(\b\d{1,3}(?:,\d{3})+\b|\b\d+\b|%|percent)/.test(s)) score += 0.8; // numeric/percent
    if (/(is|are|was|were|has|have|accounts?|constitutes?|represents?)/i.test(s)) score += 0.6; // verb pattern
    if (/(dead|died|killed|orbits|revolves|flat)/i.test(s)) score += 0.8; // common myth cues
    if (/\b(according\s+to|sources?|report|study|studies)\b/i.test(s)) score -= 0.3; // softer
    if (looksLikeDisclaimer(s)) score -= 0.8; // hedge -> likely not a firm claim
    if (s.length < 40 && /(dead|died|killed)/i.test(s)) score += 1.2; // short high-signal rumors
    return score;
  }

  async function quickHeuristicCheck(sentence) {
    // Fast, free heuristic using Wikipedia + rule-based detectors for common myths
    const s = sentence.trim();
    const lower = s.toLowerCase();

    // Rule-based quick rejects for common misinformation patterns
    if (/\bthe\s+sun\s+(orbits|revolves)\s+the\s+earth\b/i.test(s)) return 'incorrect';
    if (/\bearth\b.*\bis\s+flat\b/i.test(s)) return 'incorrect';
    // Death rumor fast-path using Wikipedia summary (alive check)
    const deathMatch = s.match(/^\s*([A-Z][A-Za-z\s.'-]{1,80}?)\s+(?:is|was)\s+(?:dead|died)\b/i);
    if (deathMatch) {
      const subject = deathMatch[1].trim();
      try {
        const q = encodeURIComponent(subject);
        const resp = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${q}&format=json&origin=*`, { cache: 'no-store' });
        const data = await resp.json();
        const hit = data && data.query && data.query.search && data.query.search[0];
        if (hit) {
          const title = encodeURIComponent(hit.title);
          const sresp = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
          if (sresp.ok) {
            const sum = await sresp.json();
            const summary = (sum && (sum.extract || '')) || '';
            const aliveLikely = /\b(born\s+\d{4})\b/i.test(summary) && !/\b(died|death)\b/i.test(summary);
            if (aliveLikely) return 'incorrect';
          }
        }
      } catch(_) {}
    }
    if (/\bmount\s+everest\b/i.test(lower)) {
      const numMatch = s.match(/(\d{1,3}(?:,\d{3})+|\d{4,})\s*(m|meters|metres)/i);
      if (numMatch) {
        const raw = numMatch[1].replace(/,/g, '');
        const meters = parseInt(raw, 10);
        if (!isNaN(meters) && (meters > 10000 || meters < 5000)) return 'incorrect';
      }
    }
    if (/\bnigeria\b.*\b(15%|15\s*percent)\b.*\b(world|global)\b.*\boil\b.*\bexports?\b/i.test(lower)) return 'incorrect';

    // Wikipedia-based heuristic with expanded triggers
    const absolutist = /(only|always|never|largest|biggest|top|100%|all time|ever|dead|died|killed|flat|orbits|revolves)/i.test(s);
    try {
      const q = encodeURIComponent(s.slice(0, 140));
      const resp = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${q}&format=json&origin=*`, { cache: 'no-store' });
      const data = await resp.json();
      const hit = data && data.query && data.query.search && data.query.search[0];
      if (!hit) return 'unknown';
      const title = encodeURIComponent(hit.title);
      const sresp = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
      if (!sresp.ok) return 'unknown';
      const sum = await sresp.json();
      const summary = (sum && (sum.extract || '')) || '';
      const sentWords = s.toLowerCase().match(/[a-z0-9%]+/g) || [];
      const keyWords = sentWords.filter(w => w.length > 3);
      let overlap = 0;
      for (const w of keyWords) { if (summary.toLowerCase().includes(w)) overlap++; }
      const coverage = keyWords.length ? overlap / keyWords.length : 0;
      if (absolutist && keyWords.length >= 5 && coverage < 0.2) return 'incorrect';
      return 'unknown';
    } catch(_) {
      return 'unknown';
    }
  }

  async function aiFactCheck(sentence) {
    // Cached + rate-limited call via background worker
    try {
      const key = sentence.trim().slice(0, 160).toLowerCase();
      const cached = aiCache.get(key);
      const now = Date.now();
      if (cached && now - cached.ts < AI_CACHE_TTL_MS) return cached.verdict;

      if (aiInFlight >= AI_MAX_CONCURRENT) return 'unknown';
      aiInFlight++;
      const { ok, text } = await new Promise((resolve) => {
        try {
          chrome.runtime.sendMessage({ type: 'GLASS_AI_FACTCHECK_SINGLE', sentence }, (resp) => resolve(resp || { ok: false }));
        } catch(_) { resolve({ ok: false }); }
      });
      aiInFlight--;
      if (!ok) return 'unknown';
      const norm = String(text).toLowerCase();
      const verdict = /incorrect|false|not\s+true|fake/.test(norm) ? 'incorrect' : (/correct|true/.test(norm) ? 'correct' : 'unknown');
      aiCache.set(key, { verdict, ts: now });
      return verdict;
    } catch(_) {
      aiInFlight = Math.max(0, aiInFlight - 1);
      console.warn('Glass: AI fact-check error');
      return 'unknown';
    }
  }

  function buildRangeForSentenceInElement(el, sentence) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let idxInEl = 0;
    let startNode = null, startOffset = 0, endNode = null, endOffset = 0;
    let startIndex = -1;
    // Build concatenated text while tracking nodes
    const target = sentence.trim();
    const lowerTarget = target.toLowerCase();
    let concat = '';
    const nodes = [];
    while (walker.nextNode()) { const n = walker.currentNode; nodes.push(n); concat += n.nodeValue; }
    const hay = concat.toLowerCase();
    const foundAt = hay.indexOf(lowerTarget);
    if (foundAt === -1) return null;
    let pos = 0;
    for (const n of nodes) {
      const text = n.nodeValue;
      const nextPos = pos + text.length;
      if (startNode === null && foundAt >= pos && foundAt < nextPos) { startNode = n; startOffset = foundAt - pos; }
      if (startNode && (foundAt + target.length) <= nextPos) { endNode = n; endOffset = (foundAt + target.length) - pos; break; }
      pos = nextPos;
    }
    if (!startNode || !endNode) return null;
    const range = document.createRange();
    try { range.setStart(startNode, Math.max(0, startOffset)); range.setEnd(endNode, Math.max(0, endOffset)); } catch(_) { return null; }
    return range;
  }

  function clearFactCheckOverlays() {
    fcOverlays.forEach(obj => {
      try { if (obj.rectEl && obj.rectEl.remove) obj.rectEl.remove(); } catch(_) {}
      try { if (obj.badgeEl && obj.badgeEl.remove) obj.badgeEl.remove(); } catch(_) {}
    });
    fcOverlays.clear();
  }

  function placeOverlaysForRange(range, label) {
    if (!range) return;
    const rects = Array.from(range.getClientRects());
    if (!rects.length) return;
    rects.forEach((r, i) => {
      // Skip offscreen rects
      if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) return;
      const box = document.createElement('div');
      box.className = 'glass-fc-highlight';
      box.style.left = Math.max(0, r.left) + 'px';
      box.style.top = Math.max(0, r.top) + 'px';
      box.style.width = Math.max(0, Math.min(window.innerWidth - r.left, r.width)) + 'px';
      box.style.height = Math.max(0, Math.min(window.innerHeight - r.top, r.height)) + 'px';
      const badge = i === 0 ? document.createElement('div') : null;
      if (badge) {
        badge.className = 'glass-fc-badge';
        badge.textContent = label || 'Potential misinformation';
        badge.style.left = (Math.max(0, r.left) + 2) + 'px';
        badge.style.top = (Math.max(0, r.top) - 14) + 'px';
      }
      root.appendChild(box);
      if (badge) root.appendChild(badge);
      fcOverlays.add({ rectEl: box, badgeEl: badge, targetRange: range, rectIndex: i });
    });
  }

  function updateOverlayPositions() {
    try {
      fcOverlays.forEach((entry) => {
        const rects = Array.from(entry.targetRange.getClientRects());
        const r = rects[entry.rectIndex];
        if (!r) {
          // Hide if target moved out
          if (entry.rectEl) entry.rectEl.style.opacity = '0';
          if (entry.badgeEl) entry.badgeEl.style.opacity = '0';
          return;
        }
        if (entry.rectEl) {
          entry.rectEl.style.left = Math.max(0, r.left) + 'px';
          entry.rectEl.style.top = Math.max(0, r.top) + 'px';
          entry.rectEl.style.width = Math.max(0, Math.min(window.innerWidth - r.left, r.width)) + 'px';
          entry.rectEl.style.height = Math.max(0, Math.min(window.innerHeight - r.top, r.height)) + 'px';
          entry.rectEl.style.opacity = '1';
        }
        if (entry.badgeEl && entry.rectIndex === 0) {
          entry.badgeEl.style.left = (Math.max(0, r.left) + 2) + 'px';
          entry.badgeEl.style.top = (Math.max(0, r.top) - 14) + 'px';
          entry.badgeEl.style.opacity = '1';
        }
      });
    } catch(_) {}
  }

  function placeOverlayForElementRect(el, label) {
    if (!el || !(el instanceof Element)) return;
    const r = el.getBoundingClientRect();
    if (!r || r.width === 0 || r.height === 0) return;
    const box = document.createElement('div');
    box.className = 'glass-fc-highlight';
    box.style.left = Math.max(0, r.left) + 'px';
    box.style.top = Math.max(0, r.top) + 'px';
    box.style.width = Math.max(0, Math.min(window.innerWidth - r.left, r.width)) + 'px';
    box.style.height = Math.max(0, Math.min(window.innerHeight - r.top, r.height)) + 'px';
    const badge = document.createElement('div');
    badge.className = 'glass-fc-badge';
    badge.textContent = label || 'Likely false';
    badge.style.left = (Math.max(0, r.left) + 2) + 'px';
    badge.style.top = (Math.max(0, r.top) - 14) + 'px';
    root.appendChild(box);
    root.appendChild(badge);
    fcOverlays.add({ rectEl: box, badgeEl: badge, targetRange: null });
  }

  async function getAIConfig() {
    return await new Promise((resolve) => {
      try {
        chrome.storage.sync.get({ openrouter_enabled: true, openrouter_key: '', openrouter_model: 'deepseek/deepseek-r1:free' }, (res) => resolve(res));
      } catch(_) { resolve({ openrouter_enabled: false }); }
    });
  }

  function collectVisibleClaimsForAI(charLimit = 6000, itemLimit = 60) {
    const elements = Array.from(document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, article, section, main, div'))
      .filter(el => el && !root.contains(el) && isElementVisible(el))
      .slice(0, 200);
    const items = [];
    const idToMeta = new Map();
    let totalChars = 0;
    let idSeq = 0;
    for (const el of elements) {
      const sents = sentencesFromElementAll(el);
      for (const s of sents) {
        const nextLen = totalChars + s.length;
        if (items.length >= itemLimit || nextLen > charLimit) return { items, idToMeta };
        const id = `s${++idSeq}`;
        items.push({ id, text: s });
        idToMeta.set(id, { el, text: s });
        totalChars = nextLen;
      }
      if (items.length >= itemLimit || totalChars > charLimit) break;
    }
    return { items, idToMeta };
  }

  async function aiBatchFactCheck(items) {
    // Delegates batch check to background worker
    try {
      if (!items || items.length === 0) return { incorrect: [] };
      if (aiInFlight >= AI_MAX_CONCURRENT) return null;
      aiInFlight++;
      const { ok, text } = await new Promise((resolve) => {
        try {
          chrome.runtime.sendMessage({ type: 'GLASS_AI_FACTCHECK_BATCH', items }, (resp) => resolve(resp || { ok: false }));
        } catch(_) { resolve({ ok: false }); }
      });
      aiInFlight--;
      if (!ok) {
        // Fallback to backend proxy if extension has no key
        try {
          const resp = await fetch('/api/extension/factcheck', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) });
          if (resp.ok) {
            const data = await resp.json();
            if (data && Array.isArray(data.incorrect)) return { incorrect: data.incorrect };
          }
        } catch (_) {}
        console.warn('Glass AI batch failed');
        return null;
      }
      const raw = text || '';
      let parsed = null;
      try { parsed = JSON.parse(raw); } catch(_) { console.warn('Glass AI non-JSON response'); return null; }
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.incorrect)) return null;
      return parsed;
    } catch (e) {
      aiInFlight = Math.max(0, aiInFlight - 1);
      console.warn('Glass AI batch error', e);
      return null;
    }
  }

  const scanVisibleForClaims = throttle(async () => {
    if (!factCheckEnabled) return;
    const now = Date.now();
    if (now - fcLastScanAt < 200) return; // safety
    fcLastScanAt = now;
    clearFactCheckOverlays();
    // Full-page pipeline: send consolidated text to backend, then highlight returned snippets
    try {
      showAnalysisModal('Analyzing page…');
      const { elements, fullText } = collectFullTextAndElements();
      if (!fullText || fullText.length < 40) { hideAnalysisModal(); return; }
      const itemsKey = fullText.slice(0, 1200);
      const withinCooldown = (Date.now() - aiLastRunAt) < AI_COOLDOWN_MS;
      if (withinCooldown && itemsKey === aiLastItemsKey) { hideAnalysisModal(); return; }
      const resp = await fetch('/api/text', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ text: fullText }) });
      const data = await resp.json();
      hideAnalysisModal();
      if (!resp.ok) throw new Error('analysis failed');
      const findings = Array.isArray(data?.findings) ? data.findings : [];
      let flagged = 0;
      if (findings.length) {
        // Map each snippet back to its first matching element
        for (const f of findings) {
          const snippet = String(f?.snippet || '').trim(); if (!snippet) continue;
          let placed = false;
          for (const el of elements) {
            const range = buildRangeForSentenceInElement(el, snippet);
            if (range) { placeOverlaysForRange(range, (f.reason && f.reason.length>36) ? f.reason.slice(0,34)+'…' : (f.reason || 'Likely false')); flagged++; placed = true; break; }
          }
          if (flagged >= MAX_FC_OVERLAYS) break;
        }
      }
      if (flagged > 0) { showToast(`Analysis complete • ${flagged} item${flagged===1?'':'s'} flagged`, 'info'); aiLastRunAt = Date.now(); aiLastItemsKey = itemsKey; return; }
      else { showToast('Analysis complete • No strong issues', 'info'); aiLastRunAt = Date.now(); aiLastItemsKey = itemsKey; }
    } catch (e) {
      hideAnalysisModal();
      console.warn('Glass: full-page analysis failed, falling back to quick checks', e);
    }
    // Heuristic fallback path (fast, local)
    const candidates = Array.from(document.querySelectorAll('input[type="text"], input[type="search"], textarea, [contenteditable="true"], p, li, h1, h2, h3, h4, h5, h6, article, section, main, div'))
      .filter(el => el && !root.contains(el) && isElementVisible(el))
      .slice(0, 120);
    let flagged = 0;
    for (const el of candidates) {
      let sents = [];
      if (el.matches('input, textarea, [contenteditable="true"]')) {
        const val = (el.value || el.innerText || '').trim();
        if (val) sents = sentenceCandidatesFrom({ textContent: val });
      } else {
        sents = sentenceCandidatesFrom(el);
      }
      for (const s of sents) {
        if (looksLikeDisclaimer(s)) continue;
        const score = computeClaimScore(s);
        const minScore = s.length < 40 ? 1.4 : 2.2;
        if (score < minScore) continue;
        let verdict = await quickHeuristicCheck(s);
        if (verdict === 'incorrect') {
          if (el.matches('input, textarea, [contenteditable="true"]')) {
            placeOverlayForElementRect(el, 'Likely false');
          } else {
            const range = buildRangeForSentenceInElement(el, s);
            if (range) placeOverlaysForRange(range, 'Likely false');
          }
          flagged++;
          if (flagged >= MAX_FC_OVERLAYS) return;
        }
      }
    }
  }, 300);

  function setFactCheckEnabled(enabled) {
    factCheckEnabled = enabled;
    if (!factCheckEnabled) {
      window.removeEventListener('scroll', scanVisibleForClaims, { passive: true });
      window.removeEventListener('resize', scanVisibleForClaims);
      if (fcObserver) { try { fcObserver.disconnect(); } catch(_) {} fcObserver = null; }
      clearFactCheckOverlays();
      return;
    }
    // If AI fact-check is enabled but no key, prompt once for setup (non-blocking)
    ensureOpenRouterConfigured();
    scanVisibleForClaims();
    window.addEventListener('scroll', () => { updateOverlayPositions(); scanVisibleForClaims(); }, { passive: true });
    window.addEventListener('resize', () => { updateOverlayPositions(); scanVisibleForClaims(); });
    // Observe DOM changes to re-scan dynamically loading content
    if (!fcObserver) {
      fcObserver = new MutationObserver(() => scanVisibleForClaims());
      fcObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  }

  let fcObserver = null;

  async function ensureOpenRouterConfigured() {
    try {
      const prefs = await new Promise((resolve) => {
        try { chrome.storage.sync.get({ openrouter_enabled: true, openrouter_key: '', openrouter_model: 'deepseek/deepseek-r1:free' }, (res) => resolve(res)); } catch(_) { resolve({}); }
      });
      if (!prefs.openrouter_enabled) return;
      // No user prompt; background may be pre-seeded and we also proxy via backend.
    } catch (e) {
      console.warn('Glass: OpenRouter key check failed', e);
    }
  }

  function notify(text) {
    try {
      const note = document.createElement('div');
      note.textContent = text;
      note.style.cssText = 'position:fixed; top: 72px; left:50%; transform:translateX(-50%); background: rgba(0,0,0,0.7); color:#fff; padding:8px 12px; border-radius:9999px; font-size:12px; z-index:2147483646; pointer-events:none;';
      root.appendChild(note);
      setTimeout(() => { try { note.remove(); } catch(_) {} }, 2200);
    } catch(_) {}
  }

  function scheduleTranscriptAnalysis() {
    const now = Date.now();
    if ((now - transcriptLastAnalyzedAt) < TRANSCRIPT_ANALYZE_MS) return;
    transcriptLastAnalyzedAt = now;
    analyzeTranscriptBuffer(transcriptBuffer).catch(()=>{});
  }

  async function analyzeTranscriptBuffer(text) {
    try {
      const sumEl = liveSummaryEl(); if (sumEl && text.trim().length > 0) sumEl.textContent = 'Analyzing conversation…';
      // Summarize + fact-check top claims from transcript buffer
      const resp = await fetch('/api/text', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ text }) });
      const data = await resp.json(); if (!resp.ok) return;
      const findings = Array.isArray(data?.findings) ? data.findings : [];
      // Summary from backend or fallback
      if (sumEl) {
        const s = typeof data?.summary === 'string' ? data.summary.trim() : '';
        sumEl.textContent = s || (findings.length ? 'Key claims detected.' : 'No strong claims detected yet.');
      }
      if (findings.length === 0) { return; }
      // Left panel: show only inaccurate items under "False Information"
      const hi = liveHighlightsEl(); if (hi) {
        hi.innerHTML='';
        findings.filter(f => String(f.verdict).toLowerCase() === 'false' || String(f.verdict).toLowerCase() === 'incorrect').slice(0,3).forEach((f)=>{ const li=document.createElement('li'); li.style.marginBottom='8px'; li.textContent = `• Inaccurate: ${f.snippet}`; hi.appendChild(li); });
      }
      const first = findings[0];
      latestFinding = first;
      const srcEl = liveSourcesEl(); if (srcEl) { srcEl.innerHTML=''; const cites = Array.isArray(first.citations) ? first.citations.slice(0,3) : []; if (cites.length===0) { const b=document.createElement('button'); b.style.cssText='padding:8px 12px; margin-right:8px; margin-bottom:8px; border-radius:9999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:white; cursor:pointer; text-decoration:underline; font-family:inherit;'; b.textContent='Search news →'; b.onclick=()=>window.open(`https://news.google.com/search?q=${encodeURIComponent(first.snippet||'')}`,'_blank'); srcEl.appendChild(b); } else { cites.forEach((u)=>{ try { const url = new URL(u); const b=document.createElement('button'); b.style.cssText='padding:8px 12px; margin-right:8px; margin-bottom:8px; border-radius:9999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:white; cursor:pointer; text-decoration:underline; font-family:inherit;'; b.textContent=(url.hostname)+' →'; b.onclick=()=>window.open(url.toString(),'_blank'); srcEl.appendChild(b); } catch(_){} }); } }
      const actEl = liveActionsEl(); if (actEl) { actEl.innerHTML=''; const acts=[ { label:'🔍 View sources', run:()=>{ const s=liveSourcesEl(); if (s) s.scrollIntoView({behavior:'smooth'}); } }, { label:'📰 Search reputable coverage', run:()=>window.open(`https://news.google.com/search?q=${encodeURIComponent(first.snippet||'')}`,'_blank') }, { label:'📊 Check official stats', run:()=>window.open('https://bjs.ojp.gov/','_blank') } ]; acts.forEach(a=>{ const btn=document.createElement('button'); btn.style.cssText='width:100%; text-align:left; padding:12px 16px; margin-bottom:8px; border-radius:12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.2); color:white; cursor:pointer; font-family:inherit;'; btn.textContent=a.label; btn.onclick=a.run; actEl.appendChild(btn); }); }
    } catch (_) {}
  }

  // Wire the See Reasoning button
  const seeReasoningBtn = root.querySelector('#glass-see-reasoning');
  if (seeReasoningBtn) {
    seeReasoningBtn.addEventListener('click', () => showReasoningModal(latestFinding));
  }

})();
