// Standalone migration script to convert tags to a list of strings (tag names)
require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

const tagSchema = new mongoose.Schema({ tagName: String, color: String });
const subjectSchema = new mongoose.Schema({ tags: [mongoose.Schema.Types.Mixed] }, { strict: false });
const courseSchema = new mongoose.Schema({ tags: [mongoose.Schema.Types.Mixed] }, { strict: false });

const Tag = mongoose.model('Tag', tagSchema, 'tags');
const Subject = mongoose.model('Subject', subjectSchema, 'subjects');
const Course = mongoose.model('Course', courseSchema, 'courses');

async function migrateTagsToStrings() {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const tags = await Tag.find().lean();
    const tagMap = new Map(tags.map(tag => [tag._id.toString(), tag.tagName]));

    // Subjects
    const subjects = await Subject.find().lean();
    for (const subject of subjects) {
        if (Array.isArray(subject.tags) && subject.tags.length) {
            let newTags;
            if (typeof subject.tags[0] === 'object' && subject.tags[0].name) {
                // Already embedded objects, convert to string names
                newTags = subject.tags.map(tagObj => tagObj.name);
            } else if (typeof subject.tags[0] === 'string' || typeof subject.tags[0] === 'object' && subject.tags[0] instanceof mongoose.Types.ObjectId) {
                // Old format, convert ObjectIds to tag names
                newTags = subject.tags.map(tagId => tagMap.get(tagId.toString())).filter(Boolean);
            }
            if (newTags) {
                await Subject.updateOne({ _id: subject._id }, { $set: { tags: newTags } });
                console.log(`Converted tags to strings for subject ${subject._id}`);
            }
        }
    }

    // Courses
    const courses = await Course.find().lean();
    for (const course of courses) {
        if (Array.isArray(course.tags) && course.tags.length) {
            let newTags;
            if (typeof course.tags[0] === 'object' && course.tags[0].name) {
                newTags = course.tags.map(tagObj => tagObj.name);
            } else if (typeof course.tags[0] === 'string' || typeof course.tags[0] === 'object' && course.tags[0] instanceof mongoose.Types.ObjectId) {
                newTags = course.tags.map(tagId => tagMap.get(tagId.toString())).filter(Boolean);
            }
            if (newTags) {
                await Course.updateOne({ _id: course._id }, { $set: { tags: newTags } });
                console.log(`Converted tags to strings for course ${course._id}`);
            }
        }
    }

    await mongoose.disconnect();
    console.log('Tag conversion to strings complete.');
}

migrateTagsToStrings().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
