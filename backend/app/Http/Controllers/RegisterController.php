<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Http\Resources\BarangayResidentResource;
use App\Models\BarangayResident;

class RegisterController extends Controller
{
    public function register(Request $request) {
        // Default values for new residents
        $request['role'] = 'resident';
        $request['city'] = 'Pasig City';
        $request['barangay'] = 'Rosario';

        // Hash the password
        $request['password'] = Hash::make($request['password']);

        // Generate the next resident_id with zero-padded formatting
        $maxId = BarangayResident::max('id');
        $nextId = $maxId ? $maxId + 1 : 1; // Increment or start at 1
        $request['resident_id'] = sprintf('RES%03d', $nextId); // Format as RES001, RES002, etc.

        // Create and return the new resident
        return new BarangayResidentResource(BarangayResident::create($request->all()));
    }
}
