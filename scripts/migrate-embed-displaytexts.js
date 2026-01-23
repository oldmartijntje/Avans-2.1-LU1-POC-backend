// migrate-embed-displaytexts.js
// Migration script to embed DisplayText objects into Course and Subject collections
// Usage: node migrate-embed-displaytexts.js
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGO_URI;

// Define minimal schemas for migration
const displayTextSchema = new mongoose.Schema({}, { strict: false, collection: 'displaytexts' });
const courseSchema = new mongoose.Schema({}, { strict: false, collection: 'courses' });
const subjectSchema = new mongoose.Schema({}, { strict: false, collection: 'subjects' });

const DisplayText = mongoose.model('DisplayText', displayTextSchema);
const Course = mongoose.model('Course', courseSchema);
const Subject = mongoose.model('Subject', subjectSchema);

// List of fields to migrate
const TRANSLATION_FIELDS = ['title', 'description', 'moreInfo'];

async function embedDisplayTexts(doc, docType) {
    let updated = false;
    for (const field of TRANSLATION_FIELDS) {
        if (doc[field] && mongoose.Types.ObjectId.isValid(doc[field])) {
            const displayText = await DisplayText.findById(doc[field]).lean();
            if (displayText) {
                // Remove _id and __v
                const { _id, __v, ...embedded } = displayText;
                doc[field] = embedded;
                updated = true;
            }
        }
    }
    return updated;
}

async function migrateCollection(Model, name) {
    const docs = await Model.find({}).lean();
    let count = 0;
    for (const doc of docs) {
        const updated = await embedDisplayTexts(doc, name);
        if (updated) {
            await Model.updateOne({ _id: doc._id }, doc);
            count++;
        }
    }
    console.log(`Migrated ${count} ${name} documents.`);
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
