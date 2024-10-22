<?php

use BeyondCode\LaravelWebSockets\Facades\WebSocketsRouter;
use Illuminate\Support\ServiceProvider;

class WebSocketServiceProvider extends ServiceProvider
{
    public function boot()
    {
        WebSocketsRouter::webSocket('/ws-endpoint', \App\WebSocket\WebSocketHandler::class);
    }
}