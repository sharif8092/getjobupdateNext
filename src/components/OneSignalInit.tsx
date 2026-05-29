'use client';

import { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalInit() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initOneSignal = async () => {
      try {
        await OneSignal.init({
          appId: "5de42404-7229-4222-a111-bfaa3ddaf6c3",
          allowLocalhostAsSecureOrigin: true, // For local development
          notifyButton: {
            enable: true,
          },
        });
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing OneSignal:', error);
      }
    };

    if (!initialized) {
      initOneSignal();
    }
  }, [initialized]);

  return null;
}
