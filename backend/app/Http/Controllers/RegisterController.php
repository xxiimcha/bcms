<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Http\Resources\BarangayResidentResource;
use App\Models\BarangayResident;

class RegisterController extends Controller
{
    public function register(Request $request)  {
        $request['role'] = 'resident';
        $request['city'] = 'Pasig City';
        $request['barangay'] = 'Rosario';
        $hash_pass = Hash::make($request['password']);
        $request['password'] = $hash_pass;
        $maxId = (int) BarangayResident::max('id');
        $request['resident_id'] = "RES-" . ($maxId + 1);
        return new BarangayResidentResource(BarangayResident::create($request->all()));
    }
}
