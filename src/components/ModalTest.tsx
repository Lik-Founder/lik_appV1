import React, { useState } from 'react';
import { BountyCardModal } from './BountyCardModal';
import { QuestCardModal } from './QuestCardModal';
import { Button } from './ui/button';

// Test component to verify modal functionality
export function ModalTest() {
  const [showBountyModal, setShowBountyModal] = useState(false);
  const [showQuestModal, setShowQuestModal] = useState(false);

  const testBounty = {
    id: '1',
    title: 'Ultimate Kebab Challenge',
    restaurant: 'Mediterranean Delights',
    description: 'Experience the most authentic kebab in the city. Made with premium lamb, fresh herbs, and our secret spice blend that has been passed down through generations.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop&crop=entropy&auto=format',
    reward: '750 LKC',
    xp: '+50 XP',
    difficulty: 'medium' as const,
    timeLeft: '24:00',
    distance: '0.8 miles',
    rating: 4.5,
    likes: 342,
    completedBy: ['Alex Chen', 'Sarah Wilson', 'Mike Rodriguez', 'Emma Thompson', 'David Kim'],
    category: 'Middle Eastern',
    price: '$18',
    calories: '580 cal',
    ingredients: ['Premium lamb', 'Fresh herbs', 'Artisan bread', 'Yogurt sauce', 'Grilled vegetables'],
    allergens: ['Gluten', 'Dairy'],
    nutritionFacts: {
      protein: '32g',
      carbs: '45g',
      fat: '18g',
      fiber: '6g'
    }
  };

  const testQuest = {
    id: '1',
    title: 'The Great Pizza Quest',
    description: 'Embark on an epic journey to discover the finest pizza establishments across the city. Each location offers unique flavors and styles that will challenge your taste buds.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=300&fit=crop&crop=entropy&auto=format',
    reward: '1500 LKC',
    xp: '+100 XP',
    difficulty: 'hard' as const,
    timeLeft: '7 Days',
    locations: 5,
    category: 'Italian Cuisine',
    type: 'team' as const,
    progress: {
      current: 2,
      total: 5
    },
    requirements: [
      'Visit all 5 pizza locations',
      'Try the signature pizza at each spot',
      'Rate your experience (1-10)',
      'Share photos with quest hashtag',
      'Complete within 7 days'
    ],
    locations_list: [
      { name: 'Tony\'s Original Pizza', address: '123 Main St, Downtown', completed: true },
      { name: 'Margherita\'s Kitchen', address: '456 Oak Ave, Midtown', completed: true },
      { name: 'The Pizza Lab', address: '789 Pine Rd, Uptown', completed: false },
      { name: 'Slice Heaven', address: '321 Elm St, Westside', completed: false },
      { name: 'Artisan Pizza Co.', address: '654 Maple Dr, Eastside', completed: false }
    ],
    participants: 127,
    leaderboard: {
      position: 8,
      total: 50
    },
    tips: [
      'Visit during lunch hours for the freshest pies',
      'Ask staff for their personal recommendations',
      'Take photos of each pizza for bonus points',
      'Check the daily specials at each location'
    ],
    questGiver: {
      name: 'Chef Antonio',
      avatar: 'CA',
      title: 'Pizza Master & Quest Guide'
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Modal Test</h2>
      <div className="flex gap-4">
        <Button onClick={() => setShowBountyModal(true)}>
          Test Bounty Modal
        </Button>
        <Button onClick={() => setShowQuestModal(true)}>
          Test Quest Modal
        </Button>
      </div>

      <BountyCardModal
        bounty={testBounty}
        isOpen={showBountyModal}
        onClose={() => setShowBountyModal(false)}
        onAccept={() => {
          console.log('Bounty accepted!');
          setShowBountyModal(false);
        }}
        onShowRestaurantProfile={(id) => {
          console.log('Show restaurant:', id);
          setShowBountyModal(false);
        }}
      />

      <QuestCardModal
        quest={testQuest}
        isOpen={showQuestModal}
        onClose={() => setShowQuestModal(false)}
        onAccept={() => {
          console.log('Quest accepted!');
          setShowQuestModal(false);
        }}
        onShowRestaurantProfile={(id) => {
          console.log('Show restaurant:', id);
          setShowQuestModal(false);
        }}
      />
    </div>
  );
}