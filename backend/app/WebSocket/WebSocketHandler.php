<?php

namespace App\WebSocket;

use BeyondCode\LaravelWebSockets\WebSockets\WebSocketHandler as BaseHandler;
use Ratchet\ConnectionInterface;

class WebSocketHandler extends BaseHandler
{
    public function onMessage(ConnectionInterface $connection, $payload)
    {
        // Handle incoming WebSocket message
        $data = json_decode($payload, true);

        // Example: Broadcasting message to all WebSocket clients
        $this->broadcast(json_encode(['message' => 'Hello from Laravel WebSocket!']));
    }
}
