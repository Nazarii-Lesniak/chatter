import { createServer } from 'node:http';
import express from 'express';
import { WebSocketServer } from 'ws';

const app = express();
const port = process.env.PORT || 3005;

app.get('/api/ping', (_request, response) => {
  response.json({ status: 'ok', message: 'Server is running' });
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('🟢 Client connected');

  ws.on('message', (data) => {
    const message = data.toString();
    console.log(`📩 Received message: "${message}"`);

    if (message === 'ping') {
      ws.send('pong');
    } else {
      ws.send(`Echo: ${message}`);
    }
  });

  ws.on('close', () => {
    console.log('🔴 Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`🚀 Server running on port http://localhost:${port}`);
  console.log(`🔌 WebSocket ready on ws://localhost:${port}`);
});
