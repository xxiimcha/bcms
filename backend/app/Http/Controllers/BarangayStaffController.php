<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\BarangayStaffResource;
use App\Models\BarangayStaff;

class BarangayStaffController extends Controller
{
    public function staffs(Request $request)
    {
        $currentUser = $request->user();

        $barangayStaffs = BarangayStaff::where('id', '!=', $currentUser->id)->get();
        
        return BarangayStaffResource::collection($barangayStaffs);
    }

    public function staff(Request $request, $id)
    {
        return new BarangayStaffResource(BarangayStaff::findOrFail($id) ?? null);
    }

    public function store(Request $request)  {
        $store_req = BarangayStaff::create($request->all());
        if($store_req) {
            $barangay_staff = BarangayStaff::findOrFail($store_req->id);
            $hashed_password = Hash::make($request->password);
            if($barangay_staff) {
                $barangay_staff->update([
                    'password' => $hashed_password
                ]);
            }
        }
        return new BarangayStaffResource($barangay_staff);
    }

    public function update(Request $request)
    {
        $barangay_staff = BarangayStaff::findOrFail($request->id);

        $updates = [];

        if ($request->has('email') && $request->email !== $barangay_staff->email) {
            $updates['email'] = $request->email;
        }

        if ($request->has('first_name') && $request->first_name !== $barangay_staff->first_name) {
            $updates['first_name'] = $request->first_name;
        }

        if ($request->has('last_name') && $request->last_name !== $barangay_staff->last_name) {
            $updates['last_name'] = $request->last_name;
        }
        if ($request->has('password')) {
            $newPassword = $request->password;
            if ($newPassword !== $barangay_staff->password) {
                $updates['password'] = Hash::make($newPassword);
            }
        }
        if (!empty($updates)) {
            $barangay_staff->update($updates);
        }

        return new BarangayStaffResource($barangay_staff);
    }

    public function staff_change_password(Request $request) {
        $barangay_staff = BarangayStaff::findOrFail($request->id);
        $hashed_password = Hash::make($request->password);
        if($barangay_staff) {
            $barangay_staff->update([
                'password' => $hashed_password
            ]);
        }
        return response()->json(['success' => 'Change Password Successful'], 200);
    }

    public function destroy(Request $request)
    {
        return $request->id;
        $barangay_staff = BarangayStaff::findOrFail($request->id);
        return $barangay_staff->delete();
    }
}
