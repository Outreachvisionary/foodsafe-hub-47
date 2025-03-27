
import React, { useEffect } from 'react';

interface ConversionTrackerProps {
  action: string;
}

const ConversionTracker: React.FC<ConversionTrackerProps> = ({ action }) => {
  useEffect(() => {
    // Log the conversion action
    console.log(`Tracking conversion action: ${action}`);
    
    // This is where you would integrate with analytics services
    // like Google Analytics, Mixpanel, or your own backend
    const trackEvent = () => {
      // Example of tracking event to analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as Window & typeof globalThis & { gtag: any }).gtag('event', action, {
          event_category: 'conversion',
          event_label: 'landing_page',
          value: 1
        });
      }
    };

    trackEvent();
  }, [action]);

  // This component doesn't render anything visible
  return null;
};

export default ConversionTracker;
