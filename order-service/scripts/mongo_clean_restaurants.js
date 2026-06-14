#!/usr/bin/env node
// Usage:
//  node scripts/mongo_clean_restaurants.js --uri="mongodb://admin:password@localhost:27018/restaurante?authSource=admin" --list
//  node scripts/mongo_clean_restaurants.js --uri="..." --deleteAll
//  node scripts/mongo_clean_restaurants.js --uri="..." --ids="id1,id2"
//  node scripts/mongo_clean_restaurants.js --uri="..." --names="Name A,Name B"

import mongoose from 'mongoose';
const argv = {};
process.argv.slice(2).forEach(arg => {
  if (arg.startsWith('--')) {
    const [k, v] = arg.slice(2).split('=');
    argv[k] = v === undefined ? true : v;
  }
});

const URI = argv.uri || process.env.URI_MONGODB;
if (!URI) {
  console.error('Provide --uri or set URI_MONGODB in environment');
  process.exit(1);
}

const restaurantSchema = new mongoose.Schema({}, { strict: false, collection: 'restaurants' });
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

async function main() {
  await mongoose.connect(URI, { serverSelectionTimeoutMS: 5000 });
  if (argv.list) {
    const docs = await Restaurant.find().lean();
    console.log(`Found ${docs.length} restaurants:`);
    docs.forEach(d => console.log(d._id.toString(), '-', d.name || JSON.stringify(d)));
    await mongoose.disconnect();
    return;
  }

  if (argv.deleteAll) {
    const res = await Restaurant.deleteMany({});
    console.log(`Deleted ${res.deletedCount} restaurants.`);
    await mongoose.disconnect();
    return;
  }

  if (argv.ids) {
    const ids = argv.ids.split(',').map(s => s.trim());
    const res = await Restaurant.deleteMany({ _id: { $in: ids } });
    console.log(`Deleted ${res.deletedCount} restaurants by ids.`);
    await mongoose.disconnect();
    return;
  }

  if (argv.names) {
    const names = argv.names.split(',').map(s => s.trim());
    const res = await Restaurant.deleteMany({ name: { $in: names } });
    console.log(`Deleted ${res.deletedCount} restaurants by names.`);
    await mongoose.disconnect();
    return;
  }

  console.log('No action specified. Use --list, --deleteAll, --ids or --names.');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
