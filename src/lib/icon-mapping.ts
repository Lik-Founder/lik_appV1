// Mapping from Phosphor Icons to Heroicons
export const ICON_MAPPING = {
  // Basic navigation and UI
  'ArrowLeft': 'ArrowLeftIcon',
  'ArrowRight': 'ArrowRightIcon', 
  'ArrowUp': 'ArrowUpIcon',
  'ArrowDown': 'ArrowDownIcon',
  'X': 'XMarkIcon',
  'Plus': 'PlusIcon',
  'Check': 'CheckIcon',
  'ChevronLeft': 'ChevronLeftIcon',
  'ChevronRight': 'ChevronRightIcon',
  'ChevronUp': 'ChevronUpIcon',
  'ChevronDown': 'ChevronDownIcon',
  'CaretLeft': 'ChevronLeftIcon',
  'CaretRight': 'ChevronRightIcon',
  'CaretDown': 'ChevronDownIcon',
  'CaretUp': 'ChevronUpIcon',
  
  // Actions and interactions
  'Heart': 'HeartIcon',
  'Star': 'StarIcon',
  'Share': 'ShareIcon',
  'Bookmark': 'BookmarkIcon',
  'Eye': 'EyeIcon',
  'EyeOff': 'EyeSlashIcon',
  'Play': 'PlayIcon',
  'Pause': 'PauseIcon',
  'Camera': 'CameraIcon',
  'Image': 'PhotoIcon',
  'Video': 'VideoCameraIcon',
  
  // Communication
  'MessageCircle': 'ChatBubbleLeftIcon',
  'MessageSquare': 'ChatBubbleLeftSquareIcon',
  'ChatsCircle': 'ChatBubbleLeftEllipsisIcon',
  'Mail': 'EnvelopeIcon',
  'Phone': 'PhoneIcon',
  'Users': 'UsersIcon',
  'User': 'UserIcon',
  'Crown': 'StarIcon', // Using star as closest alternative
  
  // Search and filter
  'MagnifyingGlass': 'MagnifyingGlassIcon',
  'Search': 'MagnifyingGlassIcon',
  'Funnel': 'FunnelIcon',
  'SlidersHorizontal': 'AdjustmentsHorizontalIcon',
  'Filter': 'FunnelIcon',
  
  // Location and time
  'MapPin': 'MapPinIcon',
  'Map': 'MapIcon',
  'Calendar': 'CalendarIcon',
  'Clock': 'ClockIcon',
  'Timer': 'ClockIcon',
  
  // Gaming and rewards
  'Trophy': 'TrophyIcon',
  'Award': 'TrophyIcon',
  'Coins': 'CurrencyDollarIcon',
  'Target': 'TargetIcon', // We'll use ArcherTargetIcon equivalent
  'Flame': 'FireIcon',
  'Lightning': 'BoltIcon',
  
  // Content and media
  'Bell': 'BellIcon',
  'Gear': 'CogIcon',
  'Settings': 'CogIcon',
  'DotsThree': 'EllipsisHorizontalIcon',
  'MoreHorizontal': 'EllipsisHorizontalIcon',
  'Lock': 'LockClosedIcon',
  'Globe': 'GlobeAltIcon',
  
  // Food and dining
  'UtensilsCrossed': 'BuildingStorefrontIcon', // Closest alternative
  'Sparkles': 'SparklesIcon',
  
  // Volume and audio
  'VolumeMute': 'SpeakerXMarkIcon',
  'VolumeHigh': 'SpeakerWaveIcon',
  
  // Trend and progress
  'TrendingUp': 'ArrowTrendingUpIcon',
  'TrendUp': 'ArrowTrendingUpIcon',
  'BarChart3': 'ChartBarIcon',
  'CircleNotch': 'ArrowPathIcon', // Loading spinner equivalent
  
  // Social actions
  'ArrowBendUpLeft': 'ArrowUturnLeftIcon', // Reply icon
  'Smiley': 'FaceSmileIcon',
  'QrCode': 'QrCodeIcon',
  'Mic': 'MicrophoneIcon',
  'RotateCcw': 'ArrowPathIcon',
  
  // Special cases
  'Sparkles': 'SparklesIcon',
  'Flag': 'FlagIcon',
  'CheckCircle': 'CheckCircleIcon',
  'AlertCircle': 'ExclamationCircleIcon'
};

// Size conversion from Phosphor (number) to Heroicons (className)
export const convertSize = (size: number): string => {
  if (size <= 16) return 'w-4 h-4';
  if (size <= 20) return 'w-5 h-5';
  if (size <= 24) return 'w-6 h-6';
  if (size <= 32) return 'w-8 h-8';
  return 'w-10 h-10';
};