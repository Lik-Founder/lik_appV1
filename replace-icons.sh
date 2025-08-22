#!/bin/bash

# Replace all remaining phosphor-icons with heroicons in TypeScript/TSX files

# Get all files that still have phosphor-icons imports
files=$(grep -l "from '@phosphor-icons/react'" src/components/*.tsx)

echo "Found files still using phosphor-icons:"
echo "$files"
echo ""

# Simple replacements we can do automatically
for file in $files; do
    echo "Processing $file..."
    
    # Replace common single icon imports
    sed -i "s/import { X } from '@phosphor-icons\/react';/import { XMarkIcon } from '@heroicons\/react\/24\/outline';/g" "$file"
    sed -i "s/import { ArrowLeft } from '@phosphor-icons\/react';/import { ArrowLeftIcon } from '@heroicons\/react\/24\/outline';/g" "$file"
    sed -i "s/import { Camera } from '@phosphor-icons\/react';/import { CameraIcon } from '@heroicons\/react\/24\/outline';/g" "$file"
    sed -i "s/import { Image as ImageIcon } from '@phosphor-icons\/react';/import { PhotoIcon as ImageIcon } from '@heroicons\/react\/24\/outline';/g" "$file"
    sed -i "s/import { Play } from '@phosphor-icons\/react';/import { PlayIcon } from '@heroicons\/react\/24\/outline';/g" "$file"
    sed -i "s/import { Heart } from '@phosphor-icons\/react';/import { HeartIcon } from '@heroicons\/react\/24\/outline';/g" "$file"
    sed -i "s/import { Star } from '@phosphor-icons\/react';/import { StarIcon } from '@heroicons\/react\/24\/outline';/g" "$file"
    
    # Replace common icon usages - simple size replacements
    sed -i "s/<X size={20}/><XMarkIcon className=\"w-5 h-5\"/g" "$file"
    sed -i "s/<X size={16}/><XMarkIcon className=\"w-4 h-4\"/g" "$file"
    sed -i "s/<X size={24}/><XMarkIcon className=\"w-6 h-6\"/g" "$file"
    sed -i "s/ \/>/ \/>/g" "$file"
    
done

echo "Basic replacements completed. Manual review still needed for complex imports."