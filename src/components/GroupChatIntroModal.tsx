import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Users, 
  Plus, 
  Crown,
  Globe,
  Lock,
  Shield,
  Gear,
  Bell,
  MessageCircle,
  Trophy,
  MapPin
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface GroupChatIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCreating: () => void;
}

export function GroupChatIntroModal({ isOpen, onClose, onStartCreating }: GroupChatIntroModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to Group Chats",
      description: "Connect with fellow food lovers, share discoveries, and explore cuisines together",
      icon: <Users className="w-16 h-16 text-primary" />,
      features: [
        "Create themed food groups",
        "Share quests and challenges",
        "Discover local dining spots",
        "Plan food adventures together"
      ]
    },
    {
      title: "Group Types & Privacy",
      description: "Choose the perfect privacy level for your food community",
      icon: <Shield className="w-16 h-16 text-primary" />,
      features: [
        { icon: <Globe className="w-5 h-5" />, title: "Public", desc: "Anyone can discover and join" },
        { icon: <Lock className="w-5 h-5" />, title: "Private", desc: "Invite-only membership" },
        { icon: <Shield className="w-5 h-5" />, title: "Invite Only", desc: "Members can invite with approval" }
      ]
    },
    {
      title: "Group Features",
      description: "Powerful tools to enhance your food exploration",
      icon: <Gear className="w-16 h-16 text-primary" />,
      features: [
        { icon: <Trophy className="w-5 h-5" />, title: "Quest Sharing", desc: "Share food challenges and bounties" },
        { icon: <MapPin className="w-5 h-5" />, title: "Location Sharing", desc: "Recommend restaurants and spots" },
        { icon: <Crown className="w-5 h-5" />, title: "Admin Controls", desc: "Manage members and content" },
        { icon: <Bell className="w-5 h-5" />, title: "Smart Notifications", desc: "Stay updated on group activity" }
      ]
    },
    {
      title: "Ready to Start?",
      description: "Create your first group and start building your food community",
      icon: <MessageCircle className="w-16 h-16 text-primary" />,
      features: [
        "Choose a catchy group name",
        "Set your group category",
        "Invite your foodie friends",
        "Start sharing and exploring!"
      ]
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleGetStarted = () => {
    onClose();
    onStartCreating();
  };

  if (!isOpen) return null;

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-3xl w-full max-w-md max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">Group Chats</h2>
            <Badge variant="secondary" className="text-xs">
              New
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex gap-2 mb-6">
            {slides.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 rounded-full flex-1 transition-colors",
                  index <= currentSlide ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              {slide.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{slide.title}</h3>
            <p className="text-muted-foreground text-sm">
              {slide.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {slide.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                {typeof feature === 'string' ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <p className="text-sm">{feature}</p>
                  </>
                ) : (
                  <>
                    <div className="text-primary flex-shrink-0 mt-0.5">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentSlide > 0 && (
              <Button
                variant="outline"
                onClick={prevSlide}
                className="flex-1"
              >
                Back
              </Button>
            )}
            
            {currentSlide < slides.length - 1 ? (
              <Button
                onClick={nextSlide}
                className="flex-1"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleGetStarted}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            )}
          </div>

          {/* Skip option */}
          {currentSlide < slides.length - 1 && (
            <div className="text-center mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGetStarted}
                className="text-muted-foreground"
              >
                Skip tour
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}