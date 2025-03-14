// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const dataFilePath = path.join(__dirname, 'groupsData.json');

// Example API endpoints
app.get('/api/groups', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      return res.status(500).json({ error: 'Failed to read data' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/groups', (req, res) => {
  const groups = req.body;
  fs.writeFile(dataFilePath, JSON.stringify(groups, null, 2), (err) => {
    if (err) {
      console.error('Error saving data:', err);
      return res.status(500).json({ error: 'Failed to save data' });
    }
    res.json({ message: 'Data saved successfully' });
  });
});

// Serve the React build from 'dist' in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  // Serve all static files
  app.use(express.static(distPath));
  // For any other routes, serve index.html so React can handle routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Listen on whatever port is given by Vercel or 3001 locally
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
