'use client';

import Script from 'next/script';

export default function OneSignalInit() {
  return (
    <>
      <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="afterInteractive" />
      <Script id="onesignal-init" strategy="afterInteractive">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          window.OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: "5de42404-7229-4222-a111-bfaa3ddaf6c3",
              allowLocalhostAsSecureOrigin: true,
              notifyButton: {
                enable: true,
              },
            });
            
            // Wait a few seconds before showing prompt to not annoy users immediately
            setTimeout(async () => {
              if (OneSignal.Notifications && typeof OneSignal.Notifications.requestPermission === 'function') {
                  await OneSignal.Notifications.requestPermission();
              } else if (OneSignal.Slidedown && typeof OneSignal.Slidedown.promptPush === 'function') {
                  await OneSignal.Slidedown.promptPush();
              }
            }, 3000);
          });
        `}
      </Script>
    </>
  );
}
