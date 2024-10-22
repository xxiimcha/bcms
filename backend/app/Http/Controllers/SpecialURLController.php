<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use WebSocket\Client;


class SpecialURLController extends Controller
{

    public function open_in_desktop(Request $request)
    {
        $url = $request->input('url');
        $data = [
            'event' => 'open-in-desktop',
            'message' => $url
        ];
        $json_data = json_encode($data);
        $client = new Client("ws://localhost:3000");
        $client->send($json_data);
        $client->close();

        return response()->json(['message' => $url]);
    }


    public function _open_in_desktop(Request $request)
    {
        $url = $request->input('url');
        \Log::info('URL received: ' . $url);

        // Generate JavaScript code to open the URL in a new window
        $script = "window.open('$url', '_blank');";

        // Return a response with JavaScript content
        return response($script)->header('Content-Type', 'text/javascript');
    }
}
