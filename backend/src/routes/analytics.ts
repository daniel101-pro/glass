import { Router } from 'express';
import type { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { fetchWebsiteAnalytics } from '../services/analyticsService.js';

const router = Router();

/**
 * GET /analytics/website-visits
 * Get website visits data from Google Analytics
 * Admin only
 */
router.get('/website-visits', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, days } = req.query;
    
    // Calculate date range
    const end = endDate ? new Date(endDate as string) : new Date();
    const daysBack = days ? parseInt(days as string) : 30;
    const start = startDate ? new Date(startDate as string) : new Date(end.getTime() - daysBack * 24 * 60 * 60 * 1000);
    
    // Fetch real data from Google Analytics
    const data = await fetchWebsiteAnalytics(start, end);
    
    res.json({
      success: true,
      data: data,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics data',
    });
  }
});

export { router as analyticsRouter };

