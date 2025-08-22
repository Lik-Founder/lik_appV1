#!/bin/bash

# Comprehensive icon replacement script
# Replace all phosphor icons with heroicons across the app

echo "Starting icon replacement process..."

# Define the files to process
FILES=(
  "/workspaces/spark-template/src/components/AwardsPage.tsx"
  "/workspaces/spark-template/src/components/AvailabilityWidget.tsx"
  "/workspaces/spark-template/src/components/ReservationSystem.tsx"
  "/workspaces/spark-template/src/components/GroupChatIntroModal.tsx"
  "/workspaces/spark-template/src/components/EventsPage.tsx"
  "/workspaces/spark-template/src/components/AuthPage.tsx"
  "/workspaces/spark-template/src/components/AddMembersModal.tsx"
  "/workspaces/spark-template/src/components/RewardsPage.tsx"
  "/workspaces/spark-template/src/components/NotificationsPage.tsx"
  "/workspaces/spark-template/src/components/Cart.tsx"
  "/workspaces/spark-template/src/components/CreatePostModal.tsx"
  "/workspaces/spark-template/src/components/LikPassportPage.tsx"
  "/workspaces/spark-template/src/components/ReservationManager.tsx"
  "/workspaces/spark-template/src/components/FavoritesPage.tsx"
  "/workspaces/spark-template/src/components/CreatePost.tsx"
  "/workspaces/spark-template/src/components/SwipeHint.tsx"
  "/workspaces/spark-template/src/components/StoryViewer.tsx"
  "/workspaces/spark-template/src/components/Checkout.tsx"
  "/workspaces/spark-template/src/components/BountyDetailsPage.tsx"
  "/workspaces/spark-template/src/components/MessagesPage.tsx"
  "/workspaces/spark-template/src/components/FoodEventPage.tsx"
  "/workspaces/spark-template/src/components/GroupManagementModal.tsx"
  "/workspaces/spark-template/src/components/MapView.tsx"
  "/workspaces/spark-template/src/components/OrderHistory.tsx"
  "/workspaces/spark-template/src/components/BountyCardModal.tsx"
  "/workspaces/spark-template/src/components/GroupActivityFeed.tsx"
  "/workspaces/spark-template/src/components/CreateGroupChatModal.tsx"
  "/workspaces/spark-template/src/components/CreatePostPage.tsx"
  "/workspaces/spark-template/src/components/UserProfile.tsx"
  "/workspaces/spark-template/src/components/TrendingSearchPage.tsx"
  "/workspaces/spark-template/src/components/QuestCardModal.tsx"
  "/workspaces/spark-template/src/components/SwipeDiscoveryPage.tsx"
)

# Step 1: Replace import statements
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing imports in $file..."
    
    # Replace the import line
    sed -i "s|from '@phosphor-icons/react'|from '@heroicons/react/24/outline'|g" "$file"
    sed -i 's|from "@phosphor-icons/react"|from "@heroicons/react/24/outline"|g' "$file"
  fi
done

echo "Import statements updated. Now updating icon names..."

