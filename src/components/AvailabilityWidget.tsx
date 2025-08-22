import React, { useState, useEffect } from 'react';
import { CalendarIcon as Calendar, ClockIcon as Clock, UsersIcon as Users, StarIcon as Star, TrendingUpIcon as TrendingUp, FireIcon as Fire, TrophyIcon as Award } from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AvailabilityWidgetProps {
  restaurantId: string;
  className?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  popularity: 'low' | 'medium' | 'high';
}

export function AvailabilityWidget({ restaurantId, className = '' }: AvailabilityWidgetProps) {
  const [todaySlots, setTodaySlots] = useState<TimeSlot[]>([]);
  const [tomorrowSlots, setTomorrowSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time availability updates
    const generateAvailability = () => {
      const currentHour = new Date().getHours();
      const slots: TimeSlot[] = [];
      
      // Generate slots for next 6 hours
      for (let i = 0; i < 6; i++) {
        const hour = currentHour + i + 1;
        if (hour < 23) {
          const popularity = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low';
          slots.push({
            time: `${hour.toString().padStart(2, '0')}:00`,
            available: Math.random() > 0.3,
            popularity
          });
        }
      }
      
      setTodaySlots(slots);
      
      // Tomorrow's slots (always show 6 slots starting from 6 PM)
      const tomorrowSlotList: TimeSlot[] = [];
      for (let i = 18; i < 24; i++) {
        const popularity = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low';
        tomorrowSlotList.push({
          time: `${i.toString().padStart(2, '0')}:00`,
          available: Math.random() > 0.2,
          popularity
        });
      }
      setTomorrowSlots(tomorrowSlotList);
      setIsLoading(false);
    };

    generateAvailability();
    
    // Update availability every 30 seconds
    const interval = setInterval(generateAvailability, 30000);
    
    return () => clearInterval(interval);
  }, [restaurantId]);

  const formatTime = (time: string): string => {
    const [hours] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}${period}`;
  };

  const getPopularityIcon = (popularity: string) => {
    switch (popularity) {
      case 'high':
        return <Fire className="w-3 h-3 text-red-500" />;
      case 'medium':
        return <TrendingUp className="w-3 h-3 text-orange-500" />;
      default:
        return null;
    }
  };

  const getAvailabilityStatus = (slots: TimeSlot[]) => {
    const availableCount = slots.filter(slot => slot.available).length;
    const total = slots.length;
    const percentage = Math.round((availableCount / total) * 100);
    
    if (percentage >= 70) return { status: 'Great', color: 'text-green-600', badge: 'bg-green-100 text-green-700' };
    if (percentage >= 40) return { status: 'Good', color: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' };
    return { status: 'Limited', color: 'text-red-600', badge: 'bg-red-100 text-red-700' };
  };

  if (isLoading) {
    return (
      <Card className={`border-0 shadow-sm ${className}`}>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const todayStatus = getAvailabilityStatus(todaySlots);
  const tomorrowStatus = getAvailabilityStatus(tomorrowSlots);

  return (
    <Card className={`border-0 shadow-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Live Availability</h3>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>

        {/* Today's Availability */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Today</span>
            </div>
            <Badge className={todayStatus.badge} variant="secondary">
              {todayStatus.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {todaySlots.map((slot, index) => (
              <div
                key={index}
                className={`
                  p-2 rounded-lg text-center text-xs font-medium border
                  ${slot.available 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-1">
                  {formatTime(slot.time)}
                  {slot.available && getPopularityIcon(slot.popularity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tomorrow's Availability */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tomorrow</span>
            </div>
            <Badge className={tomorrowStatus.badge} variant="secondary">
              {tomorrowStatus.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {tomorrowSlots.slice(0, 6).map((slot, index) => (
              <div
                key={index}
                className={`
                  p-2 rounded-lg text-center text-xs font-medium border
                  ${slot.available 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-1">
                  {formatTime(slot.time)}
                  {slot.available && getPopularityIcon(slot.popularity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 pt-3 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">
                {todaySlots.filter(s => s.available).length}
              </div>
              <div className="text-xs text-muted-foreground">Available Today</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {tomorrowSlots.filter(s => s.available).length}
              </div>
              <div className="text-xs text-muted-foreground">Available Tomorrow</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600 flex items-center justify-center gap-1">
                <Fire className="w-4 h-4" />
                {[...todaySlots, ...tomorrowSlots].filter(s => s.popularity === 'high').length}
              </div>
              <div className="text-xs text-muted-foreground">Popular Times</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}