<?php

namespace App\Http\Controllers;

use App\Http\Resources\CensusProfileEmploymentResource;
use App\Models\CensusProfileEmployment;
use Illuminate\Http\Request;

class CensusProfileEmploymentController extends Controller
{
    public function index($censusId)
    {
        $employments = CensusProfileEmployment::where('census_id', $censusId)->get();
        return CensusProfileEmploymentResource::collection($employments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'census_id' => 'required|string',
            'duration' => 'nullable|string',
            'employer_name' => 'nullable|string',
            'employer_address' => 'nullable|string',
            'monthly_salary' => 'nullable|string',
        ]);

        $employment = CensusProfileEmployment::create($validated);

        return new CensusProfileEmploymentResource($employment);
    }

    public function update(Request $request, $id)
    {
        $employment = CensusProfileEmployment::findOrFail($id);

        $validated = $request->validate([
            'duration' => 'nullable|string',
            'employer_name' => 'nullable|string',
            'employer_address' => 'nullable|string',
            'monthly_salary' => 'nullable|string',
        ]);

        $employment->update(array_filter($validated));

        return new CensusProfileEmploymentResource($employment);
    }

    public function destroy($id)
    {
        $employment = CensusProfileEmployment::findOrFail($id);
        $employment->delete();
        return response()->json(['success' => 'Employment record deleted successfully'], 200);
    }
}
