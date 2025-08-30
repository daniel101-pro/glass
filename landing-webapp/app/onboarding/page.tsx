'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { colors } from '../styles/colors';
import Image from 'next/image';
import { gsap } from 'gsap';
import SplitText from '../TextAnimations/SplitText/SplitText';
import { apiClient } from '../utils/api';
import type { SignupData } from '../utils/api';
import GlassConfetti from '../components/GlassConfetti/GlassConfetti';


export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'signup', 'email-form', 'verification', 'success'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  
  const topCloudRef = useRef(null);
  const bottomCloudRef = useRef(null);
  const buttonRef = useRef(null);
  const mouseFollowerRef = useRef(null);
  const contentRef = useRef(null);

  const handleAnimationComplete = () => {
    console.log('Header animation complete!');
  };

  const handleCreateAccount = () => {
    // Animate transition to signup form
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          setCurrentView('signup');
          gsap.fromTo(contentRef.current, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
          );
        }
      });
    }
  };

  const handleEmailSignup = () => {
    // Animate transition to email form
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          setCurrentView('email-form');
          gsap.fromTo(contentRef.current, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
          );
        }
      });
    }
  };

  const handleBackToLanding = () => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          setCurrentView('landing');
          gsap.fromTo(contentRef.current, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
          );
        }
      });
    }
  };

  const handleBackToSignup = () => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          setCurrentView('signup');
          setError(null); // Clear any errors
          gsap.fromTo(contentRef.current, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
          );
        }
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: true,
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!verificationCode.trim()) {
        throw new Error('Verification code is required');
      }

      // Call verification API endpoint
      await apiClient.verifyEmail(userEmail, verificationCode);
      
      // Animate transition to success screen
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            setCurrentView('success');
            setShowConfetti(true);
            gsap.fromTo(contentRef.current, 
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
          }
        });
      }
      
    } catch (error) {
      console.error('Verification error:', error);
      setError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call resend verification code API
      await apiClient.resendVerificationCode(userEmail);
      
      alert('Verification code sent to your email!');
      
    } catch (error) {
      console.error('Resend error:', error);
      setError('Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.fullName.trim()) {
        throw new Error('Full name is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.password) {
        throw new Error('Password is required');
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Call API
      const response = await apiClient.signup({
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      console.log('Signup successful:', response);
      
      // Store auth token
      if (response.tokens && response.tokens.accessToken) {
        localStorage.setItem('authToken', response.tokens.accessToken);
      }
      
      // Store user info for verification screen
      setUserEmail(formData.email);
      setUserName(response.user.fullName);
      
      // Animate transition to verification screen
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            setCurrentView('verification');
            gsap.fromTo(contentRef.current, 
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
          }
        });
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated with Google
    if (session && status === 'authenticated') {
      // User is signed in with Google, redirect to dashboard
      router.push('/dashboard');
    }
  }, [session, status, router]);

  useEffect(() => {
    // Top cloud animation - up and down
    gsap.to(topCloudRef.current, {
      y: -80,
      duration: 2.5,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Bottom cloud animation - left and right
    gsap.to(bottomCloudRef.current, {
      x: -60,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Button breathing animation
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Mouse follower effect
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseFollowerRef.current) {
        gsap.to(mouseFollowerRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`min-h-screen ${colors.custom['Blue-dark-bg']} relative overflow-hidden`}>
      {/* Glass Mouse Follower */}
      <div 
        ref={mouseFollowerRef}
        className="fixed w-40 h-40 pointer-events-none z-50 flex items-center justify-center"
        style={{
          background: 'transparent',
          borderRadius: '50%',
          backdropFilter: 'blur(1px)',
          border: '1px solid rgba(255,255,255,0.1)',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Inner completely clear circle - completely isolated from parent blur */}
        <div 
          className="w-24 h-24 rounded-full relative"
          style={{
            background: 'transparent',
            backdropFilter: 'none',
            border: '1px solid rgba(255,255,255,0.05)',
            isolation: 'isolate',
            filter: 'none',
            zIndex: 1
          }}
        />
      </div>

      {/* Top Left Cloud */}
      <div 
        ref={topCloudRef} 
        className={`absolute w-[400px] h-[400px] opacity-60 transition-all duration-500 ${
          currentView === 'landing' ? '-top-16 -left-[110px]' :
          currentView === 'signup' ? '-top-24 -left-[150px]' :
          '-top-32 -left-[200px]' // email-form
        }`}
      >
        <Image
          src="/assets/images/cloud1.svg"
          alt="Cloud decoration"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Bottom Right Cloud */}
      <div 
        ref={bottomCloudRef} 
        className={`absolute w-[300px] h-[300px] opacity-50 transition-all duration-500 ${
          currentView === 'landing' ? '-bottom-20 right-0' :
          currentView === 'signup' ? '-bottom-32 -right-[50px]' :
          '-bottom-40 -right-[100px]' // email-form
        }`}
      >
        <Image
          src="/assets/images/cloud2.svg"
          alt="Cloud decoration"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Blur Layer */}
      <div className="absolute inset-0 backdrop-blur-[5px] bg-white/10"></div>

      {/* Content can go here */}
      <div ref={contentRef} className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
                {currentView === 'landing' ? (
          // Landing Page Content
          <>
            {/* Main Heading */}
            <div className="text-center mb-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tighter text-center">
                <SplitText
                  text="Clarity"
                  className="text-white"
                  delay={50}
                  duration={0.4}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  tag="span"
                  onLetterAnimationComplete={handleAnimationComplete}
                />
                &nbsp;
                <SplitText
                  text="starts here."
                  className="text-[#C0DDEF]"
                  delay={50}
                  duration={0.4}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  tag="span"
                />
              </h1>
            </div>

            {/* Subheading */}
            <div className="-mt-6 text-center max-w-2xl mb-8">
              <SplitText
                text="Join Glass and experience truth in real time —"
                className="text-lg md:text-xl text-white leading-tight opacity-90"
                delay={30}
                duration={0.3}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 20 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-50px"
                textAlign="center"
                tag="p"
              />
              <SplitText
                text="transparent, simple, and always in focus."
                className="text-lg md:text-xl text-white leading-tight opacity-90"
                delay={30}
                duration={0.3}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 20 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-50px"
                textAlign="center"
                tag="p"
              />
            </div>

            {/* Call-to-Action Button */}
            <button
              ref={buttonRef}
              onClick={handleCreateAccount}
              className="-mt-5 px-5 py-2.5 text-white font-medium text-[16px] tracking-tight hover:scale-105 transition-all duration-300 relative"
              style={{
                backgroundImage: 'url(/assets/images/button.svg)',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            >
              Create My Account
            </button>
          </>
        ) : currentView === 'signup' ? (
          // Signup Options Content
          <>
            {/* Back Button */}
            <button
              onClick={handleBackToLanding}
              className="absolute top-8 left-8 text-white/70 hover:text-white transition-colors text-sm"
            >
              ← Back
            </button>

            {/* Signup Heading */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter text-white mb-4">
                Clarity starts here.
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                Choose your preferred way to get started
              </p>
            </div>

            {/* Signup Buttons */}
            <div className="flex flex-col gap-4 w-full max-w-sm">
              {/* Google Signup */}
              <button
                onClick={handleGoogleSignIn}
                disabled={status === 'loading'}
                className="flex items-center justify-center gap-3 px-6 py-3 text-white font-medium text-[16px] tracking-tight hover:scale-105 transition-all duration-300 relative disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  backgroundImage: 'url(/assets/images/button.svg)',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              >
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs text-blue-600 font-bold">G</span>
                </div>
                {status === 'loading' ? 'Signing in...' : 'Sign up with Google'}
              </button>

              {/* Email Signup */}
              <button
                onClick={handleEmailSignup}
                className="flex items-center justify-center gap-3 px-6 py-3 text-white font-medium text-[16px] tracking-tight hover:scale-105 transition-all duration-300 relative"
                style={{
                  backgroundImage: 'url(/assets/images/button.svg)',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              >
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs text-blue-600 font-bold">@</span>
                </div>
                Continue with Email
              </button>
            </div>

            {/* Terms */}
            <p className="text-xs text-white/60 text-center max-w-sm mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </>
        ) : currentView === 'email-form' ? (
          // Email Form Content
          <>
            {/* Back Button */}
            <button
              onClick={handleBackToSignup}
              className="absolute top-8 left-8 text-white/70 hover:text-white transition-colors text-sm"
            >
              ← Back
            </button>

            {/* Form Heading */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter mb-4">
                <span className="text-white">Clarity </span>
                <span style={{ color: '#C0DDEF' }}>starts here.</span>
              </h1>
              <p className="text-lg text-white/80 max-w-2xl">
                Join Glass and experience truth in real time —<br />
                transparent, simple, and always in focus.
              </p>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSignup} className="w-full max-w-md space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Full Name Input */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Daniel Falodun"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                />
              </div>

              {/* Email Address Input */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="falodundaniel@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                />
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 text-white font-medium text-[16px] tracking-tight hover:scale-105 transition-all duration-300 relative mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  backgroundImage: 'url(/assets/images/button.svg)',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create My Account'}
              </button>
            </form>
          </>
        ) : currentView === 'verification' ? (
          // Verification Screen Content
          <>
            {/* Verification Heading */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter mb-4">
                <span style={{ color: '#C0DDEF' }}>Verify </span>
                <span className="text-white">for Clarity</span>
              </h1>
              <p className="text-lg text-white/80 max-w-md mx-auto">
                We've sent a code to your email. Enter it to confirm your identity
              </p>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerification} className="w-full max-w-md space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Verification Code Input */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Enter code
                </label>
                <input
                  type="text"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  maxLength={6}
                  autoFocus
                />
              </div>

              {/* Confirm Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 text-white font-medium text-[16px] tracking-tight hover:scale-105 transition-all duration-300 relative mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  backgroundImage: 'url(/assets/images/button.svg)',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              >
                {isLoading ? 'Verifying...' : 'Confirm and Continue'}
              </button>
            </form>

            {/* Resend Code */}
            <div className="text-center mt-6">
              <p className="text-white/60 text-sm">
                Didn't get it?{' '}
                <button
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-white hover:text-white/80 underline disabled:opacity-50"
                >
                  Resend code →
                </button>
              </p>
            </div>
          </>
        ) : currentView === 'success' ? (
          // Success Screen Content
          <>
            {/* Success Content */}
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter mb-6">
                <span className="text-white">You're In! </span>
                <span style={{ color: '#C0DDEF' }}>The Lens is Clear.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
                From news feeds to video calls, Glass helps<br />
                you see the facts clearly — all in one place.
              </p>

              {/* Continue Button */}
              <button
                className="px-8 py-4 text-white font-medium text-[18px] tracking-tight hover:scale-105 transition-all duration-300 relative"
                style={{
                  backgroundImage: 'url(/assets/images/button.svg)',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
                onClick={() => {
                  // Navigate to dashboard
                  setShowConfetti(false);
                  router.push('/dashboard');
                }}
              >
                Continue to Dashboard
              </button>
            </div>
          </>
        ) : null}
      </div>

      {/* Glass Confetti Animation */}
      {showConfetti && <GlassConfetti />}
    </div>
  );
}
