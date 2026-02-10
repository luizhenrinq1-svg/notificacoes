/**
 * Service Worker para PAGINA DE NOTIFICAÇÕES
 * Versão: Suporte a Alerta Crítico (Vibração Intensa)
 */
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCn89LRlH1lksZ811--jb2jlB2iZS5NH1s",
  authDomain: "pontoweb-dc8dd.firebaseapp.com",
  projectId: "pontoweb-dc8dd",
  storageBucket: "pontoweb-dc8dd.firebasestorage.app",
  messagingSenderId: "465750633035",
  appId: "1:465750633035:web:282efd14b807e2a3823bce"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Push Recebido:', payload);
  
  const title = payload.data?.title || "PontoWeb";
  const body = payload.data?.body || "Atenção ao horário!";
  const type = payload.data?.type || "normal"; // 'normal' ou 'critical'

  // Configuração padrão
  let vibratePattern = [500, 200, 500];
  let tag = 'ponto-alert';

  // Se for CRÍTICO (15 min atrasado), vibração intensa e longa
  if (type === 'critical') {
     // Vibra 2s, para 1s, repete varias vezes (simulando "continuo")
     vibratePattern = [
       2000, 1000, 2000, 1000, 2000, 1000, 
       2000, 1000, 2000, 1000, 2000, 1000,
       2000, 1000, 2000, 1000, 2000, 1000
     ];
     tag = 'ponto-critical';
  }

  const notificationOptions = {
    body: body,
    icon: 'https://cdn-icons-png.flaticon.com/512/2983/2983818.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2983/2983818.png',
    vibrate: vibratePattern,
    renotify: true, // Garante que toca mesmo se ja tiver notificação
    tag: tag,
    requireInteraction: true, // Exige que o usuário feche
    data: {
      url: 'https://luizhenrinq1-svg.github.io/pontowebtestets/' 
    }
  };

  return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || 'https://luizhenrinq1-svg.github.io/pontowebtestets/';

  event.waitUntil(
    clients.matchAll({type: 'window', includeUncontrolled: true}).then( windowClients => {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.includes("pontowebtestets") && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('install', (event) => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
