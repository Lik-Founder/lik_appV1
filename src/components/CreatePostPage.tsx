import { useState, useRef } from 'react';
import { ArrowLeftIcon as ArrowLeft, CameraIcon as Camera, PhotoIcon as Image, EllipsisHorizontalIcon as MoreHorizontal, MapPinIcon as MapPin, SparklesIcon as Sparkles, HeartIcon as Heart, ChatBubbleLeftIcon as MessageCircle, ShareIcon as Share, PlusIcon as Plus } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDevice } from '@/hooks/use-device';

interface CreatePostPageProps {
  onBack: () => void;
}

export function CreatePostPage({ onBack }: CreatePostPageProps) {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [currentStory, setCurrentStory] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const device = useDevice();

  // Mock stories data - similar to home feed but for post creation inspiration
  const stories = [
    {
      id: '1',
      username: 'foodie_sam',
      avatar: '/api/placeholder/40/40',
      image: '/api/placeholder/400/600',
      caption: 'Amazing pasta at Luigi\'s! 🍝',
      likes: 1284,
      comments: 89,
      location: 'Luigi\'s Italian Bistro'
    },
    {
      id: '2', 
      username: 'chef_maria',
      avatar: '/api/placeholder/40/40',
      image: '/api/placeholder/400/600',
      caption: 'Fresh sushi rolls made with love ❤️',
      likes: 2156,
      comments: 134,
      location: 'Sakura Sushi Bar'
    },
    {
      id: '3',
      username: 'taste_explorer',
      avatar: '/api/placeholder/40/40', 
      image: '/api/placeholder/400/600',
      caption: 'Street tacos that changed my life 🌮',
      likes: 967,
      comments: 67,
      location: 'Taco Libre Food Truck'
    }
  ];

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    setIsPosting(true);
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPosting(false);
    onBack();
  };

  const currentStoryData = stories[currentStory];

  return (
    <div className="h-full bg-black text-white overflow-hidden">
      {/* App Bar */}
      <div 
        className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm relative z-20"
        style={{ 
          paddingTop: device.hasNotch ? 'calc(env(safe-area-inset-top) + 16px)' : '16px' 
        }}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft size={24} />
        </Button>
        
        <h1 className="text-lg font-semibold font-rum-raisin">Create Post</h1>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="text-white hover:bg-white/10"
        >
          <MoreHorizontal size={24} />
        </Button>
      </div>

      {/* Story-like Feed Display */}
      <div className="relative flex-1">
        {/* Background Story */}
        <div className="absolute inset-0">
          <img
            src={currentStoryData.image}
            alt="Background story"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        {/* Story Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-300 ${
                  index === currentStory ? 'w-full' : index < currentStory ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Story User Info */}
        <div className="absolute top-8 left-4 right-4 flex items-center gap-3 z-10 mt-6">
          <img
            src={currentStoryData.avatar}
            alt={currentStoryData.username}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{currentStoryData.username}</p>
            <p className="text-white/70 text-xs">{currentStoryData.location}</p>
          </div>
        </div>

        {/* Story Navigation Areas */}
        <div className="absolute inset-0 flex">
          <div 
            className="flex-1 cursor-pointer" 
            onClick={() => setCurrentStory(Math.max(0, currentStory - 1))}
          />
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => setCurrentStory(Math.min(stories.length - 1, currentStory + 1))}
          />
        </div>

        {/* Story Actions */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-4 z-10">
          <div className="flex flex-col items-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10 w-12 h-12 rounded-full"
            >
              <Heart size={28} />
            </Button>
            <span className="text-white text-xs mt-1">{currentStoryData.likes}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10 w-12 h-12 rounded-full"
            >
              <MessageCircle size={28} />
            </Button>
            <span className="text-white text-xs mt-1">{currentStoryData.comments}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/10 w-12 h-12 rounded-full"
          >
            <Share size={28} />
          </Button>
        </div>

        {/* Story Caption */}
        <div className="absolute bottom-20 left-4 right-20 z-10">
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-white/70" />
              <span className="text-white/70 text-sm">{currentStoryData.location}</span>
            </div>
            <p className="text-white text-sm leading-relaxed">{currentStoryData.caption}</p>
          </div>
        </div>
      </div>

      {/* Create Post Panel - Bottom Sheet Style */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl rounded-t-3xl border-t border-white/10 p-6">
        <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-6" />
        
        <div className="space-y-4">
          {/* Image Selection */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleImageSelect}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 h-12 rounded-2xl font-rum-raisin"
            >
              <Camera size={20} className="mr-2" />
              {selectedImage ? 'Change Photo' : 'Add Photo'}
            </Button>
            
            <Button
              variant="outline"
              className="h-12 w-12 rounded-2xl border-white/20 text-white hover:bg-white/10"
            >
              <Image size={20} />
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-48 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
            </div>
          )}

          {/* Caption Input */}
          <Textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none h-20 rounded-2xl font-rum-raisin"
          />

          {/* Location Input */}
          <div className="relative">
            <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <Input
              placeholder="Add location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10 h-12 rounded-2xl font-rum-raisin"
            />
          </div>

          {/* Post Button */}
          <Button
            onClick={handlePost}
            disabled={isPosting || (!selectedImage && !caption)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 h-12 rounded-2xl font-rum-raisin font-semibold disabled:opacity-50"
          >
            {isPosting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Posting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles size={20} />
                Share Post
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}