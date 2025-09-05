import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreatePostFABProps {
  onClick: () => void;
  style?: React.CSSProperties;
}

export function CreatePostFAB({ onClick, style }: CreatePostFABProps) {
  return (
    <Button
      className="fixed w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 glossy-red-pill z-50"
      onClick={onClick}
      style={style}
      size="icon"
    >
      <Plus className="w-6 h-6 text-white" />
    </Button>
  );
}