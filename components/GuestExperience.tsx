import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useBranding } from '../hooks/useBranding';
import { Button } from './common/Button';
import { CameraIcon } from './icons/CameraIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { UploadIcon } from './icons/UploadIcon';
import { Card } from './common/Card';

interface GuestExperienceProps {
  onReset: () => void;
}

const GuestExperience: React.FC<GuestExperienceProps> = ({ onReset }) => {
  const { brandingConfig } = useBranding();
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<{png: string; jpg: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyFrame = useCallback(() => {
    if (!userPhoto || !brandingConfig.frameUrl || !canvasRef.current) return;

    setIsLoading(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsLoading(false);
      return;
    }

    const userImage = new Image();
    userImage.crossOrigin = 'anonymous';
    userImage.src = userPhoto;

    const frameImage = new Image();
    frameImage.crossOrigin = 'anonymous';
    frameImage.src = brandingConfig.frameUrl;

    let imagesLoaded = 0;
    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        canvas.width = userImage.naturalWidth;
        canvas.height = userImage.naturalHeight;

        ctx.drawImage(userImage, 0, 0);
        ctx.drawImage(frameImage, 0, 0, userImage.naturalWidth, userImage.naturalHeight);
        
        const png = canvas.toDataURL('image/png');
        const jpg = canvas.toDataURL('image/jpeg', 0.9);
        setGeneratedImages({ png, jpg });
        setIsLoading(false);
      }
    };
    userImage.onload = onImageLoad;
    frameImage.onload = onImageLoad;
    userImage.onerror = () => setIsLoading(false);
    frameImage.onerror = () => setIsLoading(false);

  }, [userPhoto, brandingConfig.frameUrl]);

  useEffect(() => {
    if (userPhoto) {
      applyFrame();
    }
  }, [userPhoto, applyFrame]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGeneratedImages(null);
      setUserPhoto(URL.createObjectURL(file));
    }
  };
  
  const triggerCamera = () => {
    fileInputRef.current?.setAttribute('capture', 'user');
    fileInputRef.current?.click();
  };

  const triggerUpload = () => {
    fileInputRef.current?.removeAttribute('capture');
    fileInputRef.current?.click();
  };
  
  const reset = () => {
    setUserPhoto(null);
    setGeneratedImages(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  if (!brandingConfig.frameUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Experience Not Ready</h2>
          <p className="text-gray-600 mb-6">An event organizer hasn't published a frame yet. Please try again later.</p>
          <Button onClick={onReset}>Go to Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
       <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden"></canvas>
      
      {generatedImages ? (
         <Card>
          <h2 className="text-3xl font-bold mb-4">Your Photo is Ready!</h2>
          <img src={generatedImages.png} alt="Branded" className="rounded-lg shadow-lg mx-auto mb-6" />
           <div className="space-y-4">
            <a href={generatedImages.png} download={`${brandingConfig.eventName.replace(/\s/g, '_')}_photo.png`}>
              <Button className="w-full sm:w-auto">
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download PNG (High Quality)
              </Button>
            </a>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={generatedImages.jpg} download={`${brandingConfig.eventName.replace(/\s/g, '_')}_photo.jpg`}>
                  <Button variant="secondary" className="w-full sm:w-auto text-sm px-4 py-2">
                    Download JPG (Smaller)
                  </Button>
                </a>
                <Button onClick={reset} variant="secondary" className="w-full sm:w-auto text-sm px-4 py-2">
                  Take Another
                </Button>
            </div>
          </div>
         </Card>
      ) : (
        <Card>
          {brandingConfig.logoUrl && <img src={brandingConfig.logoUrl} alt="Event Logo" className="h-16 mx-auto mb-4"/>}
          <h2 className="text-3xl font-bold mb-2">{brandingConfig.eventName}</h2>
          <p className="text-gray-600 mb-6">Take a photo or upload one to apply the custom brand frame.</p>

          <div className="relative w-full aspect-square bg-gray-200 rounded-lg shadow-inner overflow-hidden flex items-center justify-center mb-6 border-dashed border-2 border-gray-300">
            {isLoading ? (
               <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600">Applying frame...</p>
               </div>
            ) : (
              <div className="text-gray-500">
                <CameraIcon className="w-16 h-16 mx-auto mb-2"/>
                <p>Your photo will appear here</p>
              </div>
            )}
             
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={triggerCamera} className="w-full sm:w-auto">
              <CameraIcon className="w-5 h-5 mr-2" />
              Take Photo
            </Button>
            <Button onClick={triggerUpload} variant="secondary" className="w-full sm:w-auto">
              <UploadIcon className="w-5 h-5 mr-2" />
              Upload Image
            </Button>
          </div>
        </Card>
      )}
       <button onClick={onReset} className="mt-8 text-sm text-gray-500 hover:text-primary transition">
            &larr; Back to Home
       </button>
    </div>
  );
};

export default GuestExperience;