# bcms



public network firewall must be off
check IP address then modify the data
php artisan view:clear

php artisan vendor:publish --provider="BeyondCode\LaravelWebSockets\WebSocketsServiceProvider" --tag="config"
php artisan migrate
php artisan websockets:serve

php artisan serve --host=0.0.0.0
node server.js