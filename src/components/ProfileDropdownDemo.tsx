import React, { useState, useRef } from 'react';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Mock user data
const mockUser = {
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  displayName: "Alex Chen",
  username: "@alexchen",
  tasteTitle: "Flavor Explorer",
  level: 24,
  xp: 18000,
  maxXp: 20000,
  badges: [
    { id: "verified", icon: "✓", label: "Verified", verified: true },
    { id: "creator", icon: "⭐", label: "Creator" }
  ]
};

const mockStats = {
  streak: 4,
  tickets: 2,
  likCoins: "1.2k",
  hearts: "3.2k"
};

const mockDailyProgress = {
  currentTime: "01:30",
  targetTime: "02:00",
  bonusReward: "+2 LP",
  streakDays: 7,
  currentStreak: 4
};

export const ProfileDropdownDemo: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);

  const handleAvatarClick = () => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setAnchorRect(rect);
      setIsDropdownOpen(true);
    }
  };

  const handleNavigate = (destination: string) => {
    console.log(`Navigating to: ${destination}`);
    setIsDropdownOpen(false);
    // Here you would typically handle navigation
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4 nav-rum-raisin">Profile Dropdown Demo</h1>
          <p className="text-muted-foreground mb-6">
            Click on the avatar below to see the profile dropdown in action. This component is designed
            to appear when users tap their profile avatar on the home and explore pages.
          </p>

          {/* Demo Header (simulating home page header) */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              {/* User Avatar - Click target */}
              <button
                ref={avatarRef}
                onClick={handleAvatarClick}
                className="relative w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
              >
                <img
                  src={mockUser.avatar}
                  alt={mockUser.displayName}
                  className="w-full h-full object-cover"
                />
                {/* Level badge */}
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full font-semibold">
                  {mockUser.level}
                </div>
              </button>
              
              <div>
                <h2 className="font-semibold text-foreground nav-rum-raisin">Lik</h2>
                <p className="text-xs text-muted-foreground">Social Food Discovery</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">🎮</Button>
              <Button variant="ghost" size="sm">📺</Button>
              <Button variant="ghost" size="sm">💬</Button>
              <Button variant="ghost" size="sm">🏆</Button>
            </div>
          </div>

          {/* Component Properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 nav-rum-raisin">User Data</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {mockUser.displayName}</div>
                <div><strong>Title:</strong> {mockUser.tasteTitle}</div>
                <div><strong>Level:</strong> {mockUser.level}</div>
                <div><strong>XP:</strong> {mockUser.xp.toLocaleString()} / {mockUser.maxXp.toLocaleString()}</div>
                <div><strong>Badges:</strong> {mockUser.badges.length}</div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3 nav-rum-raisin">Stats & Progress</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Streak:</strong> {mockStats.streak} days</div>
                <div><strong>Tickets:</strong> {mockStats.tickets}</div>
                <div><strong>Lik Coins:</strong> {mockStats.likCoins}</div>
                <div><strong>Daily Progress:</strong> {mockDailyProgress.currentTime} / {mockDailyProgress.targetTime}</div>
                <div><strong>Streak Days:</strong> {mockDailyProgress.currentStreak} / {mockDailyProgress.streakDays}</div>
              </div>
            </Card>
          </div>

          {/* Features List */}
          <Card className="p-4 mt-6">
            <h3 className="font-semibold mb-3 nav-rum-raisin">Features</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Animated XP progress ring around avatar</li>
              <li>• Quick stats display (streak, tickets, coins)</li>
              <li>• Grid of navigation shortcuts</li>
              <li>• Daily progress widget with streak visualization</li>
              <li>• Backdrop blur and smooth animations</li>
              <li>• Click outside to close</li>
              <li>• Responsive positioning</li>
              <li>• Touch-friendly interactions</li>
            </ul>
          </Card>

          {/* Instructions */}
          <Card className="p-4 mt-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold mb-2 nav-rum-raisin text-primary">Try It Out</h3>
            <p className="text-sm text-muted-foreground">
              Click the avatar in the demo header above to open the profile dropdown. 
              The dropdown will position itself relative to the avatar and includes all 
              the features specified in your requirements.
            </p>
          </Card>
        </Card>
      </div>

      {/* Profile Dropdown */}
      <ProfileDropdown
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        anchorRect={anchorRect}
        user={mockUser}
        stats={mockStats}
        dailyProgress={mockDailyProgress}
        onNavigate={handleNavigate}
      />
    </div>
  );
};