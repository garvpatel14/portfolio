require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Database Pool ────────────────────────────────────────────────────────────
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'portfolio_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'garvpatel@14',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    release();
    console.log('✅ Connected to PostgreSQL database');
  }
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// ─── API Routes ───────────────────────────────────────────────────────────────

// GET /api/projects — fetch all projects from DB
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects ORDER BY featured DESC, created_at DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id — single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

// GET /api/skills — fetch all skills grouped by category
app.get('/api/skills', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills ORDER BY category, display_order');
    // Group by category
    const grouped = result.rows.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill.name);
      return acc;
    }, {});
    res.json({ success: true, data: grouped });
  } catch (err) {
    console.error('Error fetching skills:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch skills' });
  }
});

// POST /api/contact — save a contact message
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }
  try {
    await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)',
      [name.trim(), email.trim().toLowerCase(), message.trim()]
    );
    res.json({ success: true, message: 'Message received! I will get back to you soon.' });
  } catch (err) {
    console.error('Error saving message:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// GET /api/stats — portfolio stats (project count, skills count, messages)
app.get('/api/stats', async (req, res) => {
  try {
    const [projects, skills, messages] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM projects'),
      pool.query('SELECT COUNT(*) FROM skills'),
      pool.query('SELECT COUNT(*) FROM contact_messages'),
    ]);
    res.json({
      success: true,
      data: {
        projects: parseInt(projects.rows[0].count),
        skills: parseInt(skills.rows[0].count),
        messages: parseInt(messages.rows[0].count),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// Fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Portfolio server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, pool };
