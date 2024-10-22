<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\CensusProfileResource;
use App\Models\CensusProfile;
use App\Models\CensusProfileEmployment;
use App\Models\CensusProfileFamily; // Import the Family model
use Illuminate\Support\Facades\Hash;

class CensusProfileController extends Controller
{
    public function censusProfiles(Request $request)
    {
        $profiles = CensusProfile::all();
        return CensusProfileResource::collection($profiles);
    }

    public function censusProfile(Request $request)
    {
        $censusProfile = CensusProfile::with(['employments', 'families'])->findOrFail($request->id);
        return new CensusProfileResource($censusProfile);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'address' => 'nullable|string',
            'ownership' => 'nullable|string',
            'provincial_address' => 'nullable|string',
            'length_of_stay' => 'nullable|int',
            'gender' => 'nullable|string',
            'civil_status' => 'nullable|string',
            'birthdate' => 'nullable|date',
            'place_of_birth' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'height' => 'nullable|string',
            'weight' => 'nullable|string',
            'religion' => 'nullable|string',
            'email' => 'nullable|string|email',
            'voter' => 'nullable|string',
            'four_ps' => 'nullable|string',
            'pwd' => 'nullable|string',
            'elementary' => 'nullable|string',
            'elementary_address' => 'nullable|string',
            'high_school' => 'nullable|string',
            'high_school_address' => 'nullable|string',
            'vocational' => 'nullable|string',
            'vocational_address' => 'nullable|string',
            'college' => 'nullable|string',
            'college_address' => 'nullable|string',
            'password' => 'nullable|string|min:6',
        ]);

        $censusProfile = CensusProfile::create($validated);

        // Hash the password if provided
        if ($request->has('password')) {
            $censusProfile->password = Hash::make($request->password);
            $censusProfile->save();
        }

        if ($request->has('employerRows')) {
            foreach ($request->employerRows as $employerRow) {
                $employerRow['census_id'] = $censusProfile->id; // Link to the profile
                CensusProfileEmployment::create($employerRow);
            }
        }

        if ($request->has('familyRows')) {
            foreach ($request->familyRows as $familyRow) {
                $familyRow['census_id'] = $censusProfile->id; // Link to the profile
                CensusProfileFamily::create($familyRow);
            }
        }

        return new CensusProfileResource($censusProfile);
    }

    public function update(Request $request)
    {
        $censusProfile = CensusProfile::findOrFail($request->id);

        $validated = $request->validate([
            'first_name' => 'nullable|string',
            'last_name' => 'nullable|string',
            'address' => 'nullable|string',
            'ownership' => 'nullable|string',
            'provincial_address' => 'nullable|string',
            'length_of_stay' => 'nullable|int',
            'gender' => 'nullable|string',
            'civil_status' => 'nullable|string',
            'birthdate' => 'nullable|date',
            'place_of_birth' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'height' => 'nullable|string',
            'weight' => 'nullable|string',
            'religion' => 'nullable|string',
            'email' => 'nullable|string|email',
            'voter' => 'nullable|string',
            'four_ps' => 'nullable|string',
            'pwd' => 'nullable|string',
            'elementary' => 'nullable|string',
            'elementary_address' => 'nullable|string',
            'high_school' => 'nullable|string',
            'high_school_address' => 'nullable|string',
            'vocational' => 'nullable|string',
            'vocational_address' => 'nullable|string',
            'college' => 'nullable|string',
            'college_address' => 'nullable|string',
            'password' => 'nullable|string|min:6',
            'employerRows' => 'nullable|array',
            'employerRows.*.id' => 'nullable|integer|exists:census_profile_employment,id',
            'employerRows.*.duration' => 'nullable|string',
            'employerRows.*.employer_name' => 'nullable|string',
            'employerRows.*.employer_address' => 'nullable|string',
            'familyRows' => 'nullable|array',
            'familyRows.*.id' => 'nullable|integer|exists:census_profile_family,id',
            'familyRows.*.full_name' => 'required|string',
            'familyRows.*.position' => 'nullable|string',
            'peopleRows.*.age' => 'nullable|integer',
            'peopleRows.*.birthdate' => 'nullable|date',
            'peopleRows.*.civil_status' => 'nullable|string',
            'familyRows.*.occupation' => 'nullable|string',
            'deletedEmployerIds' => 'nullable|array',
            'deletedFamilyIds' => 'nullable|array',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        // Update the census profile fields
        $censusProfile->update(array_filter($validated)); // Update only the fields that are present

        // Handle employerRows updates
        if (isset($validated['employerRows'])) {
            foreach ($validated['employerRows'] as $employerData) {
                if (isset($employerData['id'])) {
                    // Update existing employer
                    $employer = CensusProfileEmployment::findOrFail($employerData['id']);
                    $employer->update($employerData);
                } else {
                    // Create new employer record
                    $censusProfile->employments()->create(array_merge($employerData, ['census_id' => $censusProfile->id]));
                }
            }
        }

        // Handle deletion of employer rows
        if (isset($validated['deletedEmployerIds'])) {
            CensusProfileEmployment::destroy($validated['deletedEmployerIds']);
        }

        // Handle familyRows updates
        if (isset($validated['familyRows'])) {
            foreach ($validated['familyRows'] as $familyData) {
                if (isset($familyData['id'])) {
                    // Update existing family member
                    $familyMember = CensusProfileFamily::findOrFail($familyData['id']);
                    $familyMember->update($familyData);
                } else {
                    // Create new family member record
                    $censusProfile->families()->create(array_merge($familyData, ['census_id' => $censusProfile->id]));
                }
            }
        }

        // Handle deletion of family rows
        if (isset($validated['deletedFamilyIds'])) {
            CensusProfileFamily::destroy($validated['deletedFamilyIds']);
        }

        return new CensusProfileResource($censusProfile);
    }

    public function changePassword(Request $request)
    {
        $censusProfile = CensusProfile::findOrFail($request->id);

        $validated = $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $censusProfile->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['success' => 'Password Change Successful'], 200);
    }

    public function destroy(Request $request)
    {
        $censusProfile = CensusProfile::findOrFail($request->id);
        $censusProfile->delete();
        return response()->json(['success' => 'Profile Deleted Successfully'], 200);
    }

    public function getAllClassificationCounts()
    {
        $profiles = CensusProfile::all();

        $classifications = [
            'children' => [
                'ctr' => 0,
                'profile' => []
            ],
            'youth' => [
                'ctr' => 0,
                'profile' => []
            ],
            'senior_citizen' => [
                'ctr' => 0,
                'profile' => []
            ],
            'indigents' => [
                'ctr' => 0,
                'profile' => []
            ],
            'pwd' => [
                'ctr' => 0,
                'profile' => []
            ],
            'four_ps' => [
                'ctr' => 0,
                'profile' => []
            ]
        ];

        foreach ($profiles as $profile) {
            $age = $this->calculateAge($profile->birthdate);

            // Classify based on age
            if ($age < 18) {
                $classifications['children']['ctr']++;
            } elseif ($age < 60) {
                $classifications['youth']['ctr']++;
            } else {
                $classifications['senior_citizen']['ctr']++;
            }

            // Count based on flags in census_profile table
            if ($profile->indigent) {
                $classifications['indigents']['ctr']++;
            }

            if ($profile->pwd) {
                $classifications['pwd']['ctr']++;
            }

            if ($profile->four_ps) {
                $classifications['four_ps']['ctr']++;
            }
        }

        return response()->json($classifications);
    }

    /**
     * Calculate age from birthdate.
     *
     * @param string $birthdate
     * @return int
     */
    private function calculateAge($birthdate)
    {
        return now()->diffInYears($birthdate);
    }
}
