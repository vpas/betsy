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

async function getWindowClient() {
  const allClients = Array.from(await clients.matchAll());
  console.log(`[Service Worker] clients.length: ${allClients.length}`);
  if (allClients.length === 0) {
    const client = await clients.openWindow("/");
    console.log("after await clients.openWindow");
    return client;
  } else {
    return allClients[0];
  }
}

async function postMessage(data) {
  try {
    const client = await getWindowClient();
    console.log(`[Service Worker] postMessage data: ${JSON.stringify(data)}`);
    client.postMessage(data);
    await client.focus();
  } catch (e) {
    console.log(e);
  }
}

async function openUrl(url) {
  const allClients = Array.from(await clients.matchAll());
  console.log(`[Service Worker] clients.length: ${allClients.length}`);
  if (allClients.length === 0) {
    const client = await clients.openWindow(url);
    console.log("after await clients.openWindow");
  } else {
    const client = await allClients[0].navigate(url);
    console.log("after await navigate");
    await client.focus();
  }
}

self.addEventListener("notificationclick", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const taskId = event.notification.data.task_id;
        await openUrl(`/?task_id=${taskId}`);
      } catch (e) {
        console.log(e);
      }
    })(),
  );
  event.notification.close();
});