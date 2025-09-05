'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { gsap } from 'gsap';
import { apiClient } from '../utils/api';

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Permissions');
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    screenAccess: false,
    microphoneAccess: false,
    notifications: false,
    screenAccess2: false,
    customControls: false,
  });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeIndicatorRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    bio: 'AI enthusiast and misinformation fighter',
    location: 'San Francisco, CA',
    website: 'https://glass.ai',
    twitter: '@glassuser',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  });
  const [settingsData, setSettingsData] = useState({
    theme: 'dark',
    language: 'en',
    autoScan: true,
    scanSensitivity: 'medium',
    privacyMode: false,
    dataRetention: '30days',
    aiModel: 'gpt-4',
    scanHistory: true,
    realTimeAlerts: true,
    accessibility: {
      highContrast: false,
      largeText: false,
      screenReader: false
    },
    integrations: {
      browserExtension: true,
      mobileApp: false,
      apiAccess: false
    }
  });
  const [glassEnabled, setGlassEnabled] = useState(false);
  const [customizationData, setCustomizationData] = useState({
    background: {
      type: 'darkveil',
      speed: 2.2,
      hueShift: 43,
      noiseIntensity: 0.2,
      scanlineFrequency: 2.1,
      scanlineIntensity: 1,
      warpAmount: 3.1
    },
    colors: {
      primary: '#85B5D9',
      secondary: '#FFFFFF',
      accent: '#FF6B6B',
      success: '#4ECDC4',
      warning: '#FFE66D',
      error: '#FF6B6B'
    },
    animations: {
      enabled: true,
      speed: 'normal',
      particleEffects: true,
      confetti: true,
      loadingAnimations: true
    },
    layout: {
      compact: false,
      sidebar: true,
      headerStyle: 'glass',
      cardStyle: 'rounded',
      spacing: 'comfortable'
    },
    typography: {
      fontFamily: 'inter',
      fontSize: 'medium',
      fontWeight: 'normal',
      lineHeight: 'relaxed'
    },
    effects: {
      blur: true,
      shadows: true,
      gradients: true,
      transparency: 0.8
    }
  });

  // Chatbot state
  const [messagesState, setMessagesState] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: "Hi! I'm Glass, your AI assistant. I can help you verify facts, analyze content, and detect misinformation. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  // persist Glass toggle for global overlay
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('glass_enabled', glassEnabled ? 'true' : 'false');
      // notify same-tab listeners as StorageEvent doesn't fire in same context
      try {
        window.dispatchEvent(new CustomEvent('glass_enabled_changed', { detail: { enabled: glassEnabled } }));
      } catch {}
    }
  }, [glassEnabled]);

  // initialize from storage so it starts off unless previously enabled
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('glass_enabled');
    if (stored === 'true') setGlassEnabled(true);
  }, []);

  // keep nav toggle in sync with modal/other tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'glass_enabled') setGlassEnabled(e.newValue === 'true');
    };
    const onCustom = (e: any) => {
      if (e?.detail?.enabled !== undefined) setGlassEnabled(!!e.detail.enabled);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('glass_enabled_changed', onCustom as any);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('glass_enabled_changed', onCustom as any);
    };
  }, []);

  const GlassLoader = dynamic(() => import('../components/GlassLoader/GlassLoader'), { ssr: false });
  const cloudLeftRef = useRef<HTMLDivElement>(null);
  const cloudRightRef = useRef<HTMLDivElement>(null);
  const cloudMidRef = useRef<HTMLDivElement>(null);
  const cloudFarRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (permissionKey: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [permissionKey]: !prev[permissionKey]
    }));
  };

  const togglePermission = (permissionKey: string) => {
    setPermissions(prev => ({
      ...prev,
      [permissionKey]: !prev[permissionKey]
    }));
  };

  const animateActiveTab = (newTab: string) => {
    const activeTabElement = tabRefs.current[newTab];
    const indicator = activeIndicatorRef.current;
    
    if (activeTabElement && indicator) {
      const tabRect = activeTabElement.getBoundingClientRect();
      const containerRect = activeTabElement.parentElement?.getBoundingClientRect();
      
      if (containerRect) {
        const relativeLeft = tabRect.left - containerRect.left;
        const tabWidth = tabRect.width;
        
        gsap.to(indicator, {
          x: relativeLeft,
          width: tabWidth,
          duration: 0.4,
          ease: "power2.out"
        });
      }
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    animateActiveTab(tab);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // Clear any local storage tokens
      localStorage.removeItem('glass_access_token');
      
      // Sign out from NextAuth
      await signOut({ 
        redirect: false,
        callbackUrl: '/'
      });
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const permissionData = {
    screenAccess: {
      title: 'Screen Access',
      description: [
        'Enable Glass to see what\'s on your screen so it can check articles, images, or videos in real time.',
        'Only scans what you choose',
        'Works as a transparent overlay',
        'Never saves or shares your screen'
      ]
    },
    microphoneAccess: {
      title: 'Microphone Access',
      description: [
        'Allow Glass to listen for misinformation in audio content and conversations.',
        'Only activates when you enable it',
        'Processes audio locally for privacy',
        'No recordings are stored or transmitted'
      ]
    },
    notifications: {
      title: 'Notifications',
      description: [
        'Get real-time alerts when Glass detects potential misinformation.',
        'Customizable alert levels',
        'Non-intrusive warnings',
        'Can be disabled anytime'
      ]
    },
    screenAccess2: {
      title: 'Screen Access',
      description: [
        'Secondary screen monitoring for multi-display setups.',
        'Independent control per screen',
        'Same privacy protections apply',
        'Optional for single-screen users'
      ]
    },
    customControls: {
      title: 'Custom Controls',
      description: [
        'Set up personalized shortcuts and preferences for Glass.',
        'Create custom fact-checking rules',
        'Adjust sensitivity levels',
        'Save your preferred sources'
      ]
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [session, status]);

  useEffect(() => {
    // Initialize the active indicator position
    const timer = setTimeout(() => {
      animateActiveTab(activeTab);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Cloud background animation
  useEffect(() => {
    const left = cloudLeftRef.current;
    const right = cloudRightRef.current;
    const mid = cloudMidRef.current;
    const far = cloudFarRef.current;

    if (!left || !right || !mid || !far) {
      console.log('❌ Cloud refs not ready');
      return;
    }

    console.log('☁️ Starting cloud animations...');

    // Helper to create infinite horizontal loop
    const makeLoop = (el: HTMLElement, fromX: number | string, toX: number | string, duration: number) => {
      gsap.fromTo(
        el,
        { x: fromX },
        {
          x: toX,
          duration,
          ease: 'none',
          repeat: -1,
        }
      );
    };

    // Different layers, different speeds and directions
    makeLoop(left, '-300%', '300%', 20);   // slower left-to-right
    makeLoop(right, '300%', '-300%', 18);  // slower right-to-left
    makeLoop(mid, '-300%', '300%', 15);    // slower left-to-right
    makeLoop(far, '300%', '-300%', 25);    // slower right-to-left

    return () => {
      gsap.killTweensOf(left);
      gsap.killTweensOf(right);
      gsap.killTweensOf(mid);
      gsap.killTweensOf(far);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking auth status...');
      console.log('📊 NextAuth status:', status);
      console.log('👤 NextAuth session:', session);
      console.log('🔗 API URL:', process.env.NEXT_PUBLIC_API_URL);
      
      // Check for NextAuth session (Google Auth)
      if (status === 'authenticated' && session) {
        console.log('✅ NextAuth authenticated, setting user data');
        setUser({
          fullName: session.user?.name || 'Google User',
          email: session.user?.email || '',
        });
        setIsLoading(false);
        return;
      }

      // Check for traditional auth token
      const token = localStorage.getItem('glass_access_token');
      console.log('🔑 Traditional auth token:', token ? 'Found' : 'Not found');
      
      if (!token && !apiClient.isAuthenticated()) {
        console.log('❌ No token found, redirecting to onboarding');
        if (status !== 'loading') {
          router.push('/onboarding');
        }
        return;
      }

      console.log('🌐 Verifying token with backend via apiClient...');
      try {
        const me = await apiClient.getProfile();
        console.log('✅ Token verified, user data:', me);
        setUser({
          fullName: me.fullName,
          email: me.email,
        });
      } catch (e) {
        console.log('❌ apiClient.getProfile failed, falling back to direct fetch...', e);
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token || ''}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('📡 Backend response status:', resp.status, 'ok:', resp.ok);
        if (!resp.ok) {
          localStorage.removeItem('glass_access_token');
          router.push('/onboarding');
          return;
        }
        const payload = await resp.json();
        setUser(payload);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      localStorage.removeItem('glass_access_token');
      if (status !== 'loading') {
        router.push('/onboarding');
      }
    }
  };

  function renderInlineStyles(text: string) {
    const nodes: any[] = [];
    if (!text) return nodes;
    const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let last = 0; let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) nodes.push(<span key={`${nodes.length}-p`}>{text.slice(last, m.index)}</span>);
      const tok = m[0];
      if (tok.startsWith('**')) nodes.push(<strong key={`${nodes.length}-b`}>{tok.slice(2, -2)}</strong>);
      else nodes.push(<em key={`${nodes.length}-i`}>{tok.slice(1, -1)}</em>);
      last = re.lastIndex;
    }
    if (last < text.length) nodes.push(<span key={`${nodes.length}-end`}>{text.slice(last)}</span>);
    return nodes;
  }

  function renderTextWithLinks(text: string) {
    const elements: any[] = [];
    if (!text) return elements;
    // First parse markdown links [text](url)
    const mdRe = /\[([^\]]+)\]\((https?:\/\/[\S]+?)\)/g;
    let lastIndex = 0; let match: RegExpExecArray | null;
    const parts: Array<string | { label: string; href: string }> = [];
    while ((match = mdRe.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
      parts.push({ label: match[1], href: match[2] });
      lastIndex = mdRe.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));

    const urlRe = /(https?:\/\/[^\s)]+)|(www\.[^\s)]+)/gi;
    const pushWithAutoLinks = (chunk: string) => {
      let i = 0; let m: RegExpExecArray | null;
      while ((m = urlRe.exec(chunk)) !== null) {
        const url = m[0];
        if (m.index > i) elements.push(<span key={`${elements.length}-t`}>{renderInlineStyles(chunk.slice(i, m.index))}</span>);
        const href = url.startsWith('http') ? url : `https://${url}`;
        elements.push(
          <a key={`${elements.length}-a`} href={href} target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-white/80 inline-flex items-center gap-1 break-all">
            {url}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 opacity-70"><path d="M12.5 2a.75.75 0 000 1.5h2.69l-7.72 7.72a.75.75 0 101.06 1.06l7.72-7.72V9.5a.75.75 0 001.5 0V2.75A.75.75 0 0016.75 2h-4.25z"/><path d="M6.5 4A2.5 2.5 0 004 6.5v9A2.5 2.5 0 006.5 18h9a2.5 2.5 0 002.5-2.5v-5a.75.75 0 00-1.5 0v5a1 1 0 01-1 1h-9a1 1 0 01-1-1v-9a1 1 0 011-1h5a.75.75 0 000-1.5h-5z"/></svg>
          </a>
        );
        i = urlRe.lastIndex;
      }
      if (i < chunk.length) elements.push(<span key={`${elements.length}-tend`}>{renderInlineStyles(chunk.slice(i))}</span>);
    };

    for (const part of parts) {
      if (typeof part === 'string') {
        pushWithAutoLinks(part);
      } else {
        elements.push(
          <a key={`${elements.length}-md`} href={part.href} target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-white/80 inline-flex items-center gap-1 break-all">
            {renderInlineStyles(part.label)}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 opacity-70"><path d="M12.5 2a.75.75 0 000 1.5h2.69l-7.72 7.72a.75.75 0 101.06 1.06l7.72-7.72V9.5a.75.75 0 001.5 0V2.75A.75.75 0 0016.75 2h-4.25z"/><path d="M6.5 4A2.5 2.5 0 004 6.5v9A2.5 2.5 0 006.5 18h9a2.5 2.5 0 002.5-2.5v-5a.75.75 0 00-1.5 0v5a1 1 0 01-1 1h-9a1 1 0 01-1-1v-9a1 1 0 011-1h5a.75.75 0 000-1.5h-5z"/></svg>
          </a>
        );
      }
    }
    return elements;
  }

  function renderMarkdownMessage(text: string) {
    // If the assistant returned structured JSON, render a fact-check card
    try {
      const parsed = JSON.parse(text as any);
      if (parsed && typeof parsed === 'object' && (parsed.verdict || parsed.sources)) {
        return (
          <div className="space-y-3">
            <div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${parsed.verdict==='true' ? 'bg-green-500/20 border-green-400/40 text-green-200' : parsed.verdict==='false' ? 'bg-red-500/20 border-red-400/40 text-red-200' : 'bg-yellow-500/20 border-yellow-400/40 text-yellow-200'}`}>{String(parsed.verdict || 'unclear').toUpperCase()}</span>
            </div>
            <div className="text-white/80 text-sm">{parsed.explanation}</div>
            {Array.isArray(parsed.sources) && parsed.sources.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wide text-white/70 mb-1">Sources</div>
                <div className="flex flex-wrap gap-2">
                  {parsed.sources.slice(0,6).map((s:any, i:number) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs underline text-white/90 hover:text-white">{s.name || `Source ${i+1}`}</a>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wide text-white/70 mb-1">Explore</div>
                <div className="flex flex-wrap gap-2">
                  {parsed.suggestions.map((s:any, i:number) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs hover:bg-white/20">{s.label}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }
    } catch {}
    // Fallback to markdown-lite rendering
    const lines = (text || '').split('\n');
    const blocks: any[] = [];
    let i = 0;
    while (i < lines.length) {
      const raw = lines[i];
      const line = raw.trim();
      if (!line) { i++; continue; }
      const h = line.match(/^(#{1,6})\s+(.+)/);
      if (h) {
        const level = h[1].length;
        const size = level <= 2 ? 'text-lg' : level === 3 ? 'text-base' : 'text-sm';
        blocks.push(<div key={`h-${i}`} className={`text-white/90 font-semibold ${size} mt-1 mb-1`}>{renderTextWithLinks(h[2])}</div>);
        i++; continue;
      }
      if (/^[-*]\s+/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, '')); i++; }
        blocks.push(
          <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1 text-white/90 text-sm">
            {items.map((t, idx) => <li key={idx}>{renderTextWithLinks(t)}</li>)}
          </ul>
        );
        continue;
      }
      if (/^\d+\.\s+/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++; }
        blocks.push(
          <ol key={`ol-${i}`} className="list-decimal pl-5 space-y-1 text-white/90 text-sm">
            {items.map((t, idx) => <li key={idx}>{renderTextWithLinks(t)}</li>)}
          </ol>
        );
        continue;
      }
      const para: string[] = [line]; i++;
      while (i < lines.length && lines[i] && !/^(#{1,6})\s+|^\s*[-*]\s+|^\s*\d+\.\s+/.test(lines[i])) { para.push(lines[i].trim()); i++; }
      blocks.push(<p key={`p-${i}`} className="text-white/90 text-sm leading-relaxed">{renderTextWithLinks(para.join(' '))}</p>);
    }
    return blocks;
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setMessagesState((m) => [...m, { role: 'user', content: text }]);
    setInput('');
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [
          { role: 'system', content: 'You are Glass, a helpful assistant focused on fact-checking and misinformation.' },
          ...messagesState.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: text },
        ] }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(async () => ({ error: 'Something went wrong. Please try again.' }));
        const friendly = (err?.error as string) || 'Something went wrong. Please try again.';
        setMessagesState((m) => [...m, { role: 'assistant', content: friendly }]);
      } else {
        const data = await resp.json();
        const content = data?.content || 'No response';
        setMessagesState((m) => [...m, { role: 'assistant', content }]);
      }
    } catch (e: any) {
      setMessagesState((m) => [...m, { role: 'assistant', content: `Request failed: ${e?.message || 'Unknown error'}` }]);
    } finally {
      setSending(false);
      try {
        const scroller = document.getElementById('glass-chat-scroll');
        if (scroller) scroller.scrollTop = scroller.scrollHeight;
      } catch {}
    }
  }

  // Scan state
  const [scanUrl, setScanUrl] = useState('');
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scanFindings, setScanFindings] = useState<Array<{ snippet: string; reason: string; verdict: string; confidence: number; citations?: string[] }>>([]);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scanSummary, setScanSummary] = useState('');
  const [scanDone, setScanDone] = useState(false);
  const [textInput, setTextInput] = useState('');

  // Recent scans (local, client-side)
  const [recentScans, setRecentScans] = useState<Array<{ url: string; verdicts: number; ts: number }>>([]);
  function loadRecentScans() {
    try {
      const raw = localStorage.getItem('glass_recent_scans');
      if (raw) setRecentScans(JSON.parse(raw));
    } catch {}
  }
  function saveRecentScans(list: Array<{ url: string; verdicts: number; ts: number }>) {
    try { localStorage.setItem('glass_recent_scans', JSON.stringify(list)); } catch {}
  }
  useEffect(() => { if (typeof window !== 'undefined') loadRecentScans(); }, []);
  function timeAgo(ts: number): string {
    const d = Date.now() - ts; const m = Math.floor(d / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m} min${m===1?'':'s'} ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h} hr${h===1?'':'s'} ago`;
    const days = Math.floor(h / 24); return `${days} day${days===1?'':'s'} ago`;
  }

  async function runScan() {
    const url = scanUrl.trim();
    if (!url) return;
    setScanLoading(true); setScanError(''); setScanFindings([]); setScanSummary(''); setScanDone(false);
    try {
      const resp = await fetch('/api/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
      const data = await resp.json();
      if (!resp.ok) {
        setScanError(data?.error || 'Scan failed. Please try again.');
        setScanModalOpen(false);
      } else {
        setScanFindings(Array.isArray(data?.findings) ? data.findings : []);
        setScanSummary(typeof data?.summary === 'string' ? data.summary : '');
        setScanDone(true);
        setScanModalOpen(true);
        // Update recent scans
        const verdicts = (Array.isArray(data?.findings) ? data.findings : []).length;
        const entry = { url, verdicts, ts: Date.now() };
        const updated = [entry, ...recentScans.filter((x) => x.url !== url)].slice(0, 10);
        setRecentScans(updated);
        saveRecentScans(updated);
      }
    } catch (e: any) {
      setScanError(e?.message || 'Scan failed.');
      setScanModalOpen(false);
    } finally { setScanLoading(false); }
  }

  async function runTextAnalysis() {
    const text = textInput.trim();
    if (!text) return;
    setScanLoading(true); setScanError(''); setScanFindings([]); setScanSummary(''); setScanDone(false);
    try {
      const resp = await fetch('/api/text', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      const data = await resp.json();
      if (!resp.ok) {
        setScanError(data?.error || 'Analysis failed. Please try again.');
        setScanModalOpen(false);
      } else {
        setScanFindings(Array.isArray(data?.findings) ? data.findings : []);
        setScanSummary(typeof data?.summary === 'string' ? data.summary : '');
        setScanDone(true);
        setScanModalOpen(true);
        const entry = { url: '[Text]', verdicts: (Array.isArray(data?.findings) ? data.findings : []).length, ts: Date.now() };
        const updated = [entry, ...recentScans].slice(0, 10);
        setRecentScans(updated); saveRecentScans(updated);
      }
    } catch (e: any) {
      setScanError(e?.message || 'Analysis failed.');
      setScanModalOpen(false);
    } finally { setScanLoading(false); }
  }

  function closeScanModal() {
    setScanModalOpen(false);
  }

  const [uploadResult, setUploadResult] = useState<{ type: 'image'|'video'; ai_generated: boolean; confidence: number; reason: string }|null>(null);
  async function onFilePicked(e: any) {
    try {
      setUploadResult(null); setScanError('');
      const file: File | undefined = e?.target?.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { setScanError('Max upload size is 5MB.'); return; }
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        const resp = await fetch('/api/image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBase64: base64, mime: file.type }) });
        const data = await resp.json();
        if (!resp.ok) { setScanError(data?.error || 'Image analysis failed.'); return; }
        setUploadResult({ type: 'image', ai_generated: !!data.ai_generated, confidence: Number(data.confidence||0), reason: String(data.reason||'') });
      } else if (file.type.startsWith('video/')) {
        const form = new FormData(); form.append('file', file);
        const resp = await fetch('/api/video', { method: 'POST', body: form });
        const data = await resp.json();
        if (!resp.ok) { setScanError(data?.error || 'Video analysis failed.'); return; }
        setUploadResult({ type: 'video', ai_generated: !!data.ai_generated, confidence: Number(data.confidence||0), reason: String(data.reason||'') });
      } else {
        setScanError('Unsupported file type.');
      }
    } catch (err:any) {
      setScanError(err?.message || 'Upload failed.');
    }
  }
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#85B5D9]">
        <GlassLoader isVisible={true} message="Loading" submessage="Preparing your dashboard" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Solid Blue Background (DarkVeil removed) */}
      <div className="fixed inset-0 bg-[#85B5D9]" />

      {/* Animated Clouds under blur */}
      <div className="fixed inset-0 overflow-hidden">
        <div ref={cloudLeftRef} className="absolute top-10 left-0 opacity-60">
          <Image src="/assets/images/clouds1.svg" alt="clouds" width={600} height={150} priority />
        </div>
        <div ref={cloudRightRef} className="absolute top-36 right-0 opacity-50">
          <Image src="/assets/images/clouds2.svg" alt="clouds" width={650} height={160} priority />
        </div>
        <div ref={cloudMidRef} className="absolute bottom-24 left-0 opacity-55">
          <Image src="/assets/images/clouds3.svg" alt="clouds" width={700} height={170} priority />
        </div>
        <div ref={cloudFarRef} className="absolute bottom-8 right-0 opacity-45">
          <Image src="/assets/images/clouds4.svg" alt="clouds" width={750} height={180} priority />
        </div>
      </div>

      {/* Frosted Glass Blur Overlay */}
      <div className="fixed inset-0 pointer-events-none backdrop-blur-2xl bg-white/10" />

      {/* Frame 2 SVG at Top Center */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 mb-20">
        <Image
          src="/assets/images/Frame 2.svg"
          alt="Frame decoration"
          width={200}
          height={60}
          className="opacity-80"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-4xl mx-auto">

                      {/* Welcome Message */}
            {user && (
              <div className="text-left mb-8">
                <p className="text-xs text-white/80">
                  Welcome back, {user.fullName}!
                </p>
              </div>
            )}

          {/* Tab Navigation */}
          <div className="mb-6 mt-20">
            <div className="relative flex items-center justify-between bg-white/10 backdrop-blur-md rounded-full p-2 max-w-4xl mx-auto border border-white/20 gap-2">
              {/* Left side - Navigation tabs */}
              <div className="flex items-center gap-1">
                {/* Animated Active Indicator */}
                <div
                  ref={activeIndicatorRef}
                  className="absolute top-2 left-2 h-[calc(100%-16px)] bg-transparent rounded-full border border-white/20 transition-all duration-300 pointer-events-none"
                  style={{ width: '0px', transform: 'translateX(0px)' }}
                />
                
                {['Permissions', 'Scan', 'Chatbot', 'Profile', 'Customization', 'Settings'].map((tab) => (
                  <button
                    key={tab}
                    ref={(el) => { tabRefs.current[tab] = el; }}
                    onClick={() => handleTabChange(tab)}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 z-10 ${
                      activeTab === tab
                        ? 'text-white'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Right side - Toggle switch */}
              <div className="bg-transparent rounded-full border border-white/20 px-3 py-2 flex items-center gap-2">
                <span className="text-sm text-white/70 font-medium">{glassEnabled ? 'Turn Glass off' : 'Turn Glass on'}</span>
                <button
                  onClick={() => setGlassEnabled(!glassEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    glassEnabled 
                      ? 'bg-green-400/30 border border-green-400/50' 
                      : 'bg-white/20 border border-white/30'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
                      glassEnabled 
                        ? 'bg-green-400 translate-x-6' 
                        : 'bg-white/60 translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Permissions Content */}
          {activeTab === 'Permissions' && (
            <>
              {/* Description */}
              <div className="text-center mb-6 max-w-xl mx-auto mt-10">
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  To help Glass verify facts and protect you from misinformation, we'll need a few permissions. You stay in control at all times.
                </p>
              </div>

              {/* Permission Cards */}
              <div className="w-full max-w-2xl mx-auto bg-white/8 backdrop-blur-md rounded-2xl p-6 border border-white/15">
                <div className="space-y-3">
                                     {Object.entries(permissionData).map(([key, data]) => (
                     <div key={key} className="rounded-xl bg-transparent border border-white/20 overflow-hidden">
                      {/* Permission Header */}
                      <div className="flex items-center justify-between py-3 px-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => togglePermission(key)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              permissions[key as keyof typeof permissions]
                                ? 'bg-white border-white'
                                : 'bg-transparent border-white/25 hover:border-white/50'
                            }`}
                          >
                            {permissions[key as keyof typeof permissions] && (
                              <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          <span className="text-white text-base font-normal">{data.title}</span>
                        </div>
                        <button
                          onClick={() => toggleDropdown(key)}
                          className="w-6 h-6 bg-white/8 rounded-full flex items-center justify-center hover:bg-white/15 transition-all border border-white/15"
                        >
                          <svg 
                            className={`w-3 h-3 text-white/70 transition-transform ${
                              openDropdowns[key] ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Permission Dropdown Content */}
                      {openDropdowns[key] && (
                        <div className="px-4 pb-4 border-t border-white/10">
                          <div className="pt-3 space-y-2">
                            {data.description.map((text, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-white/50 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-white/70 leading-relaxed">{text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Text */}
              <div className="text-center mt-8 max-w-2xl mx-auto">
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  <span className="font-normal text-white/80">You're always in charge.</span> Glass only works when you give permission — and you can change your settings anytime from the dashboard.
                </p>
              </div>
            </>
          )}

          {/* Scan Tab Content */}
          {activeTab === 'Scan' && (
            <>
              {/* Scan Header */}
              <div className="text-center mb-4">
                <h2 className="text-xl font-light text-white mb-1">Scan for Misinformation</h2>
                <p className="text-white/70 text-xs">Analyze content in real-time</p>
              </div>

              {/* Scan Options Grid */}
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* URL Input Section */}
                <div className="bg-white/8 backdrop-blur-md rounded-xl p-4 border border-white/15">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-white/15 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">URL Analysis</h3>
                      <p className="text-white/60 text-xs">Paste a link to analyze</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={scanUrl}
                      onChange={(e) => setScanUrl(e.target.value)}
                      placeholder="https://example.com/article"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                      onKeyDown={(e) => { if (e.key === 'Enter') runScan(); }}
                    />
                    <button onClick={runScan} disabled={scanLoading || !scanUrl.trim()} className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg text-white text-xs transition-all disabled:opacity-50">
                      {scanLoading ? 'Scanning…' : 'Scan'}
                    </button>
                  </div>
                  {/* Results */}
                  <div className="mt-3 space-y-2">
                    {scanError && (
                      <div className="text-xs text-red-300 bg-red-500/20 border border-red-400/30 rounded-md px-3 py-2">{scanError}</div>
                    )}
                    {scanFindings.map((f, idx) => (
                      <div key={idx} className="p-3 rounded-md bg-white/5 border border-white/15">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wide text-white/70">{f.verdict}</span>
                          <span className="text-xs text-white/50">Confidence: {Math.round((f.confidence || 0) * 100)}%</span>
                        </div>
                        <p className="text-white text-sm mt-1">{f.snippet}</p>
                        <p className="text-white/80 text-xs mt-1">{f.reason}</p>
                        {Array.isArray(f.citations) && f.citations.length > 0 && (
                          <div className="text-xs text-white/70 mt-2 flex flex-wrap gap-2">
                            {f.citations.slice(0, 3).map((c, i) => (
                              <a key={i} href={c} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Source {i + 1}</a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {scanDone && (
                      <div className="p-3 rounded-md bg-white/5 border border-white/15">
                        <div className="text-xs uppercase tracking-wide text-white/70 mb-1">Summary</div>
                        <p className="text-white/90 text-sm">{scanSummary || 'No summary available.'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Input Section */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl p-6 border border-white/15">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Text Analysis</h3>
                      <p className="text-white/60 text-sm">Paste text to verify</p>
                    </div>
                  </div>
                  <textarea
                    placeholder="Paste the text you want to analyze for misinformation..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                  <div className="flex justify-end mt-3">
                    <button onClick={runTextAnalysis} disabled={scanLoading || !textInput.trim()} className="px-6 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg text-white font-medium transition-all disabled:opacity-50">
                      {scanLoading ? 'Analyzing…' : 'Analyze'}
                    </button>
                  </div>
                  {scanError && (
                    <div className="mt-3 text-xs text-red-300 bg-red-500/20 border border-red-400/30 rounded-md px-3 py-2">{scanError}</div>
                  )}
                </div>

                {/* File Upload Section */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl p-6 border border-white/15">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">File Upload</h3>
                      <p className="text-white/60 text-sm">Upload image or short video (max 5MB)</p>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                    <input id="glass-file-input" type="file" accept="image/*,video/*" className="hidden" onChange={onFilePicked} />
                    <svg className="w-12 h-12 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-white/60 mb-2">Drag and drop files here</p>
                    <p className="text-white/40 text-sm">or click to browse</p>
                    <button onClick={() => document.getElementById('glass-file-input')?.click()} className="mt-4 px-6 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg text-white font-medium transition-all">Choose Files</button>
                  </div>
                  {uploadResult && (
                    <div className="mt-3 p-3 rounded-md bg-white/5 border border-white/15">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wide text-white/70">{uploadResult.type}</span>
                        <span className="text-xs text-white/50">Confidence: {Math.round((uploadResult.confidence||0)*100)}%</span>
                      </div>
                      <p className="text-white text-sm mt-1">AI-generated: {uploadResult.ai_generated ? 'Yes' : 'No'}</p>
                      <p className="text-white/80 text-xs mt-1">{uploadResult.reason}</p>
                    </div>
                  )}
                </div>

                {/* Recent Scans */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl p-6 border border-white/15">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">Recent Scans</h3>
                    <button onClick={() => { setRecentScans([]); saveRecentScans([]); }} className="text-white/60 hover:text-white text-sm">Clear</button>
                  </div>
                  <div className="space-y-3">
                    {recentScans.length === 0 && (
                      <div className="text-white/60 text-sm">No scans yet.</div>
                    )}
                    {recentScans.map((r, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${r.verdicts>0?'bg-yellow-500/20':'bg-green-500/20'} rounded-full flex items-center justify-center`}>
                            {r.verdicts>0 ? (
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                            ) : (
                              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                            )}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium truncate max-w-[300px]">{r.url}</p>
                            <p className="text-white/60 text-xs">{r.verdicts>0?`${r.verdicts} finding${r.verdicts===1?'':'s'}`:'Clean'} • {timeAgo(r.ts)}</p>
                          </div>
                        </div>
                        <button onClick={() => { setScanUrl(r.url); setScanModalOpen(true); }} className="text-white/40 hover:text-white/60">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {scanModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={closeScanModal}>
              <div className="max-w-2xl w-full bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-5 text-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Scan Results</h3>
                  <button onClick={closeScanModal} className="px-2 py-1 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20">Close</button>
                </div>
                <p className="text-white/70 text-xs mb-3">{scanUrl}</p>
                <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
                  {scanFindings.length === 0 && (
                    <p className="text-white/80 text-sm">No clear misinformation found. Try another source or adjust sensitivity.</p>
                  )}
                  {scanFindings.map((f, idx) => (
                    <div key={idx} className="p-3 rounded-md bg-white/5 border border-white/15">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {typeof (f as any).line === 'number' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 border border-white/20">Line {(f as any).line}</span>
                          )}
                          <span className="text-xs uppercase tracking-wide text-white/70">{f.verdict}</span>
                        </div>
                        <span className="text-xs text-white/50">Confidence: {Math.round((f.confidence || 0) * 100)}%</span>
                      </div>
                      <p className="text-white text-sm mt-2">"{f.snippet}"</p>
                      {(f as any).correction && (
                        <div className="mt-2">
                          <div className="text-xs uppercase tracking-wide text-white/70 mb-0.5">Correction</div>
                          <p className="text-white/90 text-sm">{(f as any).correction}</p>
                        </div>
                      )}
                      <div className="mt-2">
                        <div className="text-xs uppercase tracking-wide text-white/70 mb-0.5">Why</div>
                        <p className="text-white/80 text-xs">{f.reason}</p>
                      </div>
                      {Array.isArray(f.citations) && f.citations.length > 0 && (
                        <div className="text-xs text-white/70 mt-2 flex flex-wrap gap-2">
                          {f.citations.slice(0, 5).map((c, i) => (
                            <a key={i} href={c} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Source {i + 1}</a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="p-3 rounded-md bg-white/5 border border-white/15">
                    <div className="text-xs uppercase tracking-wide text-white/70 mb-1">Summary</div>
                    <p className="text-white/90 text-sm">{scanSummary || 'No summary available.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chatbot Tab Content */}
          {activeTab === 'Chatbot' && (
            <>
              {/* Chat Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-light text-white mb-2">Glass AI Assistant</h2>
                <p className="text-white/70 text-sm">Your personal misinformation detective</p>
              </div>

              {/* Chat Container */}
              <div className="w-full max-w-4xl mx-auto bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 overflow-hidden">
                {/* Chat Messages Area */}
                <div className="h-96 overflow-y-auto p-6 space-y-4" id="glass-chat-scroll">
                  {messagesState.map((m, i) => (
                    <div key={i} className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
                      {m.role !== 'user' && (
                        <div className="w-8 h-8 bg-white/15 rounded-full flex items-center justify-center flex-shrink-0 border border-white/20">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                      <div className={`rounded-2xl px-4 py-3 max-w-xs border ${m.role === 'user' ? 'bg-white/15 border-white/20' : 'bg-white/10 border-white/15'}`}>
                        {m.role === 'user' ? (
                          <p className="text-white text-sm whitespace-pre-wrap">{m.content}</p>
                        ) : (
                          <div className="space-y-2">{renderMarkdownMessage(m.content)}</div>
                        )}
                      </div>
                      {m.role === 'user' && (
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 border border-white/25">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                    </div>
                  ))}
                  {sending && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white/15 rounded-full flex items-center justify-center flex-shrink-0 border border-white/20">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
                      </div>
                      <div className="bg-white/10 rounded-2xl rounded-tl-md px-4 py-3 border border-white/15">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input Area */}
                <div className="border-t border-white/10 p-4">
                  <div className="flex items-stretch gap-3">
                    <div className="flex-1">
                      <textarea
                        placeholder="Ask me anything about fact-checking, misinformation detection, or content analysis..."
                        rows={1}
                        className="w-full h-12 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                        style={{ maxHeight: '120px' }}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      />
                    </div>
                    <button onClick={sendMessage} disabled={sending || !input.trim()} className="w-12 h-12 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-white font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center disabled:opacity-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Chat Features */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <span>Glass AI v2.1</span>
                      <span>•</span>
                      <span>Real-time fact-checking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-white/40 hover:text-white/60 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button className="p-1.5 text-white/40 hover:text-white/60 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Profile Tab Content */}
          {activeTab === 'Profile' && (
            <>
              {/* Profile Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-light text-white mb-2">Profile Settings</h2>
                <p className="text-white/70 text-sm">Manage your account and preferences</p>
              </div>

              <div className="w-full max-w-4xl mx-auto">
                {/* Profile Info Card */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl p-6 border border-white/15 mb-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border border-white/20">
                        <span className="text-2xl text-white font-medium">
                          {user?.fullName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl text-white font-medium mb-1">{user?.fullName || 'User'}</h3>
                      <p className="text-white/60 text-sm mb-2">{user?.email}</p>
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <span>Member since {new Date().getFullYear()}</span>
                        <span>•</span>
                        <span>Premium Plan</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg text-white text-sm transition-all"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white/50 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Website</label>
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-white/80 text-sm mb-2">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-white text-sm transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                {/* Security Section */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6 mt-6">
                  <h3 className="text-lg text-white font-medium mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                        <p className="text-white/60 text-sm">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg text-white text-sm transition-all">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">Change Password</h4>
                        <p className="text-white/60 text-sm">Update your account password</p>
                      </div>
                      <button className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg text-white text-sm transition-all">
                        Change
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">Sign Out</h4>
                        <p className="text-white/60 text-sm">Sign out of your account</p>
                      </div>
                      <button 
                        onClick={handleSignOut}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Signing out...' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6 mt-6">
                  <h3 className="text-lg text-white font-medium mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {Object.entries(profileData.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium capitalize">{key} Notifications</h4>
                          <p className="text-white/60 text-sm">Receive notifications via {key}</p>
                        </div>
                        <button
                          onClick={() => setProfileData({
                            ...profileData,
                            notifications: {
                              ...profileData.notifications,
                              [key]: !value
                            }
                          })}
                          className={`w-12 h-6 rounded-full transition-all ${
                            value ? 'bg-white/30' : 'bg-white/10'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Settings Tab Content */}
          {activeTab === 'Settings' && (
            <>
              {/* Settings Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-light text-white mb-2">Settings</h2>
                <p className="text-white/70 text-sm">Customize your Glass experience</p>
              </div>

              <div className="w-full max-w-4xl mx-auto space-y-6">
                {/* General Settings */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">General</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Theme</h4>
                        <p className="text-white/60 text-sm">Choose your preferred appearance</p>
                      </div>
                      <select
                        value={settingsData.theme}
                        onChange={(e) => setSettingsData({...settingsData, theme: e.target.value})}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Language</h4>
                        <p className="text-white/60 text-sm">Select your preferred language</p>
                      </div>
                      <select
                        value={settingsData.language}
                        onChange={(e) => setSettingsData({...settingsData, language: e.target.value})}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Scanning Settings */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">Scanning & Detection</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Auto-Scan</h4>
                        <p className="text-white/60 text-sm">Automatically scan content as you browse</p>
                      </div>
                      <button
                        onClick={() => setSettingsData({...settingsData, autoScan: !settingsData.autoScan})}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settingsData.autoScan ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settingsData.autoScan ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Scan Sensitivity</h4>
                        <p className="text-white/60 text-sm">Adjust detection sensitivity level</p>
                      </div>
                      <select
                        value={settingsData.scanSensitivity}
                        onChange={(e) => setSettingsData({...settingsData, scanSensitivity: e.target.value})}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">AI Model</h4>
                        <p className="text-white/60 text-sm">Choose the AI model for analysis</p>
                      </div>
                      <select
                        value={settingsData.aiModel}
                        onChange={(e) => setSettingsData({...settingsData, aiModel: e.target.value})}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <option value="gpt-4">GPT-4 (Recommended)</option>
                        <option value="gpt-3.5">GPT-3.5 (Faster)</option>
                        <option value="claude">Claude (Alternative)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Privacy & Security */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">Privacy & Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Privacy Mode</h4>
                        <p className="text-white/60 text-sm">Enhanced privacy protection</p>
                      </div>
                      <button
                        onClick={() => setSettingsData({...settingsData, privacyMode: !settingsData.privacyMode})}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settingsData.privacyMode ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settingsData.privacyMode ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Data Retention</h4>
                        <p className="text-white/60 text-sm">How long to keep your scan data</p>
                      </div>
                      <select
                        value={settingsData.dataRetention}
                        onChange={(e) => setSettingsData({...settingsData, dataRetention: e.target.value})}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <option value="7days">7 days</option>
                        <option value="30days">30 days</option>
                        <option value="90days">90 days</option>
                        <option value="1year">1 year</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Scan History</h4>
                        <p className="text-white/60 text-sm">Store your scanning history</p>
                      </div>
                      <button
                        onClick={() => setSettingsData({...settingsData, scanHistory: !settingsData.scanHistory})}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settingsData.scanHistory ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settingsData.scanHistory ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accessibility */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">Accessibility</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">High Contrast</h4>
                        <p className="text-white/60 text-sm">Increase contrast for better visibility</p>
                      </div>
                      <button
                        onClick={() => setSettingsData({
                          ...settingsData, 
                          accessibility: {
                            ...settingsData.accessibility,
                            highContrast: !settingsData.accessibility.highContrast
                          }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settingsData.accessibility.highContrast ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settingsData.accessibility.highContrast ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Large Text</h4>
                        <p className="text-white/60 text-sm">Increase text size for better readability</p>
                      </div>
                      <button
                        onClick={() => setSettingsData({
                          ...settingsData, 
                          accessibility: {
                            ...settingsData.accessibility,
                            largeText: !settingsData.accessibility.largeText
                          }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settingsData.accessibility.largeText ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settingsData.accessibility.largeText ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Screen Reader</h4>
                        <p className="text-white/60 text-sm">Enable screen reader support</p>
                      </div>
                      <button
                        onClick={() => setSettingsData({
                          ...settingsData, 
                          accessibility: {
                            ...settingsData.accessibility,
                            screenReader: !settingsData.accessibility.screenReader
                          }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settingsData.accessibility.screenReader ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settingsData.accessibility.screenReader ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Integrations */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">Integrations</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Browser Extension</h4>
                        <p className="text-white/60 text-sm">Enable browser extension integration</p>
                      </div>
                      <button
                        onClick={() => setSettingsData({
                          ...settingsData, 
                          integrations: {
                            ...settingsData.integrations,
                            browserExtension: !settingsData.integrations.browserExtension
                          }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settingsData.integrations.browserExtension ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settingsData.integrations.browserExtension ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Mobile App</h4>
                        <p className="text-white/60 text-sm">Sync with mobile application</p>
                      </div>
                      <button
                        onClick={() => setSettingsData({
                          ...settingsData, 
                          integrations: {
                            ...settingsData.integrations,
                            mobileApp: !settingsData.integrations.mobileApp
                          }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settingsData.integrations.mobileApp ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settingsData.integrations.mobileApp ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">API Access</h4>
                        <p className="text-white/60 text-sm">Enable API access for developers</p>
                      </div>
                      <button
                        onClick={() => setSettingsData({
                          ...settingsData, 
                          integrations: {
                            ...settingsData.integrations,
                            apiAccess: !settingsData.integrations.apiAccess
                          }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settingsData.integrations.apiAccess ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settingsData.integrations.apiAccess ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">Advanced</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Real-time Alerts</h4>
                        <p className="text-white/60 text-sm">Get instant notifications for threats</p>
                      </div>
                      <button
                        onClick={() => setSettingsData({...settingsData, realTimeAlerts: !settingsData.realTimeAlerts})}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settingsData.realTimeAlerts ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settingsData.realTimeAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Export Data</h4>
                        <p className="text-white/60 text-sm">Download your data and settings</p>
                      </div>
                      <button className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg text-white text-sm transition-all">
                        Export
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Reset Settings</h4>
                        <p className="text-white/60 text-sm">Restore default settings</p>
                      </div>
                      <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm transition-all">
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Customization Tab Content */}
          {activeTab === 'Customization' && (
            <>
              {/* Customization Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-light text-white mb-2">Customization</h2>
                <p className="text-white/70 text-sm">Personalize your Glass experience</p>
              </div>

              <div className="w-full max-w-4xl mx-auto space-y-6">
                {/* Background Customization */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">Background</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Background Type</h4>
                        <p className="text-white/60 text-sm">Choose your background style</p>
                      </div>
                      <select
                        value={customizationData.background.type}
                        onChange={(e) => setCustomizationData({
                          ...customizationData,
                          background: { ...customizationData.background, type: e.target.value }
                        })}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <option value="darkveil">DarkVeil</option>
                        <option value="gradient">Gradient</option>
                        <option value="particles">Particles</option>
                        <option value="solid">Solid</option>
                      </select>
                    </div>
                    
                    {/* DarkVeil Controls */}
                    {customizationData.background.type === 'darkveil' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Speed: {customizationData.background.speed}</label>
                          <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={customizationData.background.speed}
                            onChange={(e) => setCustomizationData({
                              ...customizationData,
                              background: { ...customizationData.background, speed: parseFloat(e.target.value) }
                            })}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Hue Shift: {customizationData.background.hueShift}</label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            step="1"
                            value={customizationData.background.hueShift}
                            onChange={(e) => setCustomizationData({
                              ...customizationData,
                              background: { ...customizationData.background, hueShift: parseInt(e.target.value) }
                            })}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Noise Intensity: {customizationData.background.noiseIntensity}</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={customizationData.background.noiseIntensity}
                            onChange={(e) => setCustomizationData({
                              ...customizationData,
                              background: { ...customizationData.background, noiseIntensity: parseFloat(e.target.value) }
                            })}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">Color Scheme</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Primary</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customizationData.colors.primary}
                          onChange={(e) => setCustomizationData({
                            ...customizationData,
                            colors: { ...customizationData.colors, primary: e.target.value }
                          })}
                          className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer"
                        />
                        <span className="text-white text-sm">{customizationData.colors.primary}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Accent</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customizationData.colors.accent}
                          onChange={(e) => setCustomizationData({
                            ...customizationData,
                            colors: { ...customizationData.colors, accent: e.target.value }
                          })}
                          className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer"
                        />
                        <span className="text-white text-sm">{customizationData.colors.accent}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Success</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customizationData.colors.success}
                          onChange={(e) => setCustomizationData({
                            ...customizationData,
                            colors: { ...customizationData.colors, success: e.target.value }
                          })}
                          className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer"
                        />
                        <span className="text-white text-sm">{customizationData.colors.success}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animations */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">Animations</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Enable Animations</h4>
                        <p className="text-white/60 text-sm">Toggle all animations on/off</p>
                      </div>
                      <button
                        onClick={() => setCustomizationData({
                          ...customizationData,
                          animations: { ...customizationData.animations, enabled: !customizationData.animations.enabled }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          customizationData.animations.enabled ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          customizationData.animations.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Animation Speed</h4>
                        <p className="text-white/60 text-sm">Set animation playback speed</p>
                      </div>
                      <select
                        value={customizationData.animations.speed}
                        onChange={(e) => setCustomizationData({
                          ...customizationData,
                          animations: { ...customizationData.animations, speed: e.target.value }
                        })}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <option value="slow">Slow</option>
                        <option value="normal">Normal</option>
                        <option value="fast">Fast</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Particle Effects</h4>
                        <p className="text-white/60 text-sm">Show particle animations</p>
                      </div>
                      <button
                        onClick={() => setCustomizationData({
                          ...customizationData,
                          animations: { ...customizationData.animations, particleEffects: !customizationData.animations.particleEffects }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          customizationData.animations.particleEffects ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          customizationData.animations.particleEffects ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Confetti Effects</h4>
                        <p className="text-white/60 text-sm">Show confetti animations</p>
                      </div>
                      <button
                        onClick={() => setCustomizationData({
                          ...customizationData,
                          animations: { ...customizationData.animations, confetti: !customizationData.animations.confetti }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          customizationData.animations.confetti ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          customizationData.animations.confetti ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Layout Options */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">Layout</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Compact Mode</h4>
                        <p className="text-white/60 text-sm">Reduce spacing for more content</p>
                      </div>
                      <button
                        onClick={() => setCustomizationData({
                          ...customizationData,
                          layout: { ...customizationData.layout, compact: !customizationData.layout.compact }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          customizationData.layout.compact ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          customizationData.layout.compact ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Card Style</h4>
                        <p className="text-white/60 text-sm">Choose card appearance</p>
                      </div>
                      <select
                        value={customizationData.layout.cardStyle}
                        onChange={(e) => setCustomizationData({
                          ...customizationData,
                          layout: { ...customizationData.layout, cardStyle: e.target.value }
                        })}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <option value="rounded">Rounded</option>
                        <option value="sharp">Sharp</option>
                        <option value="pill">Pill</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Spacing</h4>
                        <p className="text-white/60 text-sm">Adjust content spacing</p>
                      </div>
                      <select
                        value={customizationData.layout.spacing}
                        onChange={(e) => setCustomizationData({
                          ...customizationData,
                          layout: { ...customizationData.layout, spacing: e.target.value }
                        })}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <option value="tight">Tight</option>
                        <option value="comfortable">Comfortable</option>
                        <option value="spacious">Spacious</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">Typography</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Font Family</h4>
                        <p className="text-white/60 text-sm">Choose your preferred font</p>
                      </div>
                      <select
                        value={customizationData.typography.fontFamily}
                        onChange={(e) => setCustomizationData({
                          ...customizationData,
                          typography: { ...customizationData.typography, fontFamily: e.target.value }
                        })}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <option value="inter">Inter</option>
                        <option value="roboto">Roboto</option>
                        <option value="opensans">Open Sans</option>
                        <option value="poppins">Poppins</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Font Size</h4>
                        <p className="text-white/60 text-sm">Adjust text size</p>
                      </div>
                      <select
                        value={customizationData.typography.fontSize}
                        onChange={(e) => setCustomizationData({
                          ...customizationData,
                          typography: { ...customizationData.typography, fontSize: e.target.value }
                        })}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Effects */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">Visual Effects</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Backdrop Blur</h4>
                        <p className="text-white/60 text-sm">Enable glass blur effects</p>
                      </div>
                      <button
                        onClick={() => setCustomizationData({
                          ...customizationData,
                          effects: { ...customizationData.effects, blur: !customizationData.effects.blur }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          customizationData.effects.blur ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          customizationData.effects.blur ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Shadows</h4>
                        <p className="text-white/60 text-sm">Show shadow effects</p>
                      </div>
                      <button
                        onClick={() => setCustomizationData({
                          ...customizationData,
                          effects: { ...customizationData.effects, shadows: !customizationData.effects.shadows }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          customizationData.effects.shadows ? 'bg-white/30' : 'bg-white/10'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          customizationData.effects.shadows ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Transparency: {customizationData.effects.transparency}</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={customizationData.effects.transparency}
                        onChange={(e) => setCustomizationData({
                          ...customizationData,
                          effects: { ...customizationData.effects, transparency: parseFloat(e.target.value) }
                        })}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Presets */}
                <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/15 p-6">
                  <h3 className="text-lg text-white font-medium mb-4">Presets</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-all">
                      Default
                    </button>
                    <button className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-all">
                      Minimal
                    </button>
                    <button className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-all">
                      Vibrant
                    </button>
                    <button className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-all">
                      Professional
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Other Tab Contents */}
          {activeTab !== 'Permissions' && activeTab !== 'Scan' && activeTab !== 'Chatbot' && activeTab !== 'Profile' && activeTab !== 'Settings' && activeTab !== 'Customization' && (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">
                {activeTab} content coming soon...
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
