'use client';

import { useEffect } from 'react';

function loadOneSignal() {
  if (typeof window === 'undefined') return;
  if (document.getElementById('onesignal-script')) return;

  const script = document.createElement('script');
  script.id = 'onesignal-script';
  script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
  script.async = true;
  document.head.appendChild(script);

  // @ts-ignore
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  // @ts-ignore
  window.OneSignalDeferred.push(async function(OneSignal: any) {
    await OneSignal.init({
      appId: "5de42404-7229-4222-a111-bfaa3ddaf6c3",
      allowLocalhostAsSecureOrigin: true,
      notifyButton: {
        enable: true,
      },
    });

    setTimeout(async () => {
      try {
        if (OneSignal.Notifications.permission === true || OneSignal.Notifications.permission === false) {
          return;
        }
        if (OneSignal.Slidedown && typeof OneSignal.Slidedown.promptPush === 'function') {
          await OneSignal.Slidedown.promptPush();
        } else if (OneSignal.Notifications && typeof OneSignal.Notifications.requestPermission === 'function') {
          await OneSignal.Notifications.requestPermission();
        }
      } catch (e) {
        console.error("Auto prompt error:", e);
      }
    }, 3000);
  });
}

export default function OneSignalInit() {
  useEffect(() => {
    // Delay OneSignal loading by 5s after page load to keep it off the critical path
    const onIdle = () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => setTimeout(loadOneSignal, 2000));
      } else {
        setTimeout(loadOneSignal, 5000);
      }
    };

    if (document.readyState === 'complete') {
      onIdle();
    } else {
      window.addEventListener('load', onIdle, { once: true });
    }
  }, []);

  return null;
}
