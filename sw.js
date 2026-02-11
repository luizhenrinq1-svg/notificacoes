/**
 * Service Worker App 2 - Notificações
 * Correção: Imports do Firebase e Forçar Ativação (SkipWaiting)
 */

// 1. Imports Obrigatórios do Firebase (Mesma versão do Index.html)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// 2. Configuração (Tem que ser igual à do Index.html)
const firebaseConfig = {
  apiKey: "AIzaSyCn89LRlH1lksZ811--jb2jlB2iZS5NH1s",
  authDomain: "pontoweb-dc8dd.firebaseapp.com",
  projectId: "pontoweb-dc8dd",
  storageBucket: "pontoweb-dc8dd.firebasestorage.app",
  messagingSenderId: "465750633035",
  appId: "1:465750633035:web:282efd14b807e2a3823bce"
};

// 3. Inicializa Firebase no Background
try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  console.log('[SW] Firebase inicializado com sucesso.');

  // Handler de mensagens em segundo plano
  messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Mensagem recebida no background:', payload);
    
    const notificationTitle = payload.data.title || payload.notification?.title || 'Nova Notificação';
    const notificationOptions = {
      body: payload.data.body || payload.notification?.body || '',
      icon: 'https://github.com/luizhenrinq1-svg/testepontoweb/blob/main/Icone.png?raw=true',
      vibrate: [200, 100, 200],
      data: payload.data
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (e) {
  console.error('[SW] Erro ao inicializar Firebase:', e);
}

// 4. Instalação e Ativação Imediata (Resolve o problema do "Aguardando SW Ready")
self.addEventListener('install', (event) => {
  console.log('[SW] Instalado.');
  // Força o SW a assumir o controle imediatamente, sem esperar fechar a aba
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Ativado.');
  // Reivindica o controle de todas as abas abertas imediatamente
  event.waitUntil(clients.claim());
});

// 5. Clique na Notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Tenta focar na aba aberta ou abrir o app
  event.waitUntil(
    clients.matchAll({type: 'window'}).then( windowClients => {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./index.html');
    })
  );
});
