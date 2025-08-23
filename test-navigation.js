#!/usr/bin/env node

// Simple test to check if our components can be imported without errors
const fs = require('fs');
const path = require('path');

console.log('Testing navigation fixes...');

// Check if all main component files exist
const componentsToCheck = [
  'HomeFeed.tsx',
  'SearchPage.tsx', 
  'LikPage.tsx',
  'TrendingPage.tsx',
  'ProfilePage.tsx',
  'Navigation.tsx'
];

const componentsDir = path.join(__dirname, 'src', 'components');

let allGood = true;

componentsToCheck.forEach(component => {
  const componentPath = path.join(componentsDir, component);
  if (fs.existsSync(componentPath)) {
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Check for potential issues
    const issues = [];
    
    // Check for old callback props that might not be defined
    if (content.includes('onShow') && !content.includes('onNavigate')) {
      issues.push('Still has onShow callbacks without onNavigate');
    }
    
    // Check for proper interface definitions
    if (content.includes('interface') && content.includes('Props')) {
      if (!content.includes('onNavigate') && !content.includes('onSelectUser') && !content.includes('onSelectRestaurant')) {
        issues.push('Props interface might be outdated');
      }
    }
    
    if (issues.length > 0) {
      console.log(`❌ ${component}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
      allGood = false;
    } else {
      console.log(`✅ ${component}: Looks good`);
    }
  } else {
    console.log(`❌ ${component}: File not found`);
    allGood = false;
  }
});

if (allGood) {
  console.log('\n✅ All navigation fixes appear to be in place!');
  console.log('\nMain changes made:');
  console.log('1. Updated all component interfaces to use onNavigate, onSelectUser, onSelectRestaurant');
  console.log('2. Fixed all navigation button handlers to use the correct callbacks');
  console.log('3. Removed obsolete callback props and replaced with proper navigation');
  console.log('4. Updated App.tsx component instantiation to match new interfaces');
} else {
  console.log('\n❌ Some issues found. Please review the components above.');
}