import { X, Instagram, Youtube, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileAvatar } from '@/components/ProfileAvatar';

interface ProfileSwipeViewProps {
  onClose: () => void;
}

export function ProfileSwipeView({ onClose }: ProfileSwipeViewProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-semibold font-rum-raisin">Bio</h2>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Profile Info */}
        <div className="text-center space-y-4">
          <ProfileAvatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
            alt="User"
            level={124}
            className="w-24 h-24 mx-auto"
          />
          <div>
            <h3 className="text-xl font-bold">Alex Chen</h3>
            <p className="text-muted-foreground">@alexchen</p>
          </div>
        </div>

        {/* Bio Section */}
        <Card className="p-4">
          <h4 className="font-semibold mb-2 font-rum-raisin">About</h4>
          <p className="text-sm text-muted-foreground">
            Food enthusiast exploring the best eats around the world 🌍✨ 
            Professional chef by day, food blogger by night. Always on the hunt for hidden gems!
          </p>
        </Card>

        {/* Featured Achievement */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3 font-rum-raisin">Featured Achievement</h4>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <p className="font-medium">Master Food Explorer</p>
              <p className="text-xs text-muted-foreground">Visited 100+ restaurants</p>
            </div>
          </div>
        </Card>

        {/* Social Links */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3 font-rum-raisin">Connect</h4>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="flex-1">
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Youtube className="w-4 h-4 mr-2" />
              YouTube
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
          </div>
        </Card>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">4.9</p>
            <p className="text-xs text-muted-foreground">Average Rating</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">89</p>
            <p className="text-xs text-muted-foreground">Cities Explored</p>
          </Card>
        </div>
      </div>
    </div>
  );
}