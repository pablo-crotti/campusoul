import createDebugger from 'debug';
import { WebSocketServer } from 'ws';

const debug = createDebugger('express-api:messaging');

const clients = [];

/**
* Initializes a WebSocket server on an existing HTTP server.
* Handles new connections, messages, and disconnections of WebSocket clients.
* 
* @param {Object} httpServer - The HTTP server for WebSocket attachment.
*/
export function createWebSocketServer(httpServer) {
    debug('Creating WebSocket server');
    const wss = new WebSocketServer({
        server: httpServer,
    });

    wss.on('connection', function (ws) {
        debug('New WebSocket client connected');

        clients.push(ws);

        ws.on('message', (message) => {
            let parsedMessage;
            try {
                parsedMessage = JSON.parse(message);
            } catch (err) {
                return debug('Invalid JSON message received from client');
            }

            onMessageReceived(ws, parsedMessage);
        });

        ws.on('close', () => {
            clients.splice(clients.indexOf(ws), 1);
            debug('WebSocket client disconnected');
        });
    });
}

/**
* Broadcasts a message to all connected WebSocket clients.
* 
* @param {Object|string} message - The message to be broadcasted.
*/
export function broadcastMessage(message) {
    debug(
        `Broadcasting message to all connected clients: ${JSON.stringify(message)}`
    );
    clients.forEach((client) => {
        client.send(JSON.stringify(message));
    });
}

/**
* Handles received messages from a WebSocket client and echoes them back.
* 
* @param {Object} ws - The WebSocket connection from which the message was received.
* @param {Object|string} message - The message received from the client.
*/
function onMessageReceived(ws, message) {
    debug(`Received WebSocket message: ${JSON.stringify(message)}`);
    ws.send(JSON.stringify(message));
}