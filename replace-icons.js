#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Map of Phosphor icons to Heroicons
const iconMapping = {
  // Navigation & UI
  'ArrowLeft': 'ArrowLeftIcon',
  'ArrowRight': 'ArrowRightIcon', 
  'ArrowUp': 'ArrowUpIcon',
  'ArrowDown': 'ArrowDownIcon',
  'CaretLeft': 'ChevronLeftIcon',
  'CaretRight': 'ChevronRightIcon',
  'CaretUp': 'ChevronUpIcon',
  'CaretDown': 'ChevronDownIcon',
  'X': 'XMarkIcon',
  'Plus': 'PlusIcon',
  'Minus': 'MinusIcon',
  'Check': 'CheckIcon',
  'CheckCircle': 'CheckCircleIcon',
  
  // User & Profile
  'User': 'UserIcon',
  'Users': 'UsersIcon',
  'UserCircle': 'UserCircleIcon',
  'UserPlus': 'UserPlusIcon',
  
  // Communication
  'ChatCircle': 'ChatBubbleLeftIcon',
  'ChatsCircle': 'ChatBubbleLeftEllipsisIcon',
  'MessageCircle': 'ChatBubbleOvalLeftIcon',
  'PaperPlaneTilt': 'PaperAirplaneIcon',
  'Bell': 'BellIcon',
  'BellRinging': 'BellAlertIcon',
  
  // Actions & Gestures
  'Heart': 'HeartIcon',
  'Share': 'ShareIcon', 
  'Bookmark': 'BookmarkIcon',
  'DotsThree': 'EllipsisHorizontalIcon',
  'MoreHorizontal': 'EllipsisHorizontalIcon',
  'DotsThreeVertical': 'EllipsisVerticalIcon',
  
  // Media & Content
  'Play': 'PlayIcon',
  'Pause': 'PauseIcon',
  'Camera': 'CameraIcon',
  'Image': 'PhotoIcon',
  'ImageIcon': 'PhotoIcon',
  'Video': 'VideoCameraIcon',
  'MusicNote': 'MusicalNoteIcon',
  
  // Location & Time
  'MapPin': 'MapPinIcon',
  'Clock': 'ClockIcon',
  'Timer': 'ClockIcon',
  'Calendar': 'CalendarIcon',
  'CalendarBlank': 'CalendarIcon',
  'CalendarDays': 'CalendarDaysIcon',
  
  // Shopping & Commerce
  'ShoppingCart': 'ShoppingCartIcon',
  'Coins': 'CurrencyDollarIcon',
  'CreditCard': 'CreditCardIcon',
  'Receipt': 'ReceiptPercentIcon',
  
  // Rating & Reviews
  'Star': 'StarIcon',
  'ThumbsUp': 'HandThumbUpIcon',
  'ThumbsDown': 'HandThumbDownIcon',
  'Fire': 'FireIcon',
  'TrendingUp': 'TrendingUpIcon',
  'TrendUp': 'TrendingUpIcon',
  
  // Settings & Tools
  'Gear': 'CogIcon',
  'Settings': 'Cog6ToothIcon',
  'Sliders': 'AdjustmentsHorizontalIcon',
  'MagnifyingGlass': 'MagnifyingGlassIcon',
  'Funnel': 'FunnelIcon',
  'SortAscending': 'BarsArrowUpIcon',
  'SortDescending': 'BarsArrowDownIcon',
  
  // Food & Restaurant specific
  'GameController': 'PuzzlePieceIcon', // For Lik/gaming aspects
  'Trophy': 'TrophyIcon',
  'Award': 'StarIcon', // Could also be TrophyIcon
  'Target': 'TargetIcon', // Not available in Heroicons, might use BullseyeIcon
  'Sparkles': 'SparklesIcon',
  
  // Visibility
  'Eye': 'EyeIcon',
  'EyeOff': 'EyeSlashIcon',
  'EyeSlash': 'EyeSlashIcon',
  
  // File & Document
  'Download': 'ArrowDownTrayIcon',
  'Upload': 'ArrowUpTrayIcon',
  'File': 'DocumentIcon',
  'Folder': 'FolderIcon',
  
  // Security & Privacy
  'Lock': 'LockClosedIcon',
  'LockOpen': 'LockOpenIcon',
  'Shield': 'ShieldCheckIcon',
  
  // Navigation specific
  'House': 'HomeIcon',
  'Home': 'HomeIcon',
  'Compass': 'CompassIcon',
  
  // Social & Interaction
  'ArrowBendUpLeft': 'ArrowUturnLeftIcon', // For reply
  'Repeat': 'ArrowPathIcon',
  'Flag': 'FlagIcon',
  'Report': 'ExclamationTriangleIcon',
  
  // Utility
  'Info': 'InformationCircleIcon',
  'Warning': 'ExclamationTriangleIcon',
  'Question': 'QuestionMarkCircleIcon',
  'Lightbulb': 'LightBulbIcon'
};

// Get import mapping for outline vs solid
function getImportPath(iconName, isFilled = false) {
  const basePath = isFilled ? '@heroicons/react/24/solid' : '@heroicons/react/24/outline';
  return basePath;
}

// Convert size prop to className
function convertSizeToClassName(size) {
  const sizeMap = {
    '12': 'w-3 h-3',
    '14': 'w-3.5 h-3.5', 
    '16': 'w-4 h-4',
    '18': 'w-4.5 h-4.5',
    '20': 'w-5 h-5',
    '24': 'w-6 h-6',
    '28': 'w-7 h-7',
    '32': 'w-8 h-8'
  };
  return sizeMap[size] || `w-6 h-6`;
}

// Convert weight to className
function convertWeightToClassName(weight, iconName) {
  if (weight === 'fill' || weight === 'filled') {
    return 'fill-current';
  }
  return 'stroke-current fill-none';
}

console.log('Icon mapping created successfully!');
console.log('Available mappings:', Object.keys(iconMapping).length);