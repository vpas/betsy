const APPLICATION_SERVER_PUBLIC_KEY = 'BD6ZoPSDZZrIgJtvm165IwgWLg9aXSYy-LrCwP9yiQEJ9CaVL9K8HQtzHmbjzrWAGMeWMDqTgNDKwmy92i7T3FY';

export class NotificationsManager {
  // context;
  // swReg;

  constructor(context) {
    this.context = context;
    context.updateContext(c => {
      c.notificationsManager = this;
      c.subscribeButtonEnabled = false;
      c.isSubscribed = false;
      c.isNotificationsSupported = false;
    });
  }

  async init() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      console.log('Service Worker and Push are supported');
      try {
        this.swReg = await navigator.serviceWorker.register('sw.js');
        console.log('Service Worker is registered', this.swReg);
        const subscription = await this.swReg.pushManager.getSubscription();
        const isSubscribed = !(subscription === null);

        if (isSubscribed) {
          console.log('User IS subscribed.');
        } else {
          console.log('User is NOT subscribed.');
        }

        this.context.updateContext(c => {
          c.subscribeButtonEnabled = true;
          c.isSubscribed = isSubscribed;
          c.isNotificationsSupported = true;
        });
      } catch (error) {
        console.error('Service Worker Error', error);
      }
    } else {
      console.warn('Push messaging is not supported');
      this.context.updateContext(c => {
        c.isNotificationsSupported = false;
        c.subscribeButtonEnabled = true;
      });
    }
  }

  async subscribeUser() {
    this.context.updateContext(c => {
      c.subscribeButtonEnabled = false;
    });
    const applicationServerKey = urlB64ToUint8Array(APPLICATION_SERVER_PUBLIC_KEY);
    try {
      const subscription = await this.swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });
      console.log('User is subscribed.');

      await this.#updateSubscriptionOnServer(subscription);

      this.context.updateContext(c => {
        c.subscribeButtonEnabled = true;
        c.isSubscribed = true;
      });
    } catch (error) {
      console.error('Failed to subscribe the user: ', error);
      this.context.updateContext(c => {
        c.subscribeButtonEnabled = true;
      });
    }
  }

  async unsubscribeUser() {
    try {
      const subscription = await this.swReg.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('User is unsubscribed.');

        await this.#updateSubscriptionOnServer(null);

        this.context.updateContext(c => {
          c.subscribeButtonEnabled = true;
          c.isSubscribed = false;
        });
      }
    } catch (error) {
      console.log('Error unsubscribing', error);
      this.context.updateContext(c => {
        c.subscribeButtonEnabled = true;
      });
    }
  }

  async #updateSubscriptionOnServer(subscription) {
    await this.context.axios.post(`users/${this.context.userId}/sub`, subscription);
  }
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}