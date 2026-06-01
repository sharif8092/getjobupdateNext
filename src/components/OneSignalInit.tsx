'use client';

import { useEffect } from 'react';

export default function OneSignalInit() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Avoid initializing twice
      if (document.getElementById('onesignal-script')) return;

      const script = document.createElement('script');
      script.id = 'onesignal-script';
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
      script.async = true;
      document.head.appendChild(script);

      // @ts-ignore
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      // @ts-ignore
      window.OneSignalDeferred.push(async function(OneSignal) {
        await OneSignal.init({
          appId: "5de42404-7229-4222-a111-bfaa3ddaf6c3",
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: true,
          },
        });
        
        // Wait 3 seconds, then show the Slidedown (HTML) prompt
        // Native prompts are blocked by browsers on page load without user interaction
        setTimeout(async () => {
          try {
            // Check if already subscribed or blocked
            if (OneSignal.Notifications.permission === true || OneSignal.Notifications.permission === false) {
              return; // Do nothing if already subscribed or blocked
            }

            if (OneSignal.Slidedown && typeof OneSignal.Slidedown.promptPush === 'function') {
              await OneSignal.Slidedown.promptPush();
            } else if (OneSignal.Notifications && typeof OneSignal.Notifications.requestPermission === 'function') {
              await OneSignal.Notifications.requestPermission();
            }
          } catch (e /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
            console.error("Auto prompt error:", e);
          }
        }, 3000);
      });
    }
  }, []);

  return null;
}
