import dbConnect from '../utils/dbConnect.js';
import Group from '../models/Group.js';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const groups = await Group.find({});
        res.status(200).json(groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Failed to fetch groups' });
      }
      break;

    case 'POST':
      try {
        // Expecting req.body to be an array of groups or a single group object.
        // Here we use insertMany to allow for bulk insertion.
        const groups = req.body;
        await Group.insertMany(groups);
        res.status(200).json({ message: 'Groups saved successfully' });
      } catch (error) {
        console.error('Error saving groups:', error);
        res.status(500).json({ error: 'Failed to save groups' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
