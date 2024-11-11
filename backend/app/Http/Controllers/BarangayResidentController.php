<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\BarangayResidentResource;
use App\Models\BarangayResident;
use App\Models\HouseholdMember;
use App\Models\CensusProfile;
use App\Models\CensusProfileEmployment;
use App\Models\CensusProfileFamily;
use Illuminate\Support\Facades\Hash;
use DateTime;

class BarangayResidentController extends Controller
{
    public function residents(Request $request) {
        $residents = BarangayResident::all();
        return BarangayResidentResource::collection($residents);
    }

    public function resident(Request $request) {
        $resident = BarangayResident::with(['employments', 'families'])->findOrFail($request->id);
        return new BarangayResidentResource($resident);
    }

    public function store(Request $request)  {

        $validated = $request->validate([
            'first_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'last_name' => 'required|string',
            'gender' => 'nullable|string',
            'age' => 'nullable|integer',
            'birthdate' => 'nullable|date',
            'civil_status' => 'nullable|string',
            'household_count' => 'nullable|integer',
            'email' => 'nullable|string|email',
            'contact_number' => 'nullable|string',
            'place_of_birth' => 'nullable|string',
            'employed' => 'nullable|string',
            'occupation' => 'nullable|string',
            'monthly_salary' => 'nullable|numeric',
            'purok' => 'nullable|string',
            'street' => 'nullable|string',
            'barangay' => 'nullable|string',
            'city' => 'nullable|string',
            'zipcode' => 'nullable|string',
            'role' => 'nullable|string',
            'password' => 'nullable|string|min:6',
            'resident_id' => 'nullable|string',
            'profile_status' => 'nullable|string',
            'education' => 'nullable|string',
            'address' => 'nullable|string',
            'ownership' => 'nullable|string',
            'length_of_stay' => 'nullable|integer',
            'provincial_address' => 'nullable|string',
            'height' => 'nullable|string',
            'weight' => 'nullable|string',
            'religion' => 'nullable|string',
            'voter' => 'nullable|string',
            'four_ps' => 'nullable|string',
            'pwd' => 'nullable|string',
            'elementary' => 'nullable|string',
            'high_school' => 'nullable|string',
            'vocational' => 'nullable|string',
            'college' => 'nullable|string'
        ]);

        $resident = BarangayResident::create($validated);
        if ($request->has('password')) {
            $resident->password = Hash::make($request->password);
            $resident->save();
        }
        if ($request->has('employerRows')) {
            foreach ($request->employerRows as $employerRow) {
                $employerRow['census_id'] = $resident->id; // Link to the profile
                CensusProfileEmployment::create($employerRow);
            }
        }

        if ($request->has('familyRows')) {
            foreach ($request->familyRows as $familyRow) {
                $familyRow['census_id'] = $resident->id; // Link to the profile
                CensusProfileFamily::create($familyRow);
            }
        }
        return new BarangayResidentResource($resident);
    }

