// Standalone migration script to embed tags in subjects and courses
require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;


const subjectSchema = new mongoose.Schema({ tags: [String] }, { strict: false });
const courseSchema = new mongoose.Schema({ tags: [String] }, { strict: false });

const Subject = mongoose.model('Subject', subjectSchema, 'subjects');
const Course = mongoose.model('Course', courseSchema, 'courses');

async function migrateTags() {

    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    // No tag collection logic remains. If you need to migrate tags, implement logic here for string arrays only.

    await mongoose.disconnect();
    console.log('Migration complete.');
}

migrateTags().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
