import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Group from '../models/Group.js';
import groupsData from '../groupsData.json' assert { type: 'json' };

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('Connected to MongoDB');

    // Remove existing groups
    await Group.deleteMany({});
    console.log('Existing groups removed');

    // Insert seed data
    await Group.insertMany(groupsData);
    console.log('Seed data inserted successfully');

    process.exit();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  });
