'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { apiClient } from '../utils/api';

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Permissions');

  useEffect(() => {
    checkAuthStatus();
  }, [session, status]);

  const checkAuthStatus = async () => {
    try {
      // Check for NextAuth session (Google Auth)
      if (status === 'authenticated' && session) {
        setUser({
          fullName: session.user?.name || 'Google User',
          email: session.user?.email || '',
        });
        setIsLoading(false);
        return;
      }

      // Check for traditional auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        if (status !== 'loading') {
          router.push('/onboarding');
        }
        return;
      }

      // Verify token is still valid by making an authenticated request
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        localStorage.removeItem('authToken');
        router.push('/onboarding');
        return;
      }

      const userData = await response.json();
      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      if (status !== 'loading') {
        router.push('/onboarding');
      }
    }
  };

  const handleSignOut = async () => {
    // Sign out from NextAuth (Google Auth)
    if (session) {
      await signOut({ callbackUrl: '/onboarding', redirect: true });
    } else {
      // Traditional auth sign out
      localStorage.removeItem('authToken');
      router.push('/onboarding');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-4xl mx-auto">
          
          {/* Header with Sign Out */}
          <div className="flex justify-between items-center mb-12">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-light text-white mb-1 tracking-wide opacity-90">
                Glass
              </h1>
              <p className="text-sm text-white/60 font-light">
                Dashboard
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-all duration-300"
            >
              Sign Out
            </button>
          </div>

          {/* Welcome Message */}
          {user && (
            <div className="text-center mb-8">
              <p className="text-lg text-white/80">
                Welcome back, {user.fullName}!
              </p>
            </div>
          )}

          {/* Glass Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-light text-white mb-1 tracking-wide opacity-90">
              Glass
            </h1>
            <p className="text-sm text-white/60 font-light">
              Clarity starts here
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="flex justify-center gap-1 bg-white/8 backdrop-blur-sm rounded-full p-1 max-w-2xl mx-auto border border-white/10">
              {['Permissions', 'Scan', 'Chatbot', 'Profile', 'Customization', 'Settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-normal transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-white/15 text-white shadow-lg border border-white/20'
                      : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Permissions Content */}
          {activeTab === 'Permissions' && (
            <>
              {/* Description */}
              <div className="text-center mb-6 max-w-xl mx-auto">
                <p className="text-base text-white/70 leading-relaxed font-light">
                  To help Glass verify facts and protect you from misinformation, we'll need a few permissions. You stay in control at all times.
                </p>
              </div>

              {/* Permission Cards */}
              <div className="w-full max-w-2xl mx-auto bg-white/8 backdrop-blur-md rounded-2xl p-6 border border-white/15">
                <div className="space-y-3">
                  {/* Screen Access */}
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/6 border border-white/12">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-white/15 rounded border border-white/25 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white text-base font-normal">Screen Access</span>
                    </div>
                    <button className="w-6 h-6 bg-white/8 rounded-full flex items-center justify-center hover:bg-white/15 transition-all border border-white/15">
                      <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Microphone Access */}
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/6 border border-white/12">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-white/15 rounded border border-white/25 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white text-base font-normal">Microphone Access</span>
                    </div>
                    <button className="w-6 h-6 bg-white/8 rounded-full flex items-center justify-center hover:bg-white/15 transition-all border border-white/15">
                      <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Notifications */}
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/6 border border-white/12">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-white/15 rounded border border-white/25 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white text-base font-normal">Notifications</span>
                    </div>
                    <button className="w-6 h-6 bg-white/8 rounded-full flex items-center justify-center hover:bg-white/15 transition-all border border-white/15">
                      <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Screen Access (Second Instance) */}
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/6 border border-white/12">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-white/15 rounded border border-white/25 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white text-base font-normal">Screen Access</span>
                    </div>
                    <button className="w-6 h-6 bg-white/8 rounded-full flex items-center justify-center hover:bg-white/15 transition-all border border-white/15">
                      <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Custom Controls */}
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/6 border border-white/12">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-white/15 rounded border border-white/25 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white text-base font-normal">Custom Controls</span>
                    </div>
                    <button className="w-6 h-6 bg-white/8 rounded-full flex items-center justify-center hover:bg-white/15 transition-all border border-white/15">
                      <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Text */}
              <div className="text-center mt-8 max-w-2xl mx-auto">
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  <span className="font-normal text-white/80">You're always in charge.</span> Glass only works when you give permission — and you can change your settings anytime from the dashboard.
                </p>
              </div>
            </>
          )}

          {/* Other Tab Contents */}
          {activeTab !== 'Permissions' && (
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
