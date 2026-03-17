require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_for_dev';

app.use(cors());
app.use(express.json());

// ─── Middleware ──────────────────────────────────────────
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ─── Auth ───────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ─── Health Check ────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Profile ────────────────────────────────────────────
app.get('/api/profile', (_req, res) => {
  res.json({
    name: 'Sumit Sah',
    title: 'Full Stack Developer',
    bio: 'Passionate developer focus on building modern web applications.',
    location: 'Nepal',
    email: 'sahsumit7488@gmail.com',
    social: {
      github: 'https://github.com/sam7488',
      linkedin: 'https://www.linkedin.com/in/sumit-kumar-sah-503ab4287/',
    },
  });
});

// ─── Projects ────────────────────────────────────────────
app.get('/api/projects', async (_req, res) => {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(projects);
});

app.get('/api/projects/featured', async (_req, res) => {
  const projects = await prisma.project.findMany({ where: { featured: true }, orderBy: { createdAt: 'desc' } });
  res.json(projects);
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.create({ data: req.body });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ─── Experience ──────────────────────────────────────────
app.get('/api/experience', async (_req, res) => {
  const experiences = await prisma.experience.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(experiences);
});

app.post('/api/experience', authenticateToken, async (req, res) => {
  try {
    const exp = await prisma.experience.create({ data: req.body });
    res.status(201).json(exp);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

app.put('/api/experience/:id', authenticateToken, async (req, res) => {
  try {
    const exp = await prisma.experience.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(exp);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

app.delete('/api/experience/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.experience.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Experience deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// ─── Skills ──────────────────────────────────────────────
app.get('/api/skills', async (_req, res) => {
  const skills = await prisma.skill.findMany({ orderBy: { category: 'asc' } });
  res.json(skills);
});

app.post('/api/skills', authenticateToken, async (req, res) => {
  try {
    const skill = await prisma.skill.create({ data: req.body });
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

app.delete('/api/skills/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.skill.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// ─── Messages ─────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  try {
    const message = await prisma.message.create({ data: req.body });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/api/messages', authenticateToken, async (_req, res) => {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(messages);
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
