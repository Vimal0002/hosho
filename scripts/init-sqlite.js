// Initialize SQLite Database
const { createTables, initializeFromJSON } = require('../lib/db-sqlite');

function init() {
    console.log('🔄 Initializing SQLite database...\n');

    // Create tables
    console.log('Step 1: Creating database tables...');
    const tablesCreated = createTables();

    if (!tablesCreated) {
        console.error('\n❌ Failed to create database tables!');
        process.exit(1);
    }

    console.log('');

    // Initialize with data from JSON
    console.log('Step 2: Migrating data from database.json...');
    const dataInitialized = initializeFromJSON();

    if (!dataInitialized) {
        console.error('\n❌ Failed to initialize database data!');
        process.exit(1);
    }

    console.log('\n✅ SQLite database is ready!');
    console.log('📦 Database file: electrominds.db');
    console.log('🚀 You can now start your application with: npm run dev\n');

    process.exit(0);
}

init();
