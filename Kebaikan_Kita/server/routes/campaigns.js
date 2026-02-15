import express from 'express';
import db from '../models/database.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all campaigns (public)
router.get('/', (req, res) => {
  try {
    const { category, status, urgent } = req.query;
    
    let query = 'SELECT * FROM campaigns WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    } else {
      // Default: only show active campaigns for public
      query += ' AND status = ?';
      params.push('active');
    }

    if (urgent !== undefined) {
      query += ' AND urgent = ?';
      params.push(urgent === 'true' ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC';

    const campaigns = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: campaigns
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaigns'
    });
  }
});

// Get single campaign by ID or slug (public)
router.get('/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to get by ID first, then by slug
    let campaign;
    if (!isNaN(identifier)) {
      campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(identifier);
    }
    
    if (!campaign) {
      campaign = db.prepare('SELECT * FROM campaigns WHERE slug = ?').get(identifier);
    }

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaign'
    });
  }
});

// Create campaign (admin only)
router.post('/', verifyToken, verifyAdmin, (req, res) => {
  try {
    const { title, slug, category, target, story, image_url, urgent } = req.body;

    if (!title || !slug || !category || !target || !story) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const stmt = db.prepare(`
      INSERT INTO campaigns (title, slug, category, target, story, image_url, urgent)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(title, slug, category, target, story, image_url || null, urgent ? 1 : 0);

    const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        success: false,
        message: 'Campaign with this slug already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create campaign'
    });
  }
});

// Update campaign (admin only)
router.put('/:id', verifyToken, verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, category, target, collected, donors, story, image_url, status, urgent } = req.body;

    const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    const stmt = db.prepare(`
      UPDATE campaigns 
      SET title = ?, slug = ?, category = ?, target = ?, collected = ?, donors = ?,
          story = ?, image_url = ?, status = ?, urgent = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      title || campaign.title,
      slug || campaign.slug,
      category || campaign.category,
      target !== undefined ? target : campaign.target,
      collected !== undefined ? collected : campaign.collected,
      donors !== undefined ? donors : campaign.donors,
      story || campaign.story,
      image_url !== undefined ? image_url : campaign.image_url,
      status || campaign.status,
      urgent !== undefined ? (urgent ? 1 : 0) : campaign.urgent,
      id
    );

    const updatedCampaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: updatedCampaign
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update campaign'
    });
  }
});

// Delete campaign (admin only)
router.delete('/:id', verifyToken, verifyAdmin, (req, res) => {
  try {
    const { id } = req.params;

    const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    db.prepare('DELETE FROM campaigns WHERE id = ?').run(id);

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete campaign'
    });
  }
});

// Get campaign statistics (admin only)
router.get('/stats/summary', verifyToken, verifyAdmin, (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_campaigns,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_campaigns,
        SUM(collected) as total_collected,
        SUM(target) as total_target,
        SUM(donors) as total_donors
      FROM campaigns
    `).get();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

export default router;