    public function update(Request $request) {
        $barangay_resident = BarangayResident::findOrFail($request->id);

        $updates = [];

        // Check and update each field if it's different from the current value
        if ($request->has('first_name') && $request->first_name !== $barangay_resident->first_name) {
            $updates['first_name'] = $request->first_name;
        }

        if ($request->has('middle_name') && $request->middle_name !== $barangay_resident->middle_name) {
            $updates['middle_name'] = $request->middle_name;
        }

        if ($request->has('last_name') && $request->last_name !== $barangay_resident->last_name) {
            $updates['last_name'] = $request->last_name;
        }

        if ($request->has('gender') && $request->gender !== $barangay_resident->gender) {
            $updates['gender'] = $request->gender;
        }

        if ($request->has('age') && $request->age !== $barangay_resident->age) {
            $updates['age'] = $request->age;
        }

        if ($request->has('household_count') && $request->household_count !== $barangay_resident->household_count) {
            $updates['household_count'] = $request->household_count;
        }

        if ($request->has('birthdate') && $request->birthdate !== $barangay_resident->birthdate) {
            $updates['birthdate'] = $request->birthdate;
        }

        if ($request->has('civil_status') && $request->civil_status !== $barangay_resident->civil_status) {
            $updates['civil_status'] = $request->civil_status;
        }

        if ($request->has('email') && $request->email !== $barangay_resident->email) {
            $updates['email'] = $request->email;
        }

        if ($request->has('contact_number') && $request->contact_number !== $barangay_resident->contact_number) {
            $updates['contact_number'] = $request->contact_number;
        }

        if ($request->has('place_of_birth') && $request->place_of_birth !== $barangay_resident->place_of_birth) {
            $updates['place_of_birth'] = $request->place_of_birth;
        }

        if ($request->has('employed') && $request->employed !== $barangay_resident->employed) {
            $updates['employed'] = $request->employed;
        }

        if ($request->has('occupation') && $request->occupation !== $barangay_resident->occupation) {
            $updates['occupation'] = $request->occupation;
        }

        if ($request->has('monthly_salary') && $request->monthly_salary !== $barangay_resident->monthly_salary) {
            $updates['monthly_salary'] = $request->monthly_salary;
        }

        if ($request->has('purok') && $request->purok !== $barangay_resident->purok) {
            $updates['purok'] = $request->purok;
        }

        if ($request->has('street') && $request->street !== $barangay_resident->street) {
            $updates['street'] = $request->street;
        }

        if ($request->has('city') && $request->city !== $barangay_resident->city) {
            $updates['city'] = $request->city;
        }

        if ($request->has('zipcode') && $request->zipcode !== $barangay_resident->zipcode) {
            $updates['zipcode'] = $request->zipcode;
        }

        if ($request->has('education') && $request->education !== $barangay_resident->education) {
            $updates['education'] = $request->education;
        }

        // New Attributes from JSON
        if ($request->has('address') && $request->address !== $barangay_resident->address) {
            $updates['address'] = $request->address; // Assumes address field exists
        }

        if ($request->has('ownership') && $request->ownership !== $barangay_resident->ownership) {
            $updates['ownership'] = $request->ownership; // Assumes ownership field exists
        }

        if ($request->has('provincial_address') && $request->provincial_address !== $barangay_resident->provincial_address) {
            $updates['provincial_address'] = $request->provincial_address; // Assumes provincial_address field exists
        }

        if ($request->has('length_of_stay') && $request->length_of_stay !== $barangay_resident->length_of_stay) {
            $updates['length_of_stay'] = $request->length_of_stay; // Assumes length_of_stay field exists
        }

        if ($request->has('height') && $request->height !== $barangay_resident->height) {
            $updates['height'] = $request->height; // Assumes height field exists
        }

        if ($request->has('weight') && $request->weight !== $barangay_resident->weight) {
            $updates['weight'] = $request->weight; // Assumes weight field exists
        }

        if ($request->has('religion') && $request->religion !== $barangay_resident->religion) {
            $updates['religion'] = $request->religion; // Assumes religion field exists
        }

        if ($request->has('voter') && $request->voter !== $barangay_resident->voter) {
            $updates['voter'] = $request->voter; // Assumes voter field exists
        }

        if ($request->has('four_ps') && $request->four_ps !== $barangay_resident->four_ps) {
            $updates['four_ps'] = $request->four_ps; // Assumes four_ps field exists
        }

        if ($request->has('pwd') && $request->pwd !== $barangay_resident->pwd) {
            $updates['pwd'] = $request->pwd; // Assumes pwd field exists
        }

        if ($request->has('elementary') && $request->elementary !== $barangay_resident->elementary) {
            $updates['elementary'] = $request->elementary;
        }

        if ($request->has('high_school') && $request->high_school !== $barangay_resident->high_school) {
            $updates['high_school'] = $request->high_school;
        }

        if ($request->has('vocational') && $request->vocational !== $barangay_resident->vocational) {
            $updates['vocational'] = $request->vocational;
        }

        if ($request->has('college') && $request->college !== $barangay_resident->college) {
            $updates['college'] = $request->college;
        }

        // Handle Employer Rows
        if ($request->has('employerRows')) {
            foreach ($request->employerRows as $employerRow) {
                // Check if the employer record exists
                if (isset($employerRow['id'])) {
                    $existingEmployer = CensusProfileEmployment::find($employerRow['id']);
                    if ($existingEmployer) {
                        // Update existing employer
                        $existingEmployer->update($employerRow);
                    } else {
                        // Create new employer entry if it does not exist
                        $employerRow['census_id'] = $barangay_resident->id; // Link to the profile
                        CensusProfileEmployment::create($employerRow);
                    }
                } else {
                    // Create new employer entry if no ID is provided
                    $employerRow['census_id'] = $barangay_resident->id; // Link to the profile
                    CensusProfileEmployment::create($employerRow);
                }
            }
        }

        // Handle Family Rows
        if ($request->has('familyRows')) {
            foreach ($request->familyRows as $familyRow) {
                // Check if the family record exists
                if (isset($familyRow['id'])) {
                    $existingFamily = CensusProfileFamily::find($familyRow['id']);
                    if ($existingFamily) {
                        // Update existing family
                        $existingFamily->update($familyRow);
                    } else {
                        // Create new family entry if it does not exist
                        $familyRow['census_id'] = $barangay_resident->id; // Link to the profile
                        CensusProfileFamily::create($familyRow);
                    }
                } else {
                    // Create new family entry if no ID is provided
                    $familyRow['census_id'] = $barangay_resident->id; // Link to the profile
                    CensusProfileFamily::create($familyRow);
                }
            }
        }

        // Password Update Logic
        if ($request->has('password')) {
            $newPassword = $request->password;
            if ($newPassword !== $barangay_resident->password) {
                $updates['password'] = Hash::make($newPassword);
            }
        }

        // Apply updates
        if (!empty($updates)) {
            $barangay_resident->update($updates);
        }

        return new BarangayResidentResource($barangay_resident);
    }


