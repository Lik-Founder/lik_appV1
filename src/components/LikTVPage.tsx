import { ArrowLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface LikTVPageProps {
  onBack: () => void;
}

export function LikTVPage({ onBack }: LikTVPageProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-muted"
        >
          <ArrowLeft size={20} />
        </Button>
        
        <h1 className="text-lg font-semibold">LikTV</h1>
        
        <div className="w-8 h-8" /> {/* Spacer for alignment */}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="text-6xl">📺</div>
          <h2 className="text-xl font-semibold text-foreground">LikTV</h2>
          <p className="text-muted-foreground max-w-sm">
            Coming soon - Your streaming and creator content hub
          </p>
        </div>
      </div>
    </div>
  );
}