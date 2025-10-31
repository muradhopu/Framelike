
import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { BrandingConfig } from '../types';

interface BrandingContextType {
  brandingConfig: BrandingConfig;
  setBrandingConfig: (config: BrandingConfig) => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

const initialConfig: BrandingConfig = {
  eventName: 'My Awesome Event',
  logoUrl: null,
  primaryColor: '#4f46e5',
  frameUrl: null,
};

export const BrandingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brandingConfig, setBrandingConfigState] = useState<BrandingConfig>(initialConfig);

  const setBrandingConfig = useCallback((config: BrandingConfig) => {
    setBrandingConfigState(config);
    document.documentElement.style.setProperty('--primary-color', config.primaryColor);
  }, []);

  const value = useMemo(() => ({ brandingConfig, setBrandingConfig }), [brandingConfig, setBrandingConfig]);

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = (): BrandingContextType => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
