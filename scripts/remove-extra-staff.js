const fs = require('fs');
const path = require('path');

// People to remove
const toRemove = new Set([
  'Hemant Jain',
  'Tyaga Pati',
  'Susan Matthews',
  'Nishi Narendra Jain',
  'Dnyanesh Prakash Painjane',
  'Girlee P. Alvarado',
  'Vidyashree',
  'Prasanna',
  'Grace Nazareno'
]);

// Read staffing data
const staffingData = require(path.join(__dirname, '../lib/fpl-staffing-data.json'));

// Filter out people to remove
const filtered = staffingData.filter(m => !toRemove.has(m.Name));

console.log(`Original count: ${staffingData.length}`);
console.log(`Removed: ${staffingData.length - filtered.length}`);
console.log(`New count: ${filtered.length}`);

// Write back
fs.writeFileSync(path.join(__dirname, '../lib/fpl-staffing-data.json'), JSON.stringify(filtered, null, 2));

console.log('✓ Staffing data cleaned');
