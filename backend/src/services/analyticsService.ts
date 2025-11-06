import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { getEnv } from '../config/env.js';

const env = getEnv();

let analyticsClient: BetaAnalyticsDataClient | null = null;

/**
 * Initialize Google Analytics client
 */
function getAnalyticsClient(): BetaAnalyticsDataClient | null {
  if (!env.GA_PROPERTY_ID || !env.GA_SERVICE_ACCOUNT_KEY) {
    console.log('⚠️  Google Analytics not configured. GA_PROPERTY_ID and GA_SERVICE_ACCOUNT_KEY required.');
    return null;
  }

  if (!analyticsClient) {
    try {
      const credentials = JSON.parse(env.GA_SERVICE_ACCOUNT_KEY);
      analyticsClient = new BetaAnalyticsDataClient({
        credentials,
      });
      console.log('✅ Google Analytics client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Google Analytics client:', error);
      return null;
    }
  }

  return analyticsClient;
}

/**
 * Fetch website visits and page views from Google Analytics
 */
export async function fetchWebsiteAnalytics(
  startDate: Date,
  endDate: Date
): Promise<{ date: string; visits: number; pageViews: number }[]> {
  // Return empty data if GA not configured (don't throw error)
  const client = getAnalyticsClient();

  if (!client) {
    console.log('📊 Google Analytics not configured - returning empty data');
    return generateEmptyData(startDate, endDate);
  }

  if (!env.GA_PROPERTY_ID) {
    console.log('📊 GA_PROPERTY_ID not set - returning empty data');
    return generateEmptyData(startDate, endDate);
  }

  try {
    const [response] = await client.runReport({
      property: `properties/${env.GA_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: startDate.toISOString().split('T')[0]?.replace(/-/g, '') || '',
          endDate: endDate.toISOString().split('T')[0]?.replace(/-/g, '') || '',
        },
      ],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'sessions' }, // Visits
        { name: 'screenPageViews' }, // Page Views
      ],
      orderBys: [
        {
          dimension: {
            dimensionName: 'date',
          },
        },
      ],
    });

    const data: { date: string; visits: number; pageViews: number }[] = [];

    response.rows?.forEach((row) => {
      const dateValue = row.dimensionValues?.[0]?.value || '';
      const visits = parseInt(row.metricValues?.[0]?.value || '0', 10);
      const pageViews = parseInt(row.metricValues?.[1]?.value || '0', 10);

      // Format date: YYYYMMDD -> Month Day
      if (dateValue && dateValue.length === 8) {
        const year = parseInt(dateValue.substring(0, 4), 10);
        const month = parseInt(dateValue.substring(4, 6), 10) - 1;
        const day = parseInt(dateValue.substring(6, 8), 10);
        
        if (!isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 0 && month < 12 && day > 0 && day <= 31) {
          const date = new Date(year, month, day);
          
          data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            visits,
            pageViews,
          });
        }
      }
    });

    // Sort by date to ensure chronological order
    data.sort((a, b) => {
      // Parse dates from formatted strings (e.g., "Jan 15")
      const parseDate = (dateStr: string): Date | null => {
        try {
          const parts = dateStr.split(' ');
          if (parts.length < 2 || !parts[0] || !parts[1]) return null;
          
          const month = parts[0];
          const day = parseInt(parts[1], 10);
          const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
          
          if (monthIndex === -1 || isNaN(day)) return null;
          
          const currentYear = new Date().getFullYear();
          return new Date(currentYear, monthIndex, day);
        } catch {
          return null;
        }
      };
      
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    });

    return data;
  } catch (error) {
    console.error('❌ Error fetching Google Analytics data:', error);
    // Return empty data on error
    return generateEmptyData(startDate, endDate);
  }
}

/**
 * Generate empty data structure for dates when GA is not configured
 */
function generateEmptyData(startDate: Date, endDate: Date): { date: string; visits: number; pageViews: number }[] {
  const data: { date: string; visits: number; pageViews: number }[] = [];
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visits: 0,
      pageViews: 0,
    });
  }
  
  return data;
}

