import { ArrowLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface LeaderboardPageProps {
  onBack: () => void;
}

export function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft size={24} />
        </Button>
        
        <h1 className="text-xl font-semibold text-center flex-1 mr-10">
          Leaderboard
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-lg">Leaderboard coming soon</p>
          <p className="text-sm mt-2">This feature is under development</p>
        </div>
      </div>
    </div>
  );
}