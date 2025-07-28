import { useState, useEffect } from 'react';

export interface CameraCapabilities {
  hasCamera: boolean;
  hasMultipleCameras: boolean;
  supportsFrontCamera: boolean;
  supportsBackCamera: boolean;
  supportsVideoRecording: boolean;
  permissionStatus: 'unknown' | 'granted' | 'denied' | 'prompt';
}

export function useCameraCapabilities() {
  const [capabilities, setCapabilities] = useState<CameraCapabilities>({
    hasCamera: false,
    hasMultipleCameras: false,
    supportsFrontCamera: false,
    supportsBackCamera: false,
    supportsVideoRecording: false,
    permissionStatus: 'unknown'
  });

  useEffect(() => {
    const checkCameraCapabilities = async () => {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCapabilities(prev => ({ ...prev, hasCamera: false }));
        return;
      }

      try {
        // Get list of available devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        const hasCamera = videoDevices.length > 0;
        const hasMultipleCameras = videoDevices.length > 1;
        
        // Check for front and back cameras
        const supportsFrontCamera = videoDevices.some(device => 
          device.label.toLowerCase().includes('front') || 
          device.label.toLowerCase().includes('user') ||
          device.label.toLowerCase().includes('selfie')
        );
        
        const supportsBackCamera = videoDevices.some(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );

        // Check video recording support
        const supportsVideoRecording = typeof MediaRecorder !== 'undefined' && 
          MediaRecorder.isTypeSupported('video/webm;codecs=vp9');

        // Check permissions if camera is available
        let permissionStatus: CameraCapabilities['permissionStatus'] = 'unknown';
        
        if (hasCamera && navigator.permissions) {
          try {
            const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
            permissionStatus = permission.state as CameraCapabilities['permissionStatus'];
          } catch (error) {
            // Permission API might not be supported
            permissionStatus = 'unknown';
          }
        }

        setCapabilities({
          hasCamera,
          hasMultipleCameras,
          supportsFrontCamera: supportsFrontCamera || hasMultipleCameras,
          supportsBackCamera: supportsBackCamera || hasMultipleCameras,
          supportsVideoRecording,
          permissionStatus
        });

      } catch (error) {
        console.error('Error checking camera capabilities:', error);
        setCapabilities(prev => ({ 
          ...prev, 
          hasCamera: false,
          permissionStatus: 'denied' 
        }));
      }
    };

    checkCameraCapabilities();
  }, []);

  const requestCameraPermission = async (): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      // Stop the stream immediately as we just wanted to check permission
      stream.getTracks().forEach(track => track.stop());
      
      setCapabilities(prev => ({ ...prev, permissionStatus: 'granted' }));
      return true;
    } catch (error) {
      setCapabilities(prev => ({ ...prev, permissionStatus: 'denied' }));
      return false;
    }
  };

  return {
    ...capabilities,
    requestCameraPermission
  };
}