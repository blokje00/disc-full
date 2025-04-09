import { useState, useEffect } from 'react';
import '../styles/InstallPrompt.css';

const InstallPrompt = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the default browser prompt
      event.preventDefault();
      // Save the event for later use
      setInstallPromptEvent(event);
      // Show our custom prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle the install button click
  const handleInstallClick = () => {
    if (!installPromptEvent) return;

    // Show the browser's install prompt
    installPromptEvent.prompt();

    // Wait for the user to respond to the prompt
    installPromptEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsAppInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the saved prompt event
      setInstallPromptEvent(null);
      setShowPrompt(false);
    });
  };

  // Don't show anything if the app is already installed or if we don't have an install event
  if (isAppInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <h3>Installeer de Mindfulness Coach App</h3>
        <p>Installeer deze app op je apparaat voor een betere ervaring en offline toegang.</p>
        <div className="install-prompt-buttons">
          <button className="install-button" onClick={handleInstallClick}>
            Installeren
          </button>
          <button className="dismiss-button" onClick={() => setShowPrompt(false)}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
