// Simple verification script to check if assets exist
import { readFileSync, existsSync } from 'fs';
const assetsPath = './src/asset

  'comment_icon.svg',
  'heart_icon.svg',
];
console.log('Verifying 
  'comment_icon.svg',
  'share_icon1.svg',
  'heart_icon.svg',
  'lik.png'
];

console.log('Verifying asset files...');

requiredAssets.forEach(asset => {
  const fullPath = resolve(assetsPath + asset);
  if (existsSync(fullPath)) {
    console.log(`✅ ${asset} exists`);

    console.log(`❌ ${asset} NOT found`);

});

console.log('Asset verification complete.');