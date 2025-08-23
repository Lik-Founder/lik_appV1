import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Post as PostType, User } from '@/lib/types';
import { getCurrentUser } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CameraIcon as Camera, PhotoIcon as ImageIcon, XMarkIcon as X } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [posts, setPosts] = useKV<PostType[]>('posts', []);
  const [currentUser] = useKV<User>('currentUser', getCurrentUser());
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop',
  ];

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handlePost = async () => {
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    setIsLoading(true);

    try {
      const newPost: PostType = {
        id: Date.now().toString(),
        userId: currentUser.id,
        imageUrl: selectedImage,
        caption,
        likes: 0,
        isLiked: false,
        comments: [],
        timestamp: Date.now(),
        location: location || undefined,
      };

      setPosts(currentPosts => [newPost, ...currentPosts]);
      
      // Reset form
      setSelectedImage('');
      setCaption('');
      setLocation('');
      
      toast.success('Post shared successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to share post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedImage('');
    setCaption('');
    setLocation('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Create New Post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Camera className="w-5 h-5" />
                Select Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setSelectedImage('')}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-3">Select a photo to share</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(image)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === image 
                        ? 'border-accent' 
                        : 'border-transparent hover:border-muted-foreground/25'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                placeholder="Add location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 instagram-gradient text-white border-0"
              onClick={handlePost}
              disabled={!selectedImage || isLoading}
            >
              {isLoading ? 'Sharing...' : 'Share Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}