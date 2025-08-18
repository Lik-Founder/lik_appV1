import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, ChefHat, Leaf, Wheat, Milk, Egg, Fish, Nut, Heart, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PreferencesPageProps {
  onComplete: () => void;
}

export function PreferencesPage({ onComplete }: PreferencesPageProps) {
  const { user } = useAuth();
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const cuisines = [
    { id: 'italian', name: 'Italian', emoji: '🍝', color: 'bg-red-100 text-red-700' },
    { id: 'japanese', name: 'Japanese', emoji: '🍣', color: 'bg-pink-100 text-pink-700' },
    { id: 'mexican', name: 'Mexican', emoji: '🌮', color: 'bg-orange-100 text-orange-700' },
    { id: 'chinese', name: 'Chinese', emoji: '🥢', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'indian', name: 'Indian', emoji: '🍛', color: 'bg-amber-100 text-amber-700' },
    { id: 'thai', name: 'Thai', emoji: '🍜', color: 'bg-green-100 text-green-700' },
    { id: 'american', name: 'American', emoji: '🍔', color: 'bg-blue-100 text-blue-700' },
    { id: 'french', name: 'French', emoji: '🥖', color: 'bg-purple-100 text-purple-700' },
    { id: 'mediterranean', name: 'Mediterranean', emoji: '🫒', color: 'bg-teal-100 text-teal-700' },
    { id: 'korean', name: 'Korean', emoji: '🥘', color: 'bg-rose-100 text-rose-700' },
    { id: 'vietnamese', name: 'Vietnamese', emoji: '🍲', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'turkish', name: 'Turkish', emoji: '🥙', color: 'bg-indigo-100 text-indigo-700' }
  ];

  const diets = [
    { id: 'vegetarian', name: 'Vegetarian', icon: <Leaf className="w-4 h-4" />, color: 'bg-green-100 text-green-700' },
    { id: 'vegan', name: 'Vegan', icon: <Leaf className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-700' },
    { id: 'halal', name: 'Halal', icon: <Heart className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700' },
    { id: 'kosher', name: 'Kosher', icon: <Heart className="w-4 h-4" />, color: 'bg-purple-100 text-purple-700' },
    { id: 'keto', name: 'Keto', icon: <ChefHat className="w-4 h-4" />, color: 'bg-orange-100 text-orange-700' },
    { id: 'paleo', name: 'Paleo', icon: <ChefHat className="w-4 h-4" />, color: 'bg-amber-100 text-amber-700' },
    { id: 'gluten-free', name: 'Gluten-Free', icon: <Wheat className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'dairy-free', name: 'Dairy-Free', icon: <Milk className="w-4 h-4" />, color: 'bg-cyan-100 text-cyan-700' }
  ];

  const allergies = [
    { id: 'peanuts', name: 'Peanuts', icon: <Nut className="w-4 h-4" />, color: 'bg-red-100 text-red-700' },
    { id: 'tree-nuts', name: 'Tree Nuts', icon: <Nut className="w-4 h-4" />, color: 'bg-orange-100 text-orange-700' },
    { id: 'shellfish', name: 'Shellfish', icon: <Fish className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700' },
    { id: 'fish', name: 'Fish', icon: <Fish className="w-4 h-4" />, color: 'bg-cyan-100 text-cyan-700' },
    { id: 'eggs', name: 'Eggs', icon: <Egg className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'dairy', name: 'Dairy', icon: <Milk className="w-4 h-4" />, color: 'bg-purple-100 text-purple-700' },
    { id: 'soy', name: 'Soy', icon: <Leaf className="w-4 h-4" />, color: 'bg-green-100 text-green-700' },
    { id: 'wheat', name: 'Wheat/Gluten', icon: <Wheat className="w-4 h-4" />, color: 'bg-amber-100 text-amber-700' }
  ];

  const steps = [
    {
      title: "What cuisines make your taste buds dance? 💃",
      subtitle: "Pick your favorite flavors!",
      description: "Select all the cuisines you love (or want to explore). Don't worry, you can always change these later!",
      data: cuisines,
      selected: selectedCuisines,
      setSelected: setSelectedCuisines,
      gradient: "from-orange-400 via-pink-500 to-purple-600"
    },
    {
      title: "Any dietary preferences? 🌱",
      subtitle: "Help us find perfect matches!",
      description: "Let us know about your dietary choices so we can recommend the best spots for you.",
      data: diets,
      selected: selectedDiets,
      setSelected: setSelectedDiets,
      gradient: "from-green-400 via-teal-500 to-blue-600"
    },
    {
      title: "Any food allergies we should know about? ⚠️",
      subtitle: "Your safety is our priority!",
      description: "Help us keep you safe by letting us know about any food allergies you have.",
      data: allergies,
      selected: selectedAllergies,
      setSelected: setSelectedAllergies,
      gradient: "from-red-400 via-pink-500 to-purple-600"
    }
  ];

  const currentStepData = steps[currentStep];

  const toggleSelection = (id: string, selected: string[], setSelected: (items: string[]) => void) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Here you would typically save the preferences to your backend
      toast.success("🎉 Preferences saved! Welcome to your food adventure!");
      onComplete();
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentStepData.gradient} relative overflow-hidden`}>
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <ChefHat className="w-8 h-8 text-white/20" />
        </div>
        <div className="absolute top-32 right-20 animate-float delay-1000">
          <Heart className="w-6 h-6 text-white/20" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float delay-2000">
          <Leaf className="w-10 h-10 text-white/20" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float delay-3000">
          <AlertTriangle className="w-7 h-7 text-white/20" />
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-6 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">👋</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-rum-raisin">
            Hey {user?.user_metadata?.display_name || 'Food Explorer'}!
          </h1>
          <p className="text-white/80">Let's personalize your food journey</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-white/70 text-sm">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-24">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          {/* Step Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-rum-raisin">
              {currentStepData.title}
            </h2>
            <p className="text-xl text-white/90 mb-2">
              {currentStepData.subtitle}
            </p>
            <p className="text-white/70">
              {currentStepData.description}
            </p>
          </div>

          {/* Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {currentStepData.data.map((item) => {
              const isSelected = currentStepData.selected.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'ring-2 ring-white bg-white/20 backdrop-blur-sm' 
                        : 'bg-white/10 hover:bg-white/15 backdrop-blur-sm'
                    }`}
                    onClick={() => toggleSelection(item.id, currentStepData.selected, currentStepData.setSelected)}
                  >
                    <CardContent className="p-4 text-center relative">
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                      )}
                      
                      <div className="text-2xl mb-2">
                        {'emoji' in item ? item.emoji : ''}
                        {'icon' in item ? item.icon : ''}
                      </div>
                      
                      <h3 className="text-white font-medium text-sm">
                        {item.name}
                      </h3>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Selected Count */}
          {currentStepData.selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <Badge variant="secondary" className="bg-white/20 text-white text-lg px-4 py-2">
                {currentStepData.selected.length} selected
              </Badge>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20 p-4">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-0 font-rum-raisin"
          >
            ← Back
          </Button>

          <Button
            onClick={nextStep}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-8 py-3 font-rum-raisin"
          >
            {currentStep === steps.length - 1 ? '🎉 Complete Setup' : 'Continue →'}
          </Button>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-3">
          <Button
            variant="ghost"
            onClick={handleComplete}
            className="text-white/60 hover:text-white/80 text-sm font-rum-raisin"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}