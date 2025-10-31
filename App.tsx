
import React, { useState } from 'react';
import { BrandingProvider, useBranding } from './hooks/useBranding';
import OrganizerSetup from './components/OrganizerSetup';
import GuestExperience from './components/GuestExperience';
import Header from './components/Header';
import { Card } from './components/common/Card';
import { Button } from './components/common/Button';
import { SparklesIcon } from './components/icons/SparklesIcon';

enum AppView {
  HOME,
  ORGANIZER_SETUP,
  GUEST_EXPERIENCE,
}

const App: React.FC = () => {
  return (
    <BrandingProvider>
      <Main />
    </BrandingProvider>
  );
};

const Main: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const { brandingConfig } = useBranding();

  const renderView = () => {
    switch (view) {
      case AppView.ORGANIZER_SETUP:
        return <OrganizerSetup onPublish={() => setView(AppView.GUEST_EXPERIENCE)} />;
      case AppView.GUEST_EXPERIENCE:
        return <GuestExperience onReset={() => setView(AppView.HOME)} />;
      case AppView.HOME:
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to FrameLink</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Create and share branded photos for your events. Choose your role to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Card className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">I'm an Organizer</h3>
                <p className="text-gray-600 mb-4">Set up your event branding, upload a frame, and create a unique photo experience.</p>
                <Button onClick={() => setView(AppView.ORGANIZER_SETUP)}>
                  Create Event
                </Button>
              </Card>
              <Card className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">I'm a Guest</h3>
                <p className="text-gray-600 mb-4">Join an event, take a photo with a custom frame, and download your branded picture.</p>
                <Button onClick={() => setView(AppView.GUEST_EXPERIENCE)} disabled={!brandingConfig.frameUrl}>
                  <SparklesIcon className="w-5 h-5 mr-2"/>
                  Join Experience
                </Button>
                {!brandingConfig.frameUrl && <p className="text-sm text-gray-500 mt-2">An organizer must set up an event first.</p>}
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {renderView()}
      </main>
    </div>
  );
};

export default App;