    public function resident_change_password(Request $request) {
        $barangay_resident = BarangayResident::findOrFail($request->id);
        $hashed_password = Hash::make($request->password);
        if($barangay_resident) {
            $barangay_resident->update([
                'password' => $hashed_password
            ]);
        }
        return response()->json(['success' => 'Change Password Successful'], 200);
    }

    public function destroy(Request $request)
    {
        $resident = BarangayResident::findOrFail(($request->id) ?? null);
        return $resident->delete();
    }

    public function getAllClassificationCounts()
    {
        // Fetch all profiles from the household_members table
        $profiles = HouseholdMember::all();

        // Initialize classifications with counters and empty profiles
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

        // Loop through each profile and classify
        foreach ($profiles as $profile) {
            // Calculate age from date_of_birth
            $age = $this->calculateAge($profile->date_of_birth);

            // Classify based on age
            if ($age < 18) {
                $classifications['children']['ctr']++;
                $classifications['children']['profile'][] = $profile;
            } elseif ($age < 60) {
                $classifications['youth']['ctr']++;
                $classifications['youth']['profile'][] = $profile;
            } else {
                $classifications['senior_citizen']['ctr']++;
                $classifications['senior_citizen']['profile'][] = $profile;
            }

            // Classify based on flags in household_members table
            if ($profile->is_pwd) {
                $classifications['pwd']['ctr']++;
                $classifications['pwd']['profile'][] = $profile;
            }

            if ($profile->is_4ps_beneficiary) {
                $classifications['four_ps']['ctr']++;
                $classifications['four_ps']['profile'][] = $profile;
            }
        }

        // Return the classifications in JSON format
        return response()->json($classifications);
    }

    // Helper function to calculate age from date_of_birth
    private function calculateAge($birthdate)
    {
        $birthDate = new DateTime($birthdate);
        $currentDate = new DateTime();
        $age = $birthDate->diff($currentDate)->y;
        return $age;
    }

