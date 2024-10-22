<?php

// Custom Authentication Middleware for Staff
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class StaffAuthMiddleware
{
    public function handle($request, Closure $next)
    {
        if (Auth::guard('staff')->check()) {
            return $next($request);
        }

        return response()->json(['error' => 'Unauthenticated'], 401);
    }
}
