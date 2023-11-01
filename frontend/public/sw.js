'use strict';
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const data = JSON.parse(event.data.text());
  const title = 'Betsy';
  const options = {
    body: data.body
  };

  event.waitUntil(self.registration.showNotification(title, options));
});