    public function get_forecast(Request $request)
    {
        // Get parameters from request or set defaults
        $startYear = $request->input('start_year', 2020); // Default to 2020 if not provided
        $endYear = $request->input('end_year', 2025); // Default to 2025 if not provided
        $growthRate = $request->input('growth_rate', 0.2); // Default growth rate of 20% if not provided

        // Group by year for population count
        $populationCount = BarangayResident::selectRaw('YEAR(created_at) as year, COUNT(*) as count')
            ->groupBy('year')
            ->orderBy('year', 'asc')
            ->get();

        // Group by year and employment status for employment count
        $employmentCount = BarangayResident::selectRaw('YEAR(created_at) as year, employed, COUNT(*) as count')
            ->groupBy('year', 'employed')
            ->orderBy('year', 'asc')
            ->get();

        // Prepare population data
        $populationData = $populationCount->pluck('count', 'year')->toArray();

        // Prepare employment data
        $employmentData = [];
        foreach ($employmentCount as $record) {
            $year = $record->year;
            $employmentStatus = strtolower($record->employed);

            if (!isset($employmentData[$year])) {
                $employmentData[$year] = ['employed' => 0, 'unemployed' => 0];
            }

            if ($employmentStatus === 'yes') {
                $employmentData[$year]['employed'] += $record->count;
            } else {
                $employmentData[$year]['unemployed'] += $record->count;
            }
        }

        // Full year range based on parameters
        $fullYearRange = range($startYear, $endYear);

        // Initialize final data arrays
        $finalPopulation = [];
        $finalEmploymentData = [];

        foreach ($fullYearRange as $year) {
            $finalPopulation[$year] = $populationData[$year] ?? 0;
            $finalEmploymentData[$year] = $employmentData[$year] ?? ['employed' => 0, 'unemployed' => 0];
        }

        // Get the most recent year with data for forecasting
        $lastYearWithData = max(array_keys(array_filter($finalPopulation, fn($count) => $count > 0)));
        $forecastedYear = $lastYearWithData + 1;

        // Forecast population based on the growth rate if we have data for the last year
        if (isset($finalPopulation[$lastYearWithData])) {
            $forecastedPopulationCount = $finalPopulation[$lastYearWithData] + ($growthRate * $finalPopulation[$lastYearWithData]);
            $finalPopulation[$forecastedYear] = round($forecastedPopulationCount);

            // Forecast employment based on the last year's data and the growth rate
            $forecastedEmployedCount = $finalEmploymentData[$lastYearWithData]['employed'] + ($growthRate * $finalEmploymentData[$lastYearWithData]['employed']);
            $forecastedUnemployedCount = $finalEmploymentData[$lastYearWithData]['unemployed'] + ($growthRate * $finalEmploymentData[$lastYearWithData]['unemployed']);

            $finalEmploymentData[$forecastedYear] = [
                'employed' => round($forecastedEmployedCount),
                'unemployed' => round($forecastedUnemployedCount)
            ];
        } else {
            // If no data is sufficient for forecasting, set the next year's values to zero or reasonable defaults
            $finalPopulation[$forecastedYear] = 0;
            $finalEmploymentData[$forecastedYear] = ['employed' => 0, 'unemployed' => 0];
        }

        // Format the response
        $formattedResponse = [
            'population' => [],
            'employment' => []
        ];

        foreach ($finalPopulation as $year => $count) {
            $formattedResponse['population'][] = [
                'year' => $year,
                'count' => $count
            ];
        }

        foreach ($finalEmploymentData as $year => $data) {
            $employmentRate = ($data['employed'] + $data['unemployed']) > 0
                ? round(($data['employed'] / ($data['employed'] + $data['unemployed'])) * 100, 2)
                : 0;

            $formattedResponse['employment'][] = [
                'year' => $year,
                'employed' => $data['employed'],
                'unemployed' => $data['unemployed'],
                'employment_rate' => $employmentRate // Employment rate as a percentage
            ];
        }

        return response()->json($formattedResponse);
    }
}
