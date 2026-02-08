/**
 * Service Worker para PAGINA DE NOTIFICAÇÕES (GitHub Pages /notificacoes)
 * Função Principal: Receber o Push e Abrir o App Principal
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

// === LÓGICA DE BACKGROUND ===
messaging.onBackgroundMessage((payload) => {
  console.log('[Notificações SW] Recebido:', payload);
  
  const title = payload.data?.title || "Lembrete PontoWeb";
  const body = payload.data?.body || "Hora de bater ponto!";

  const notificationOptions = {
    body: body,
    icon: 'https://cdn-icons-png.flaticon.com/512/2983/2983818.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2983/2983818.png',
    vibrate: [500, 200, 500, 200, 500, 200, 500], // Vibração forte
    renotify: true,
    tag: 'ponto-alert',
    requireInteraction: true,
    data: {
      // ⚠️ O PULO DO GATO:
      // Quando clicar aqui, vai abrir o OUTRO repositório (o do App)
      url: 'https://luizhenrinq1-svg.github.io/pontowebtestets/' 
    }
  };

  return self.registration.showNotification(title, notificationOptions);
});

// === AO CLICAR NA NOTIFICAÇÃO ===
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // URL do App Principal
  const urlToOpen = event.notification.data?.url || 'https://luizhenrinq1-svg.github.io/pontowebtestets/';

  event.waitUntil(
    clients.matchAll({type: 'window', includeUncontrolled: true}).then( windowClients => {
      // Tenta achar a aba do APP aberta
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.includes("pontowebtestets") && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não achar, abre uma nova
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('install', (event) => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
