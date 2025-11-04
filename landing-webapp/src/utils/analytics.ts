/**
 * Google Analytics Integration
 * 
 * To enable Google Analytics:
 * 1. Get your GA4 Measurement ID (e.g., G-XXXXXXXXXX)
 * 2. Add it to your environment variables as VITE_GA_MEASUREMENT_ID
 * 3. The script in index.html will automatically initialize GA
 * 
 * For real-time analytics data in the dashboard, you'll need to:
 * 1. Set up Google Analytics Reporting API
 * 2. Create a backend endpoint to fetch GA data
 * 3. Replace mock data in AdminPage with real API calls
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID || '', {
      page_path: path,
    });
  }
};

// Track waitlist signup
export const trackWaitlistSignup = (email: string) => {
  trackEvent('waitlist_signup', {
    email: email,
    event_category: 'engagement',
    event_label: 'Waitlist',
  });
};

// Track video demo view
export const trackVideoDemo = () => {
  trackEvent('video_demo_view', {
    event_category: 'engagement',
    event_label: 'Video Demo',
  });
};

