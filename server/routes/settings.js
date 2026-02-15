import express from 'express';
import db from '../models/database.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all settings (public)
router.get('/', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM settings').all();
    
    // Convert to object format for easier frontend consumption
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = {
        value: setting.value,
        type: setting.type,
        updated_at: setting.updated_at
      };
    });

    res.json({
      success: true,
      data: settingsObj
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// Get single setting by key (public)
router.get('/:key', (req, res) => {
  try {
    const { key } = req.params;
    const setting = db.prepare('SELECT * FROM settings WHERE key = ?').get(key);

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    res.json({
      success: true,
      data: setting
    });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch setting'
    });
  }
});

// Update setting (admin only)
router.put('/:key', verifyToken, verifyAdmin, (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Value is required'
      });
    }

    const setting = db.prepare('SELECT * FROM settings WHERE key = ?').get(key);

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    const stmt = db.prepare(`
      UPDATE settings 
      SET value = ?, updated_at = CURRENT_TIMESTAMP
      WHERE key = ?
    `);

    stmt.run(value, key);

    const updatedSetting = db.prepare('SELECT * FROM settings WHERE key = ?').get(key);

    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: updatedSetting
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update setting'
    });
  }
});

// Bulk update settings (admin only)
router.post('/bulk', verifyToken, verifyAdmin, (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Settings object is required'
      });
    }

    const stmt = db.prepare(`
      UPDATE settings 
      SET value = ?, updated_at = CURRENT_TIMESTAMP
      WHERE key = ?
    `);

    // Update each setting
    Object.entries(settings).forEach(([key, value]) => {
      stmt.run(value, key);
    });

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Bulk update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// Create new setting (admin only)
router.post('/', verifyToken, verifyAdmin, (req, res) => {
  try {
    const { key, value, type } = req.body;

    if (!key || !value) {
      return res.status(400).json({
        success: false,
        message: 'Key and value are required'
      });
    }

    const stmt = db.prepare(`
      INSERT INTO settings (key, value, type)
      VALUES (?, ?, ?)
    `);

    stmt.run(key, value, type || 'text');

    const setting = db.prepare('SELECT * FROM settings WHERE key = ?').get(key);

    res.status(201).json({
      success: true,
      message: 'Setting created successfully',
      data: setting
    });
  } catch (error) {
    console.error('Create setting error:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        success: false,
        message: 'Setting with this key already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create setting'
    });
  }
});

// Delete setting (admin only)
router.delete('/:key', verifyToken, verifyAdmin, (req, res) => {
  try {
    const { key } = req.params;

    const setting = db.prepare('SELECT * FROM settings WHERE key = ?').get(key);
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    db.prepare('DELETE FROM settings WHERE key = ?').run(key);

    res.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete setting'
    });
  }
});

export default router;
