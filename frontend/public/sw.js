'use strict';

self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const data = JSON.parse(event.data.text());
  const title = data.title;
  const options = {
    body: data.body,
    data: data,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.waitUntil(
    (async () => {
      const allClients = Array.from(await clients.matchAll());
      console.log(`[Service Worker] clients.length: ${allClients.length}`);
      if (allClients.length > 0) {
        const client = allClients[0];
        client.postMessage(event.notification.data);
      }
    })(),
  );
});