# Step 2: Replace icon names in imports and usage
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing icon names in $file..."
    
    # Common icon name replacements
    sed -i 's/ArrowLeft,/ArrowLeftIcon,/g' "$file"
    sed -i 's/ArrowRight,/ArrowRightIcon,/g' "$file"
    sed -i 's/ArrowUp,/ArrowUpIcon,/g' "$file"
    sed -i 's/ArrowDown,/ArrowDownIcon,/g' "$file"
    sed -i 's/\bX,/XMarkIcon,/g' "$file"
    sed -i 's/Plus,/PlusIcon,/g' "$file"
    sed -i 's/Heart,/HeartIcon,/g' "$file"
    sed -i 's/Star,/StarIcon,/g' "$file"
    sed -i 's/Fire,/FireIcon,/g' "$file"
    sed -i 's/Users,/UsersIcon,/g' "$file"
    sed -i 's/User,/UserIcon,/g' "$file"
    sed -i 's/Trophy,/TrophyIcon,/g' "$file"
    sed -i 's/MapPin,/MapPinIcon,/g' "$file"
    sed -i 's/MagnifyingGlass,/MagnifyingGlassIcon,/g' "$file"
    sed -i 's/Camera,/CameraIcon,/g' "$file"
    sed -i 's/Gift,/GiftIcon,/g' "$file"
    sed -i 's/Check,/CheckIcon,/g' "$file"
    sed -i 's/CheckCheck,/CheckBadgeIcon,/g' "$file"
    sed -i 's/DotsThreeVertical,/EllipsisVerticalIcon,/g' "$file"
    sed -i 's/DotsThree,/EllipsisHorizontalIcon,/g' "$file"
    sed -i 's/CaretDown,/ChevronDownIcon,/g' "$file"
    sed -i 's/CaretUp,/ChevronUpIcon,/g' "$file"
    sed -i 's/CaretLeft,/ChevronLeftIcon,/g' "$file"
    sed -i 's/CaretRight,/ChevronRightIcon,/g' "$file"
    sed -i 's/Smiley,/FaceSmileIcon,/g' "$file"
    sed -i 's/ThumbsUp,/HandThumbUpIcon,/g' "$file"
    sed -i 's/PaperPlaneRight,/PaperAirplaneIcon,/g' "$file"
    sed -i 's/Clock,/ClockIcon,/g' "$file"
    sed -i 's/Calendar,/CalendarIcon,/g' "$file"
    sed -i 's/BookmarkSimple,/BookmarkIcon,/g' "$file"
    sed -i 's/Target,/BookmarkIcon,/g' "$file"
    sed -i 's/Buildings,/BuildingOfficeIcon,/g' "$file"
    sed -i 's/CurrencyCircleDollar,/CurrencyDollarIcon,/g' "$file"
    sed -i 's/Image,/PhotoIcon,/g' "$file"
    sed -i 's/Sparkle,/SparklesIcon,/g' "$file"
    sed -i 's/Bell,/BellIcon,/g' "$file"
    sed -i 's/Gear,/CogIcon,/g' "$file"
    sed -i 's/House,/HomeIcon,/g' "$file"
    sed -i 's/List,/ListBulletIcon,/g' "$file"
    sed -i 's/FunnelSimple,/FunnelIcon,/g' "$file"
    sed -i 's/ShareNetwork,/ShareIcon,/g' "$file"
    sed -i 's/Download,/ArrowDownTrayIcon,/g' "$file"
    sed -i 's/Upload,/ArrowUpTrayIcon,/g' "$file"
    sed -i 's/Play,/PlayIcon,/g' "$file"
    sed -i 's/Pause,/PauseIcon,/g' "$file"
    sed -i 's/Stop,/StopIcon,/g' "$file"
    sed -i 's/Eye,/EyeIcon,/g' "$file"
    sed -i 's/EyeSlash,/EyeSlashIcon,/g' "$file"
    sed -i 's/Phone,/PhoneIcon,/g' "$file"
    sed -i 's/Envelope,/EnvelopeIcon,/g' "$file"
    sed -i 's/ChatCircle,/ChatBubbleOvalLeftIcon,/g' "$file"
    sed -i 's/PencilSimple,/PencilIcon,/g' "$file"
    sed -i 's/Trash,/TrashIcon,/g' "$file"
    sed -i 's/Clipboard,/ClipboardIcon,/g' "$file"
    sed -i 's/Warning,/ExclamationTriangleIcon,/g' "$file"
    sed -i 's/Info,/InformationCircleIcon,/g' "$file"
    sed -i 's/Question,/QuestionMarkCircleIcon,/g' "$file"
    sed -i 's/Lock,/LockClosedIcon,/g' "$file"
    sed -i 's/LockOpen,/LockOpenIcon,/g' "$file"
    sed -i 's/SignOut,/ArrowRightOnRectangleIcon,/g' "$file"
    sed -i 's/SignIn,/ArrowLeftOnRectangleIcon,/g' "$file"
  fi
done

echo "Icon name replacements completed!"

# Manual instruction for size prop to className conversion
echo ""
echo "IMPORTANT: You now need to manually replace size props with className props:"
echo "Examples:"
echo "  <ArrowLeft size={24} /> → <ArrowLeftIcon className=\"w-6 h-6\" />"
echo "  <Star size={16} /> → <StarIcon className=\"w-4 h-4\" />"
echo "  <Heart size={12} /> → <HeartIcon className=\"w-3 h-3\" />"
echo ""
echo "Size conversion reference:"
echo "  size={8}  → w-2 h-2"
echo "  size={12} → w-3 h-3"
echo "  size={16} → w-4 h-4"
echo "  size={20} → w-5 h-5"
echo "  size={24} → w-6 h-6"
echo "  size={32} → w-8 h-8"
echo ""
echo "Script completed! Please review and test the changes."