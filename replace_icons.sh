#!/bin/bash

# Comprehensive icon replacement script
# This script will replace all Phosphor icons with Heroicons across the codebase

# First create a mapping file for systematic replacements
cat > /tmp/icon_replacements.txt << 'EOF'
# Basic replacements - import statements
s/import.*@phosphor-icons\/react.*/\/\/ REPLACED WITH HEROICONS/g

# Size replacements
s/size={([0-9]+)}/className="w-$1 h-$1"/g
s/size={10}/className="w-2.5 h-2.5"/g
s/size={12}/className="w-3 h-3"/g
s/size={14}/className="w-3.5 h-3.5"/g
s/size={16}/className="w-4 h-4"/g
s/size={18}/className="w-4.5 h-4.5"/g
s/size={20}/className="w-5 h-5"/g
s/size={24}/className="w-6 h-6"/g
s/size={28}/className="w-7 h-7"/g
s/size={32}/className="w-8 h-8"/g

# Weight replacements
s/weight="fill"/className="fill-current"/g
s/weight="regular"/className="stroke-current fill-none"/g
s/weight="bold"/className="stroke-2"/g

# Icon name replacements
s/<ArrowLeft/<ArrowLeftIcon/g
s/<ArrowRight/<ArrowRightIcon/g
s/<CaretLeft/<ChevronLeftIcon/g
s/<CaretRight/<ChevronRightIcon/g
s/<X /<XMarkIcon /g
s/<Plus/<PlusIcon/g
s/<User /<UserIcon /g
s/<Users/<UsersIcon/g
s/<ChatCircle/<ChatBubbleLeftIcon/g
s/<Heart /<HeartIcon /g
s/<Star /<StarIcon /g
s/<MapPin/<MapPinIcon/g
s/<Clock/<ClockIcon/g
s/<Play /<PlayIcon /g
s/<Camera/<CameraIcon/g
s/<Image /<PhotoIcon /g
s/<MagnifyingGlass/<MagnifyingGlassIcon/g
s/<GameController/<PuzzlePieceIcon/g
s/<TrendUp/<TrendingUpIcon/g
s/<Trophy/<TrophyIcon/g
s/<Fire/<FireIcon/g
s/<Eye /<EyeIcon /g
s/<EyeOff/<EyeSlashIcon/g
s/<CalendarBlank/<CalendarIcon/g
s/<Timer/<ClockIcon/g
s/<Television/<TvIcon/g
s/<ShoppingCart/<ShoppingCartIcon/g
s/<CheckCircle/<CheckCircleIcon/g
s/<DotsThree/<EllipsisHorizontalIcon/g
s/<Bell/<BellIcon/g
s/<Bookmark/<BookmarkIcon/g
s/<Share/<ShareIcon/g
s/<ArrowBendUpLeft/<ArrowUturnLeftIcon/g
s/<PaperPlaneTilt/<PaperAirplaneIcon/g
s/<ChatsCircle/<ChatBubbleLeftEllipsisIcon/g
s/<MessageCircle/<ChatBubbleOvalLeftIcon/g
s/<Gear/<CogIcon/g
s/<Sliders/<AdjustmentsHorizontalIcon/g
s/<Funnel/<FunnelIcon/g
s/<Download/<ArrowDownTrayIcon/g
s/<Upload/<ArrowUpTrayIcon/g
s/<Lock/<LockClosedIcon/g
s/<Medal/<StarIcon/g
s/<Target/<StarIcon/g
s/<Sparkles/<SparklesIcon/g
s/<Award/<TrophyIcon/g
s/<Coins/<CurrencyDollarIcon/g
s/<ThumbsUp/<HandThumbUpIcon/g
s/<SortAscending/<BarsArrowUpIcon/g
s/<Info/<InformationCircleIcon/g
s/<Warning/<ExclamationTriangleIcon/g
s/<House/<HomeIcon/g
s/<Home/<HomeIcon/g
s/<Compass/<CompassIcon/g

EOF

echo "Icon replacement mapping created"