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
    self.registration.sync.register('updateLocation')
      .then(() => {
        console.log('Background sync registered');
      })
      .catch(err => {
        console.error('Background sync registration failed:', err);
      });
  }, 5000);
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'updateLocation') {
    event.waitUntil(updateLocation());
  }
});

function updateLocation() {
  return new Promise((resolve, reject) => {
    if ('geolocation' in self) {
      self.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Aqui você deve implementar a lógica para enviar a localização para o Firebase
          // Você precisará importar e configurar o Firebase aqui
          console.log(`Localização atualizada: ${latitude}, ${longitude}`);
          resolve();
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      reject(new Error('Geolocation não está disponível'));
    }
  });
}
