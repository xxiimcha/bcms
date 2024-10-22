<?php

namespace App\Http\Controllers;

use App\Http\Resources\CensusProfileFamilyResource;
use App\Models\CensusProfileFamily;
use Illuminate\Http\Request;

class CensusProfileFamilyController extends Controller
{
    public function index(Request $request, $censusId)
    {
        $familyMembers = CensusProfileFamily::where('census_id', $censusId)->get();
        return CensusProfileFamilyResource::collection($familyMembers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'census_id' => 'required|exists:census_profiles,id',
            'full_name' => 'required|string',
            'position' => 'nullable|string',
            'age' => 'nullable|integer',
            'birthdate' => 'nullable|date',
            'civil_status' => 'nullable|string',
            'occupation' => 'nullable|string',
        ]);

        $familyMember = CensusProfileFamily::create($validated);
        return new CensusProfileFamilyResource($familyMember);
    }

    public function update(Request $request, $id)
    {
        $familyMember = CensusProfileFamily::findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'nullable|string',
            'position' => 'nullable|string',
            'age' => 'nullable|integer',
            'birthdate' => 'nullable|date',
            'civil_status' => 'nullable|string',
            'occupation' => 'nullable|string',
        ]);

        $familyMember->update(array_filter($validated));
        return new CensusProfileFamilyResource($familyMember);
    }

    public function destroy($id)
    {
        $familyMember = CensusProfileFamily::findOrFail($id);
        $familyMember->delete();
        return response()->json(['success' => 'Family Member Deleted Successfully'], 200);
    }
}
