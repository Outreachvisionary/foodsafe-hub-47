
import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Slider } from '@/components/ui/slider';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  aspectRatio?: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ 
  image, 
  onCropComplete,
  aspectRatio = 1 
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create a cropped image when croppedAreaPixels changes
  useEffect(() => {
    if (croppedAreaPixels) {
      createCroppedImage(image, croppedAreaPixels);
    }
  }, [croppedAreaPixels, image]);

  const createCroppedImage = async (imageSrc: string, pixelCrop: any) => {
    const image = new Image();
    image.src = imageSrc;
    
    await new Promise((resolve) => {
      image.onload = resolve;
    });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return;
    }
    
    // Set canvas dimensions to match the cropped area
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    
    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    
    // Convert canvas to base64 string
    const base64Image = canvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(base64Image);
  };

  return (
    <div className="space-y-4">
      <div className="relative h-60 overflow-hidden rounded-md">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteCallback}
          onZoomChange={(value) => setZoom(value)}
          classes={{
            containerClassName: 'rounded-md',
            cropAreaClassName: 'rounded-full border-4 border-white',
          }}
        />
      </div>
      
      <div className="pt-4">
        <label className="block text-sm font-medium mb-2">
          Zoom
        </label>
        <Slider
          value={[zoom]}
          min={1}
          max={3}
          step={0.1}
          onValueChange={onZoomChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ImageCropper;
