// service-worker.js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'START_BACKGROUND_SYNC') {
    startBackgroundSync(event.data.userEmail);
  }
});

function startBackgroundSync(userEmail) {
  setInterval(() => {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'UPDATE_LOCATION',
          userEmail: userEmail
        });
      });
    });
  }, 5000);
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'updateLocation') {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'UPDATE_LOCATION'
          });
        });
      })
    );
  }
});
