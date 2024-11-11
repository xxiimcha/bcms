<?php

namespace App\Http\Controllers;

use App\Models\CensusProfile;
use App\Models\HouseholdMember;
use Illuminate\Http\Request;

class CensusProfileController extends Controller
{
    /**
     * Display a listing of all census profiles.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $censusProfiles = CensusProfile::with('householdMembers')->get();
            return response()->json($censusProfiles, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve census profiles', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified census profile.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $censusProfile = CensusProfile::with('householdMembers')->findOrFail($id);
            return response()->json($censusProfile, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve census profile', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created census profile along with household members in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'date_of_reinterview' => 'nullable|date',
            'respondent_name' => 'required|string|max:255',
            'respondent_address' => 'required|string|max:255',
            'total_members' => 'required|integer',
            'male_members' => 'required|integer',
            'female_members' => 'required|integer',
            'householdMembers' => 'required|array',
            'householdMembers.*.name' => 'required|string|max:255',
            'householdMembers.*.relationship' => 'required|string|max:255',
            'householdMembers.*.sex' => 'required|in:Male,Female',
            'householdMembers.*.dateOfBirth' => 'required|string',
            'householdMembers.*.age' => 'required|integer|min:0',
            'householdMembers.*.isPWD' => 'nullable|boolean',
            'householdMembers.*.is4PsBeneficiary' => 'nullable|boolean',
            'householdMembers.*.isEmployed' => 'nullable|boolean',
            'householdMembers.*.educationalAttainment' => 'nullable|string|max:255',
        ]);

        try {
            // Create the census profile
            $censusProfile = CensusProfile::create([
                'date_of_reinterview' => $request->date_of_reinterview,
                'respondent_name' => $request->respondent_name,
                'respondent_address' => $request->respondent_address,
                'total_members' => $request->total_members,
                'male_members' => $request->male_members,
                'female_members' => $request->female_members,
            ]);

            // Loop through each household member and save them
            foreach ($request->householdMembers as $memberData) {
                $censusProfile->householdMembers()->create([
                    'name' => $memberData['name'],
                    'relationship' => $memberData['relationship'],
                    'sex' => $memberData['sex'],
                    'date_of_birth' => $memberData['dateOfBirth'],
                    'age' => $memberData['age'],
                    'is_pwd' => $memberData['isPWD'] ?? false,
                    'is_4ps_beneficiary' => $memberData['is4PsBeneficiary'] ?? false,
                    'is_employed' => $memberData['isEmployed'] ?? null,
                    'educational_attainment' => $memberData['educationalAttainment'] ?? null,
                ]);
            }

            return response()->json(['message' => 'Census profile saved successfully'], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to save the census profile', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified census profile from the database.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $censusProfile = CensusProfile::findOrFail($id);
            $censusProfile->delete();

            return response()->json(['message' => 'Census profile deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete census profile', 'details' => $e->getMessage()], 500);
        }
    }
}
