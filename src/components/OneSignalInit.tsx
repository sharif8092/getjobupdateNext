'use client';

import Script from 'next/script';
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
  return (
    <Script 
      src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" 
      strategy="lazyOnload"
      onLoad={() => {
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
      }}
    />
  );
}
