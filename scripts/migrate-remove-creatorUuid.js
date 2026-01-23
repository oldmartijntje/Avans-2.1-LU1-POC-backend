// migrate-remove-creatorUuid.js
// Migration script to remove creatorUuid from embedded translation objects in Course and Subject collections
// Usage: node migrate-remove-creatorUuid.js

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGO_URI;

const courseSchema = new mongoose.Schema({}, { strict: false, collection: 'courses' });
const subjectSchema = new mongoose.Schema({}, { strict: false, collection: 'subjects' });

const Course = mongoose.model('Course', courseSchema);
const Subject = mongoose.model('Subject', subjectSchema);

const TRANSLATION_FIELDS = ['title', 'description', 'moreInfo'];

async function removeCreatorUuid(doc) {
    let updated = false;
    for (const field of TRANSLATION_FIELDS) {
        if (doc[field] && typeof doc[field] === 'object' && doc[field].creatorUuid) {
            delete doc[field].creatorUuid;
            updated = true;
        }
    }
    return updated;
}

async function migrateCollection(Model, name) {
    const docs = await Model.find({}).lean();
    let count = 0;
    for (const doc of docs) {
        const updated = await removeCreatorUuid(doc);
        if (updated) {
            await Model.updateOne({ _id: doc._id }, doc);
            count++;
        }
    }
    console.log(`Removed creatorUuid from ${count} ${name} documents.`);
}

async function main() {
    await mongoose.connect(MONGODB_URI);
    await migrateCollection(Course, 'course');
    await migrateCollection(Subject, 'subject');
    await mongoose.disconnect();
    console.log('Migration complete.');
}

main().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
