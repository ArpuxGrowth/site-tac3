// Função para coletar cookies do Facebook
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Capturar clique no botão "Entre em contato"
  document.querySelector('a.button-light[href^="#form"]').addEventListener('click', function (e) {
    // Coletar dados automáticos
    const fbc = getCookie('_fbc'); // Cookie de ID de clique
    const fbp = getCookie('_fbp'); // Cookie de ID do navegador
    const userAgent = navigator.userAgent; // User Agent
    const eventTime = Math.floor(Date.now() / 1000); // Timestamp em segundos

    // Enviar dados para o backend
    fetch('/api/enviar-evento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_name: 'Lead',
        event_time: eventTime,
        event_source_url: window.location.href,
        action_source: 'website',
        user_data: {
          fbc: fbc || '',
          fbp: fbp || '',
          client_user_agent: userAgent,
          em: [], // Array vazio se não tiver email
          ph: [], // Array vazio se não tiver telefone
        },
      }),
    })
      .then(response => response.json())
      .then(data => console.log('Evento enviado:', data))
      .catch(error => console.error('Erro:', error));
  });