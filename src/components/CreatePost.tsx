import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Post as PostType, User } from '@/lib/types';
import { getCurrentUser } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Image as ImageIcon, X } from '@phosphor-icons/react';
import { toast } from 'sonner';

export function CreatePost() {
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
    } catch (error) {
      toast.error('Failed to share post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Create New Post</h1>
        <p className="text-muted-foreground">Share a photo with your followers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera size={20} />
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
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <ImageIcon size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Select a photo to share</p>
              <p className="text-sm text-muted-foreground mb-4">Choose from sample images below:</p>
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

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
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
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => {
            setSelectedImage('');
            setCaption('');
            setLocation('');
          }}
        >
          Clear
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
  );
}