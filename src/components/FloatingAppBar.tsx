import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingAppBarProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function FloatingAppBar({ title, onBack, showBackButton = false }: FloatingAppBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border safe-top">
      <div className="flex items-center justify-between h-14 px-4">
        {showBackButton && onBack ? (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <div className="w-10" />
        )}
        <h1 className="text-lg font-semibold font-rum-raisin text-center flex-1">
          {title}
        </h1>
        <div className="w-10" />
      </div>
    </div>
  );
}