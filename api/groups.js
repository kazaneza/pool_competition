// api/groups.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { method } = req;

  // Example: read or write a local JSON file
  const dataFilePath = path.join(process.cwd(), 'groupsData.json');

  if (method === 'GET') {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading data:', err);
        return res.status(500).json({ error: 'Failed to read data' });
      }
      res.status(200).json(JSON.parse(data));
    });
  } else if (method === 'POST') {
    const groups = req.body;
    fs.writeFile(dataFilePath, JSON.stringify(groups, null, 2), (err) => {
      if (err) {
        console.error('Error saving data:', err);
        return res.status(500).json({ error: 'Failed to save data' });
      }
      res.status(200).json({ message: 'Data saved successfully' });
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
