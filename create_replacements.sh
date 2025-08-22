#!/bin/bash

# Script to replace phosphor icons with heroicons
# This script handles the most common icon replacements

# Create a mapping file with common icon replacements
cat > /tmp/icon_replacements.txt << 'EOF'
# Import replacements
from '@phosphor-icons/react'|from '@heroicons/react/24/outline'
from "@phosphor-icons/react"|from "@heroicons/react/24/outline"

# Icon name replacements in imports
ArrowLeft,|ArrowLeftIcon,
ArrowRight,|ArrowRightIcon,
ArrowUp,|ArrowUpIcon,
ArrowDown,|ArrowDownIcon,
X,|XMarkIcon,
Plus,|PlusIcon,
Heart,|HeartIcon,
Star,|StarIcon,
Fire,|FireIcon,
Users,|UsersIcon,
User,|UserIcon,
Trophy,|TrophyIcon,
MapPin,|MapPinIcon,
MagnifyingGlass,|MagnifyingGlassIcon,
Camera,|CameraIcon,
Gift,|GiftIcon,
Check,|CheckIcon,
CheckCheck,|CheckBadgeIcon,
DotsThreeVertical,|EllipsisVerticalIcon,
DotsThree,|EllipsisHorizontalIcon,
CaretDown,|ChevronDownIcon,
CaretUp,|ChevronUpIcon,
CaretLeft,|ChevronLeftIcon,
CaretRight,|ChevronRightIcon,
Smiley,|FaceSmileIcon,
ThumbsUp,|HandThumbUpIcon,
PaperPlaneRight,|PaperAirplaneIcon,
Clock,|ClockIcon,
Calendar,|CalendarIcon,
BookmarkSimple,|BookmarkIcon,
Target,|BookmarkIcon,
Buildings,|BuildingOfficeIcon,
CurrencyCircleDollar,|CurrencyDollarIcon,
Image,|PhotoIcon,
Sparkle,|SparklesIcon,
Bell,|BellIcon,
Gear,|CogIcon,
House,|HomeIcon,
List,|ListBulletIcon,
FunnelSimple,|FunnelIcon,
ShareNetwork,|ShareIcon,
Download,|ArrowDownTrayIcon,
Upload,|ArrowUpTrayIcon,
Play,|PlayIcon,
Pause,|PauseIcon,
Stop,|StopIcon,
Eye,|EyeIcon,
EyeSlash,|EyeSlashIcon,
Phone,|PhoneIcon,
Envelope,|EnvelopeIcon,
ChatCircle,|ChatBubbleOvalLeftIcon,
PencilSimple,|PencilIcon,
Trash,|TrashIcon,
Clipboard,|ClipboardIcon,
Warning,|ExclamationTriangleIcon,
Info,|InformationCircleIcon,
Question,|QuestionMarkCircleIcon,
Lock,|LockClosedIcon,
LockOpen,|LockOpenIcon,
SignOut,|ArrowRightOnRectangleIcon,
SignIn,|ArrowLeftOnRectangleIcon,

# Usage replacements (remove size prop, use className with w-* h-*)
<ArrowLeft |<ArrowLeftIcon className="
<ArrowRight |<ArrowRightIcon className="
<ArrowUp |<ArrowUpIcon className="
<ArrowDown |<ArrowDownIcon className="
<X |<XMarkIcon className="
<Plus |<PlusIcon className="
<Heart |<HeartIcon className="
<Star |<StarIcon className="
<Fire |<FireIcon className="
<Users |<UsersIcon className="
<User |<UserIcon className="
<Trophy |<TrophyIcon className="
<MapPin |<MapPinIcon className="
<MagnifyingGlass |<MagnifyingGlassIcon className="
<Camera |<CameraIcon className="
<Gift |<GiftIcon className="
<Check |<CheckIcon className="
<CheckCheck |<CheckBadgeIcon className="
<DotsThreeVertical |<EllipsisVerticalIcon className="
<DotsThree |<EllipsisHorizontalIcon className="
<CaretDown |<ChevronDownIcon className="
<CaretUp |<ChevronUpIcon className="
<CaretLeft |<ChevronLeftIcon className="
<CaretRight |<ChevronRightIcon className="
<Smiley |<FaceSmileIcon className="
<ThumbsUp |<HandThumbUpIcon className="
<PaperPlaneRight |<PaperAirplaneIcon className="
<Clock |<ClockIcon className="
<Calendar |<CalendarIcon className="
<BookmarkSimple |<BookmarkIcon className="
<Target |<BookmarkIcon className="
<Buildings |<BuildingOfficeIcon className="
<CurrencyCircleDollar |<CurrencyDollarIcon className="
<Image |<PhotoIcon className="
<Sparkle |<SparklesIcon className="
<Bell |<BellIcon className="
<Gear |<CogIcon className="
<House |<HomeIcon className="
<List |<ListBulletIcon className="
<FunnelSimple |<FunnelIcon className="
<ShareNetwork |<ShareIcon className="
<Download |<ArrowDownTrayIcon className="
<Upload |<ArrowUpTrayIcon className="
<Play |<PlayIcon className="
<Pause |<PauseIcon className="
<Stop |<StopIcon className="
<Eye |<EyeIcon className="
<EyeSlash |<EyeSlashIcon className="
<Phone |<PhoneIcon className="
<Envelope |<EnvelopeIcon className="
<ChatCircle |<ChatBubbleOvalLeftIcon className="
<PencilSimple |<PencilIcon className="
<Trash |<TrashIcon className="
<Clipboard |<ClipboardIcon className="
<Warning |<ExclamationTriangleIcon className="
<Info |<InformationCircleIcon className="
<Question |<QuestionMarkCircleIcon className="
<Lock |<LockClosedIcon className="
<LockOpen |<LockOpenIcon className="
<SignOut |<ArrowRightOnRectangleIcon className="
<SignIn |<ArrowLeftOnRectangleIcon className="
EOF

echo "Icon replacement mapping created"