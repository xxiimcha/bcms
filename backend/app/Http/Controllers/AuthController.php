<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::guard('staff')->attempt($credentials)) {
            $user = Auth::guard('staff')->user();
            $token = $user->createToken('StaffToken')->plainTextToken;
            // Include user's role in the response
            return response()->json([
                'token' => $token,
                'role' => $user->role,
                'id' => $user->id,
                'name' => $user->first_name . " " . $user->last_name
            ], 200);
        }

        if (Auth::guard('web')->attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('UserToken')->plainTextToken;
            // Include user's role in the response
            return response()->json([
                'token' => $token,
                'role' => $user->role,
                'id' => $user->id,
                'name' => $user->first_name . " " . $user->last_name
            ], 200);
        }

        return response()->json(['error' => 'Unauthorized'], 200);
    }


    public function _login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('MyAppToken')->plainTextToken;
            // Include user's role in the response
            return response()->json([
                'token' => $token,
                'role' => $user->role
            ], 200);
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}
