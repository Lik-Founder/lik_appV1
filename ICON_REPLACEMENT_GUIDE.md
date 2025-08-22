# Icon Replacement Guide for TypeScript/React
# This file contains the mapping from Phosphor Icons to Heroicons

## Import Statement Replacements
# Replace: import { IconName } from '@phosphor-icons/react';
# With: import { IconNameIcon } from '@heroicons/react/24/outline';

## Common Icon Mappings:
- ArrowLeft → ArrowLeftIcon
- ArrowRight → ArrowRightIcon  
- CaretLeft → ChevronLeftIcon
- CaretRight → ChevronRightIcon
- X → XMarkIcon
- Plus → PlusIcon
- User → UserIcon
- Users → UsersIcon
- ChatCircle → ChatBubbleLeftIcon
- Heart → HeartIcon
- Star → StarIcon
- MapPin → MapPinIcon
- Clock → ClockIcon
- Play → PlayIcon
- Camera → CameraIcon
- Image → PhotoIcon
- MagnifyingGlass → MagnifyingGlassIcon
- GameController → PuzzlePieceIcon
- TrendUp → TrendingUpIcon
- Trophy → TrophyIcon
- Fire → FireIcon
- Eye → EyeIcon
- EyeOff → EyeSlashIcon
- Calendar → CalendarIcon
- Timer → ClockIcon
- Television → TvIcon
- ShoppingCart → ShoppingCartIcon
- CheckCircle → CheckCircleIcon
- DotsThree → EllipsisHorizontalIcon
- Bell → BellIcon
- Bookmark → BookmarkIcon
- Share → ShareIcon
- MessageCircle → ChatBubbleOvalLeftIcon
- PaperPlaneTilt → PaperAirplaneIcon
- Gear → Cog6ToothIcon
- Settings → Cog6ToothIcon

## Prop Replacements:
# Replace size={number} with className="w-X h-X"
- size={10} → className="w-2.5 h-2.5"
- size={12} → className="w-3 h-3"  
- size={14} → className="w-3.5 h-3.5"
- size={16} → className="w-4 h-4"
- size={18} → className="w-4.5 h-4.5"
- size={20} → className="w-5 h-5"
- size={24} → className="w-6 h-6"
- size={28} → className="w-7 h-7"
- size={32} → className="w-8 h-8"

# Replace weight with className
- weight="fill" → className="fill-current"
- weight="regular" → className="stroke-current fill-none"

## Usage Pattern Changes:
Before: <ArrowLeft size={20} weight="regular" />
After: <ArrowLeftIcon className="w-5 h-5 stroke-current fill-none" />