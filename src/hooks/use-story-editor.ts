import { useRef, useEffect } from 'react';

export interface ImageFilter {
  id: string;
  name: string;
  css: string;
}

export const IMAGE_FILTERS: ImageFilter[] = [
  { id: 'none', name: 'Original', css: '' },
  { id: 'sepia', name: 'Sepia', css: 'sepia(100%)' },
  { id: 'grayscale', name: 'B&W', css: 'grayscale(100%)' },
  { id: 'vintage', name: 'Vintage', css: 'sepia(50%) contrast(1.2) brightness(1.1)' },
  { id: 'warm', name: 'Warm', css: 'hue-rotate(15deg) saturate(1.2) brightness(1.1)' },
  { id: 'cool', name: 'Cool', css: 'hue-rotate(-15deg) saturate(1.1) brightness(1.05)' },
  { id: 'dramatic', name: 'Dramatic', css: 'contrast(1.5) brightness(0.9) saturate(1.3)' },
  { id: 'soft', name: 'Soft', css: 'blur(0.5px) brightness(1.1) contrast(0.9)' }
];

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
  backgroundColor?: string;
  rotation: number;
}

export interface UseStoryEditorOptions {
  width: number;
  height: number;
}

export function useStoryEditor({ width, height }: UseStoryEditorOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const applyFilterToImage = (
    imageUrl: string,
    filter: ImageFilter,
    textOverlays: TextOverlay[] = []
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        reject(new Error('Canvas not available'));
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Apply filter to context
        ctx.filter = filter.css;

        // Draw image to fit canvas while maintaining aspect ratio
        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;

        let drawWidth, drawHeight, drawX, drawY;

        if (imgAspect > canvasAspect) {
          // Image is wider than canvas
          drawHeight = height;
          drawWidth = height * imgAspect;
          drawX = (width - drawWidth) / 2;
          drawY = 0;
        } else {
          // Image is taller than canvas
          drawWidth = width;
          drawHeight = width / imgAspect;
          drawX = 0;
          drawY = (height - drawHeight) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

        // Reset filter for text
        ctx.filter = 'none';

        // Add text overlays
        textOverlays.forEach(overlay => {
          ctx.save();
          
          // Set text properties
          ctx.font = `${overlay.fontWeight} ${overlay.fontSize}px Inter, sans-serif`;
          ctx.fillStyle = overlay.color;
          ctx.textAlign = overlay.textAlign;
          ctx.textBaseline = 'middle';

          // Apply rotation
          const centerX = overlay.x;
          const centerY = overlay.y;
          ctx.translate(centerX, centerY);
          ctx.rotate((overlay.rotation * Math.PI) / 180);

          // Draw background if specified
          if (overlay.backgroundColor) {
            const textMetrics = ctx.measureText(overlay.text);
            const padding = 8;
            const bgWidth = textMetrics.width + padding * 2;
            const bgHeight = overlay.fontSize + padding * 2;
            
            ctx.fillStyle = overlay.backgroundColor;
            ctx.fillRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight);
            ctx.fillStyle = overlay.color;
          }

          // Draw text
          ctx.fillText(overlay.text, 0, 0);
          
          ctx.restore();
        });

        // Convert canvas to blob URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/jpeg', 0.9);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = imageUrl;
    });
  };

  const downloadImage = (imageUrl: string, filename: string = 'story.jpg') => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    canvasRef,
    applyFilterToImage,
    downloadImage
  };
}