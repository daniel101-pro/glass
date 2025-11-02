import { Router } from 'express';
import type { Request, Response } from 'express';
import { waitlistStore } from '../stores/waitlistStore.js';
import { addToWaitlistValidation } from '../validation/waitlist.js';
import { validateRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * POST /waitlist
 * Add email to waitlist
 */
router.post('/', addToWaitlistValidation, validateRequest, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const entry = await waitlistStore.addEmail({ email });

    res.status(201).json({
      message: 'Successfully added to waitlist',
      data: entry,
    });
  } catch (error) {
    console.error('Waitlist signup error:', error);
    
    if (error instanceof Error && error.message === 'Email already exists in waitlist') {
      return res.status(409).json({
        error: 'Email already exists in waitlist',
      });
    }

    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/**
 * GET /waitlist
 * Get all waitlist entries (admin only)
 */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const entries = await waitlistStore.getAllEntries();
    const count = await waitlistStore.getCount();

    res.json({
      success: true,
      count,
      data: entries,
    });
  } catch (error) {
    console.error('Get waitlist error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/**
 * DELETE /waitlist/:id
 * Delete a waitlist entry (admin only)
 */
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: 'ID parameter is required',
      });
    }

    const deleted = await waitlistStore.deleteEntry(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Entry not found',
      });
    }

    res.json({
      success: true,
      message: 'Entry deleted successfully',
    });
  } catch (error) {
    console.error('Delete waitlist entry error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/**
 * GET /waitlist/export
 * Export waitlist as CSV (admin only)
 */
router.get('/export', authenticateToken, async (req: Request, res: Response) => {
  try {
    const entries = await waitlistStore.getAllEntries();
    
    const csv = [
      ['Email', 'Date Joined'].join(','),
      ...entries.map(entry => [
        entry.email,
        new Date(entry.createdAt).toLocaleString()
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=waitlist.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export waitlist error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export { router as waitlistRouter };

