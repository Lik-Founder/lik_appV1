#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Icon size mapping
const sizeMap = {
  '12': 'w-3 h-3',
  '14': 'w-3.5 h-3.5', 
  '16': 'w-4 h-4',
  '18': 'w-4.5 h-4.5',
  '20': 'w-5 h-5',
  '24': 'w-6 h-6',
  '28': 'w-7 h-7',
  '32': 'w-8 h-8',
  '40': 'w-10 h-10',
  '48': 'w-12 h-12',
  '64': 'w-16 h-16',
  '80': 'w-20 h-20'
};

function updateIconUsage(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;
  
  // Pattern 1: size={number}
  updatedContent = updatedContent.replace(/(\w+)\s+size=\{(\d+)\}/g, (match, iconName, size) => {
    const className = sizeMap[size] || `w-${Math.round(size/4)} h-${Math.round(size/4)}`;
    return `${iconName} className="${className}"`;
  });

  // Pattern 2: size={number} className="existing-classes"
  updatedContent = updatedContent.replace(/(\w+)\s+size=\{(\d+)\}\s+className="([^"]+)"/g, (match, iconName, size, existingClasses) => {
    const className = sizeMap[size] || `w-${Math.round(size/4)} h-${Math.round(size/4)}`;
    return `${iconName} className="${className} ${existingClasses}"`;
  });

  // Pattern 3: className="existing-classes" size={number}
  updatedContent = updatedContent.replace(/(\w+)\s+className="([^"]+)"\s+size=\{(\d+)\}/g, (match, iconName, existingClasses, size) => {
    const className = sizeMap[size] || `w-${Math.round(size/4)} h-${Math.round(size/4)}`;
    return `${iconName} className="${className} ${existingClasses}"`;
  });

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated: ${filePath}`);
  }
}

// Find all TSX files
const files = glob.sync('/workspaces/spark-template/src/**/*.tsx', { absolute: true });

files.forEach(file => {
  try {
    updateIconUsage(file);
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log('Icon update complete!');