
import React, { useState, useEffect } from 'react';
import { useBranding } from '../hooks/useBranding';
import { BrandingConfig } from '../types';
import { Button } from './common/Button';
import { FileUpload } from './common/FileUpload';
import { Card } from './common/Card';

interface OrganizerSetupProps {
  onPublish: () => void;
}

const OrganizerSetup: React.FC<OrganizerSetupProps> = ({ onPublish }) => {
  const { brandingConfig, setBrandingConfig } = useBranding();
  const [localConfig, setLocalConfig] = useState<BrandingConfig>(brandingConfig);
  const [logoPreview, setLogoPreview] = useState<string | null>(brandingConfig.logoUrl);
  const [framePreview, setFramePreview] = useState<string | null>(brandingConfig.frameUrl);

  useEffect(() => {
    // Clean up object URLs on component unmount
    return () => {
      if (logoPreview && logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
      if (framePreview && framePreview.startsWith('blob:')) URL.revokeObjectURL(framePreview);
    };
  }, [logoPreview, framePreview]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: 'logoUrl' | 'frameUrl', file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalConfig(prev => ({ ...prev, [name]: url }));
      if (name === 'logoUrl') setLogoPreview(url);
      if (name === 'frameUrl') setFramePreview(url);
    } else {
      setLocalConfig(prev => ({ ...prev, [name]: null }));
      if (name === 'logoUrl') setLogoPreview(null);
      if (name === 'frameUrl') setFramePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBrandingConfig(localConfig);
    onPublish();
  };

  const colors = ['#4f46e5', '#db2777', '#16a34a', '#d97706', '#0891b2', '#6d28d9'];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-center mb-6">Create Your Branded Experience</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">1. Event Details</h3>
              <div>
                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  name="eventName"
                  id="eventName"
                  value={localConfig.eventName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">2. Branding</h3>
              <FileUpload
                label="Upload Logo (Optional)"
                onFileSelect={(file) => handleFileChange('logoUrl', file)}
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setLocalConfig(prev => ({ ...prev, primaryColor: color }))}
                      className={`w-10 h-10 rounded-full border-2 transition-transform duration-150 ${localConfig.primaryColor === color ? 'border-primary scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </Card>
             <Card>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">3. Frame Overlay</h3>
              <FileUpload
                label="Upload Frame Image (.png)"
                accept="image/png"
                onFileSelect={(file) => handleFileChange('frameUrl', file)}
                required
              />
               <p className="text-xs text-gray-500 mt-2">Use a transparent PNG with the same aspect ratio as your target photos for best results.</p>
            </Card>
          </div>

          {/* Right Column: Preview */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center md:text-left">Live Preview</h3>
            <div className="relative w-full aspect-square bg-gray-200 rounded-lg shadow-inner overflow-hidden flex items-center justify-center">
              <img src="https://picsum.photos/500/500" alt="Placeholder" className="w-full h-full object-cover" />
              {framePreview && <img src={framePreview} alt="Frame Preview" className="absolute inset-0 w-full h-full object-contain" />}
              {logoPreview && (
                <div className="absolute top-4 left-4 bg-white/80 p-2 rounded-md">
                  <img src={logoPreview} alt="Logo Preview" className="h-10 w-auto" />
                </div>
              )}
               <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-md text-center">
                  <p className="font-bold" style={{color: localConfig.primaryColor}}>{localConfig.eventName}</p>
                </div>
            </div>
             <Button type="submit" className="w-full" disabled={!localConfig.frameUrl}>
              Publish & Launch Guest Experience
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrganizerSetup;
