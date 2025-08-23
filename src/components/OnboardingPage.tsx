import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChefHatIcon, MapPinIcon, TrophyIcon, HeartIcon, StarIcon, UsersIcon } from '@heroicons/react/24/outline';
import LikLogo from '@/assets/images/Lik_Logo_Heart_1.0.png';

interface OnboardingPageProps {
  onGetStarted: () => void;
}

export function OnboardingPage({ onGetStarted }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <img src={LikLogo} alt="Lik" className="w-24 h-24 mx-auto animate-bounce" />,
      title: "Welcome to Lik! 🎉",
      subtitle: "Your Magical Food Adventure Awaits",
      description: "Get ready to embark on the most delicious journey of your life! Discover hidden gems, complete epic food quests, and become the ultimate foodie explorer!",
      gradient: "from-pink-400 via-purple-500 to-indigo-500"
    },
    {
      icon: <MapPinIcon className="w-24 h-24 mx-auto text-green-400 animate-pulse" />,
      title: "Discover Hidden Gems 💎",
      subtitle: "Explore Your Food Universe",
      description: "Swipe through restaurants like a dating app! Find your perfect food match and unlock secret spots that only the coolest foodies know about.",
      gradient: "from-green-400 via-teal-500 to-blue-500"
    },
    {
      icon: <TrophyIcon className="w-24 h-24 mx-auto text-yellow-400 animate-bounce" />,
      title: "Complete Epic Quests 🗡️",
      subtitle: "Level Up Your Taste Buds",
      description: "Take on bounties and quests! Try the spiciest ramen, find the best late-night pizza, or master the art of brunch. Earn Lik Coins and bragging rights!",
      gradient: "from-yellow-400 via-orange-500 to-red-500"
    },
    {
      icon: <UsersIcon className="w-24 h-24 mx-auto text-purple-400 animate-pulse" />,
      title: "Join the Foodie Squad 👥",
      subtitle: "Share Your Delicious Journey",
      description: "Connect with fellow food adventurers! Share your discoveries, compete on leaderboards, and build your reputation as a legendary food explorer.",
      gradient: "from-purple-400 via-pink-500 to-rose-500"
    },
    {
      icon: <StarIcon className="w-24 h-24 mx-auto text-pink-400 animate-spin-slow" />,
      title: "Ready to Start? ✨",
      subtitle: "Your Food Adventure Begins Now",
      description: "Join thousands of food explorers on the most epic culinary journey ever created. Are you ready to become a Lik Legend?",
      gradient: "from-pink-400 via-purple-500 to-indigo-500"
    }
  ];

  const currentStepData = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onGetStarted();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentStepData.gradient} flex flex-col relative overflow-hidden`}>
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <ChefHatIcon className="w-8 h-8 text-white/20" />
        </div>
        <div className="absolute top-20 right-20 animate-float delay-1000">
          <ChefHatIcon className="w-6 h-6 text-white/20" />
        </div>
        <div className="absolute bottom-32 left-20 animate-float delay-2000">
          <StarIcon className="w-10 h-10 text-white/20" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float delay-3000">
          <HeartIcon className="w-7 h-7 text-white/20" />
        </div>
        <div className="absolute top-1/2 left-5 animate-float delay-500">
          <TrophyIcon className="w-5 h-5 text-white/20" />
        </div>
        <div className="absolute top-1/3 right-5 animate-float delay-1500">
          <StarIcon className="w-9 h-9 text-white/20" />
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center pt-8 pb-4 z-10">
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-white scale-125 shadow-lg' 
                  : index < currentStep 
                    ? 'bg-white/70' 
                    : 'bg-white/30'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Icon */}
            <motion.div 
              className="mb-8"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStepData.icon}
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4 font-rum-raisin drop-shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              {currentStepData.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.h2 
              className="text-xl md:text-2xl text-white/90 mb-6 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentStepData.subtitle}
            </motion.h2>

            {/* Description */}
            <motion.p 
              className="text-lg text-white/80 leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {currentStepData.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center p-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-0 font-rum-raisin text-lg"
          >
            ← Back
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={nextStep}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-8 py-3 text-lg font-rum-raisin shadow-lg"
          >
            {currentStep === steps.length - 1 ? '🚀 Let\'s Go!' : 'Next →'}
          </Button>
        </motion.div>
      </div>

      {/* Skip Button and Dev Bypass */}
      <div className="absolute top-6 right-6 flex flex-col gap-2">
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button
              variant="ghost"
              onClick={onGetStarted}
              className="text-white/70 hover:text-white hover:bg-white/10 font-rum-raisin"
            >
              Skip
            </Button>
          </motion.div>
        )}
        
        {/* Dev bypass button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Button
            variant="ghost"
            onClick={onGetStarted}
            className="text-white/50 hover:text-white hover:bg-white/10 font-rum-raisin text-sm"
          >
            🚀 Enter App
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Add these custom animations to your CSS if they don't exist
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .delay-500 { animation-delay: 0.5s; }
  .delay-1000 { animation-delay: 1s; }
  .delay-1500 { animation-delay: 1.5s; }
  .delay-2000 { animation-delay: 2s; }
  .delay-3000 { animation-delay: 3s; }
  
  .font-rum-raisin {
    font-family: 'Rum Raisin', cursive;
  }
`;
document.head.appendChild(style);