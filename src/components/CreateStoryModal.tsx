import { useState, useRef, useCallback, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Story, User } from '@/lib/types';
import { getCurrentUser } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { 
  CameraIcon, 
  PhotoIcon, 
  XMarkIcon, 
  ArrowsRightLeftIcon,
  PlayCircleIcon as CircleStackIcon,
  PlayIcon,
  PauseIcon,
  StopCircleIcon,
  FaceSmileIcon,
  LanguageIcon,
  SwatchIcon,
  ExclamationTriangleIcon,
  StarIcon as SparklesIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useDevice, useCameraCapabilities, useHapticFeedback } from '@/hooks';
import { useStoryEditor, IMAGE_FILTERS, type ImageFilter, type TextOverlay } from '@/hooks/use-story-editor';
import { cn } from '@/lib/utils';

interface CreateStoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CaptureMode = 'photo' | 'video';
type CreationStep = 'select' | 'camera' | 'edit' | 'filters' | 'text' | 'preview';

export function CreateStoryModal({ open, onOpenChange }: CreateStoryModalProps) {
  const [stories, setStories] = useKV<Story[]>('stories', []);
  const [currentUser] = useKV<User>('currentUser', getCurrentUser());
  const [currentStep, setCurrentStep] = useState<CreationStep>('select');
  const [captureMode, setCaptureMode] = useState<CaptureMode>('photo');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [capturedMedia, setCapturedMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ImageFilter>(IMAGE_FILTERS[0]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [editingText, setEditingText] = useState<TextOverlay | null>(null);
  const [newTextInput, setNewTextInput] = useState('');
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const device = useDevice();
  const cameraCapabilities = useCameraCapabilities();
  const storyEditor = useStoryEditor({ width: 720, height: 1280 });
  const { triggerHaptic } = useHapticFeedback();

  const sampleImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400&h=600&fit=crop',
  ];

  // Camera access
  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: {
          facingMode,
          width: { ideal: 720 },
          height: { ideal: 1280 },
        },
        audio: captureMode === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCurrentStep('camera');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  }, [facingMode, captureMode]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
  }, [mediaStream]);

  // Flip camera
  const flipCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    stopCamera();
    setTimeout(startCamera, 100);
  }, [startCamera, stopCamera]);

  // Take photo
  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    triggerHaptic('impact');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip image if using front camera
    if (facingMode === 'user') {
      context.scale(-1, 1);
      context.translate(-canvas.width, 0);
    }

    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCapturedMedia({ url, type: 'image' });
        setCurrentStep('edit');
        stopCamera();
        triggerHaptic('success');
      }
    }, 'image/jpeg', 0.9);
  }, [facingMode, stopCamera, triggerHaptic]);

  // Start video recording
  const startRecording = useCallback(() => {
    if (!mediaStream) return;

    try {
      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      triggerHaptic('start');

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setCapturedMedia({ url, type: 'video' });
        setCurrentStep('edit');
        stopCamera();
        triggerHaptic('success');
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 15) { // 15 second limit for stories
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Unable to start recording');
      triggerHaptic('error');
    }
  }, [mediaStream, stopCamera, triggerHaptic]);

  // Stop video recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      triggerHaptic('stop');
      
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        recordingInterval.current = null;
      }
    }
  }, [isRecording, triggerHaptic]);

  // Handle image selection from gallery
  const handleImageSelect = (imageUrl: string) => {
    setCapturedMedia({ url: imageUrl, type: 'image' });
    setCurrentStep('edit');
  };

  // Process image with filters and text overlays
  const processImage = useCallback(async () => {
    if (!capturedMedia || capturedMedia.type !== 'image') return;
    
    try {
      const processedUrl = await storyEditor.applyFilterToImage(
        capturedMedia.url,
        selectedFilter,
        textOverlays
      );
      setProcessedImageUrl(processedUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    }
  }, [capturedMedia, selectedFilter, textOverlays, storyEditor]);

  // Process image when filter or text overlays change
  useEffect(() => {
    if (capturedMedia?.type === 'image' && currentStep === 'edit') {
      processImage();
    }
  }, [capturedMedia, selectedFilter, textOverlays, currentStep, processImage]);

  // Add text overlay
  const addTextOverlay = () => {
    if (!newTextInput.trim()) return;
    
    const newOverlay: TextOverlay = {
      id: Date.now().toString(),
      text: newTextInput,
      x: 360, // Center horizontally
      y: 640, // Center vertically  
      fontSize: 24,
      color: '#ffffff',
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      rotation: 0
    };
    
    setTextOverlays(prev => [...prev, newOverlay]);
    setNewTextInput('');
    setCurrentStep('edit');
  };

  // Remove text overlay
  const removeTextOverlay = (id: string) => {
    setTextOverlays(prev => prev.filter(overlay => overlay.id !== id));
  };
  // Share story
  const handleShareStory = async () => {
    if (!capturedMedia) {
      toast.error('No media selected');
      return;
    }

    setIsLoading(true);

    try {
      // Use processed image if available, otherwise use original
      const finalMediaUrl = capturedMedia.type === 'image' && processedImageUrl 
        ? processedImageUrl 
        : capturedMedia.url;

      const newStory: Story = {
        id: Date.now().toString(),
        userId: currentUser.id,
        imageUrl: finalMediaUrl, // For backward compatibility
        mediaUrl: finalMediaUrl,
        type: capturedMedia.type,
        caption,
        timestamp: Date.now(),
        isViewed: false,
        duration: capturedMedia.type === 'video' ? recordingTime : 5,
      };

      setStories(currentStories => [newStory, ...currentStories]);
      
      toast.success('Story shared successfully!');
      handleClose();
    } catch (error) {
      console.error('Error sharing story:', error);
      toast.error('Failed to share story');
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal and cleanup
  const handleClose = () => {
    stopCamera();
    setCapturedMedia(null);
    setCaption('');
    setCurrentStep('select');
    setRecordingTime(0);
    setIsRecording(false);
    setSelectedFilter(IMAGE_FILTERS[0]);
    setTextOverlays([]);
    setProcessedImageUrl('');
    setNewTextInput('');
    onOpenChange(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Format recording time
  const formatTime = (seconds: number) => {
    return `00:${seconds.toString().padStart(2, '0')}`;
  };

  const renderSelectStep = () => (
    <div className="space-y-6">
      {!cameraCapabilities.hasCamera && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Camera not available</p>
            <p>Camera access is not available on this device or browser. You can still create stories using photos from the gallery.</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => {
            if (!cameraCapabilities.hasCamera) {
              toast.error('Camera not available on this device');
              return;
            }
            setCaptureMode('photo');
            startCamera();
          }}
          disabled={!cameraCapabilities.hasCamera}
        >
          <CameraIcon className="w-6 h-6" />
          <span className="text-sm">Camera</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => {
            if (!cameraCapabilities.hasCamera) {
              toast.error('Camera not available on this device');
              return;
            }
            if (!cameraCapabilities.supportsVideoRecording) {
              toast.error('Video recording not supported on this device');
              return;
            }
            setCaptureMode('video');
            startCamera();
          }}
          disabled={!cameraCapabilities.hasCamera || !cameraCapabilities.supportsVideoRecording}
        >
          <PlayIcon className="w-6 h-6" />
          <span className="text-sm">Video</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <PhotoIcon className="w-5 h-5" />
            Choose from Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {sampleImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageSelect(image)}
                className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-transparent hover:border-accent transition-colors"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCameraStep = () => (
    <div className="relative">
      <div className="aspect-[3/4] bg-black rounded-lg overflow-hidden relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
        />
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium">
            <Circle className="w-2 h-2 fill-current animate-pulse" />
            {formatTime(recordingTime)}
          </div>
        )}

        {/* Camera controls overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top controls */}
          <div className="absolute top-4 right-4 flex gap-2 pointer-events-auto">
            {cameraCapabilities.hasMultipleCameras && (
              <Button
                size="sm"
                variant="secondary"
                onClick={flipCamera}
                className="bg-black/50 text-white border-0 backdrop-blur-sm"
              >
                <ArrowsRightLeftIcon className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setCurrentStep('select')}
              className="bg-black/50 text-white border-0 backdrop-blur-sm"
            >
              <XMarkIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
            <div className="flex items-center gap-6">
              {captureMode === 'photo' ? (
                <Button
                  size="lg"
                  onClick={takePhoto}
                  className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-100 border-4 border-white"
                >
                  <CircleStackIcon className="w-6 h-6" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={cn(
                    "w-16 h-16 rounded-full border-4 border-white transition-all",
                    isRecording 
                      ? "bg-red-500 hover:bg-red-600" 
                      : "bg-white text-black hover:bg-gray-100"
                  )}
                >
                  {isRecording ? <StopCircleIcon className="w-6 h-6" /> : <CircleStackIcon className="w-6 h-6" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  const renderEditStep = () => (
    <div className="space-y-6">
      <div className="aspect-[3/4] bg-black rounded-lg overflow-hidden relative">
        {capturedMedia?.type === 'image' ? (
          <img
            src={processedImageUrl || capturedMedia.url}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={capturedMedia?.url}
            controls
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Text overlays preview */}
        {textOverlays.map(overlay => (
          <div
            key={overlay.id}
            className="absolute pointer-events-none"
            style={{
              left: `${(overlay.x / 720) * 100}%`,
              top: `${(overlay.y / 1280) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${overlay.rotation}deg)`,
              fontSize: `${(overlay.fontSize / 720) * 100}%`,
              color: overlay.color,
              fontWeight: overlay.fontWeight,
              textAlign: overlay.textAlign,
              backgroundColor: overlay.backgroundColor,
              padding: overlay.backgroundColor ? '4px 8px' : '0',
              borderRadius: overlay.backgroundColor ? '4px' : '0'
            }}
          >
            {overlay.text}
          </div>
        ))}
      </div>

      {/* Quick edit tools */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setCurrentStep('filters')}
        >
          <SparklesIcon className="w-4 h-4" />
          Filters
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setCurrentStep('text')}
        >
          <LanguageIcon className="w-4 h-4" />
          Text
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => toast.info('Stickers coming soon!')}
        >
          <FaceSmileIcon className="w-4 h-4" />
          Stickers
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="story-caption">Caption (optional)</Label>
        <Input
          id="story-caption"
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={100}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => setCurrentStep('select')}
        >
          Back
        </Button>
        <Button
          className="flex-1 instagram-gradient text-white border-0"
          onClick={handleShareStory}
          disabled={isLoading}
        >
          {isLoading ? 'Sharing...' : 'Share Story'}
        </Button>
      </div>
    </div>
  );

  const renderFiltersStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentStep('edit')}>
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>
        <h3 className="font-semibold">Choose Filter</h3>
      </div>
      
      <div className="aspect-[3/4] bg-black rounded-lg overflow-hidden">
        <img
          src={processedImageUrl || capturedMedia?.url}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {IMAGE_FILTERS.map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter)}
            className={cn(
              "flex-shrink-0 p-2 rounded-lg border-2 transition-colors text-center min-w-[60px]",
              selectedFilter.id === filter.id 
                ? "border-accent bg-accent/10" 
                : "border-border"
            )}
          >
            <div className="text-xs font-medium">{filter.name}</div>
          </button>
        ))}
      </div>

      <Button
        className="w-full instagram-gradient text-white border-0"
        onClick={() => setCurrentStep('edit')}
      >
        Apply Filter
      </Button>
    </div>
  );

  const renderTextStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentStep('edit')}>
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>
        <h3 className="font-semibold">Add Text</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-input">Enter text</Label>
          <Input
            id="text-input"
            placeholder="Type your text..."
            value={newTextInput}
            onChange={(e) => setNewTextInput(e.target.value)}
            maxLength={50}
          />
        </div>

        <Button
          className="w-full instagram-gradient text-white border-0"
          onClick={addTextOverlay}
          disabled={!newTextInput.trim()}
        >
          Add Text
        </Button>
      </div>

      {textOverlays.length > 0 && (
        <div className="space-y-2">
          <Label>Current Text Overlays</Label>
          <div className="space-y-2">
            {textOverlays.map(overlay => (
              <div key={overlay.id} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm truncate flex-1">{overlay.text}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTextOverlay(overlay.id)}
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-md max-h-[95vh] overflow-y-auto",
        currentStep === 'camera' && "max-w-sm"
      )}>
        <DialogHeader>
          <DialogTitle className="text-center">
            {currentStep === 'select' && 'Create Story'}
            {currentStep === 'camera' && `${captureMode === 'photo' ? 'Take Photo' : 'Record Video'}`}
            {currentStep === 'edit' && 'Edit Story'}
            {currentStep === 'filters' && 'Choose Filter'}
            {currentStep === 'text' && 'Add Text'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {currentStep === 'select' && renderSelectStep()}
          {currentStep === 'camera' && renderCameraStep()}
          {currentStep === 'edit' && renderEditStep()}
          {currentStep === 'filters' && renderFiltersStep()}
          {currentStep === 'text' && renderTextStep()}
          
          {currentStep === 'select' && (
            <div className="flex justify-center pt-2">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          )}
        </div>
        
        {/* Hidden canvas for image processing */}
        <canvas ref={storyEditor.canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}