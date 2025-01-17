import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import WebSocket from "ws";

// Cargar las variables de entorno desde un archivo .env
dotenv.config();

// Establecer el puerto de WebSocket desde las variables de entorno (o un valor predeterminado)
const webSocketPort = process.env.WS_PORT || 3001;  // Usar el puerto definido en el archivo .env o 3001 por defecto

let wss = null;

const createWebSocketServer = (server) => {
  if (wss) return wss;  // Si la instancia ya existe, retornarla

  // Crear el servidor WebSocket, pasando el puerto como argumento
  wss = new WebSocketServer({ server });

  // Hacer que el servidor escuche el puerto especificado
  server.listen(webSocketPort, () => {
    console.log(`Servidor WebSocket en ejecución en el puerto ${webSocketPort}.`);
  });

  // Manejar nuevas conexiones WebSocket
  wss.on('connection', (ws) => {
    console.log('Cliente conectado.');

    // Manejar los mensajes recibidos del cliente
    ws.on('message', (data) => {
      if (data) {
        const eventData = JSON.parse(data);
        console.log('Recibiendo:', eventData);

        const { event, data: payload } = eventData;
        if (event === 'login') {
          // Aquí puedes hacer alguna acción
          // Ejemplo: DetallesCampana.anexosCampana(payload);
        }

        // Enviar mensaje a todos los clientes conectados
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(eventData));
          }
        });
      }
    });

    // Configurar envío de ping periódicamente
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping('ping');  // Enviar ping al cliente
      }
    }, 30000);  // Cada 30 segundos

    // Manejar respuesta al ping (pong)
    ws.on('pong', () => {
      console.log('Cliente respondió al ping.');
    });

    // Manejar cierre de conexión
    ws.on('close', () => {
      console.log('Cliente desconectado.');
      clearInterval(pingInterval);
    });
  });

  // Manejar errores en el servidor WebSocket
  wss.on('error', (error) => {
    console.error('Error en el servidor WebSocket:', error);
  });

  return wss; // Retornar la instancia única de WebSocket
};

// Exportar la función que crea la instancia de WebSocket
export { createWebSocketServer, wss };
