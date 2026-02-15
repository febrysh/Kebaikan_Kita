import express from 'express';
import db from '../models/database.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all donations (admin only for all, public for verified only)
router.get('/', (req, res) => {
  try {
    const { campaign_id, status } = req.query;
    const isAdmin = req.headers.authorization; // Simple check if token exists

    let query = 'SELECT d.*, c.title as campaign_title FROM donations d LEFT JOIN campaigns c ON d.campaign_id = c.id WHERE 1=1';
    const params = [];

    if (campaign_id) {
      query += ' AND d.campaign_id = ?';
      params.push(campaign_id);
    }

    if (status) {
      query += ' AND d.status = ?';
      params.push(status);
    } else if (!isAdmin) {
      // Public only sees verified donations
      query += ' AND d.status = ?';
      params.push('verified');
    }

    query += ' ORDER BY d.created_at DESC';

    const donations = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: donations
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations'
    });
  }
});

// Create donation (public)
router.post('/', (req, res) => {
  try {
    const { campaign_id, donor_name, donor_email, donor_phone, amount, payment_method } = req.body;

    if (!campaign_id || !donor_name || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: campaign_id, donor_name, amount'
      });
    }

    // Verify campaign exists
    const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(campaign_id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    const stmt = db.prepare(`
      INSERT INTO donations (campaign_id, donor_name, donor_email, donor_phone, amount, payment_method, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      campaign_id,
      donor_name,
      donor_email || null,
      donor_phone || null,
      amount,
      payment_method || 'transfer',
      'pending'
    );

    const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Donation created successfully. Waiting for verification.',
      data: donation
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create donation'
    });
  }
});

// Verify donation (admin only)
router.patch('/:id/verify', verifyToken, verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'verified' or 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either verified or rejected'
      });
    }

    const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Start transaction
    const updateDonation = db.prepare(`
      UPDATE donations 
      SET status = ?, verified_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

    updateDonation.run(status, id);

    // If verified, update campaign collected amount and donor count
    if (status === 'verified') {
      const updateCampaign = db.prepare(`
        UPDATE campaigns 
        SET 
          collected = collected + ?,
          donors = donors + 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      updateCampaign.run(donation.amount, donation.campaign_id);
    }

    const updatedDonation = db.prepare('SELECT * FROM donations WHERE id = ?').get(id);

    res.json({
      success: true,
      message: `Donation ${status} successfully`,
      data: updatedDonation
    });
  } catch (error) {
    console.error('Verify donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify donation'
    });
  }
});

// Delete donation (admin only)
router.delete('/:id', verifyToken, verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;

    const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // If donation was verified, decrease campaign collected amount
    if (donation.status === 'verified') {
      db.prepare(`
        UPDATE campaigns 
        SET 
          collected = collected - ?,
          donors = donors - 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(donation.amount, donation.campaign_id);
    }

    db.prepare('DELETE FROM donations WHERE id = ?').run(id);

    res.json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete donation'
    });
  }
});

// Get donation statistics (admin only)
router.get('/stats/summary', verifyToken, verifyAdmin, (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_donations,
        SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as verified_donations,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_donations,
        SUM(CASE WHEN status = 'verified' THEN amount ELSE 0 END) as total_verified_amount,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending_amount
      FROM donations
    `).get();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get donation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation statistics'
    });
  }
});

export default router;
