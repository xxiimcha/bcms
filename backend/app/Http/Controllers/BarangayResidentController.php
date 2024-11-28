<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\BarangayResidentResource;
use App\Models\BarangayResident;
use Illuminate\Support\Facades\Hash;

class BarangayResidentController extends Controller
{
    public function residents(Request $request) {
        $residents = BarangayResident::all();
        return BarangayResidentResource::collection($residents);
    }

    public function resident(Request $request) {
        $resident = BarangayResident::findOrFail($request->id);
        return new BarangayResidentResource($resident);
    }

    public function store(Request $request)  {
        $validated = $request->validate([
            'resident_id' => 'nullable|string',
            'first_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'last_name' => 'required|string',
            'email' => 'nullable|string|email',
            'password' => 'nullable|string|min:6',
            'role' => 'nullable|string',
            'gender' => 'nullable|string',
            'age' => 'nullable|integer',
            'birthdate' => 'nullable|date',
            'civil_status' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'place_of_birth' => 'nullable|string',
            'present_address' => 'nullable|string',
            'barangay' => 'nullable|string',
            'city' => 'nullable|string',
            'previous_address' => 'nullable|string',
            'house_owner' => 'nullable|string',
            'months_years' => 'nullable|string',
            'residency_type' => 'nullable|string',
            'purpose' => 'nullable|string',
            'other_purpose' => 'nullable|string',
            'certificate' => 'nullable|string',
            'date' => 'nullable|date'
        ]);

        // Auto-generate resident_id if not provided
        if (!$request->has('resident_id') || !$request->resident_id) {
            $maxId = BarangayResident::max('id') ?? 0;
            $validated['resident_id'] = sprintf('RES%03d', $maxId + 1);
        }

        // Hash password if provided
        if ($request->has('password')) {
            $validated['password'] = Hash::make($request->password);
        }

        $resident = BarangayResident::create($validated);
        return new BarangayResidentResource($resident);
    }

    public function update(Request $request) {
        $resident = BarangayResident::findOrFail($request->id);

        $validated = $request->validate([
            'first_name' => 'nullable|string',
            'middle_name' => 'nullable|string',
            'last_name' => 'nullable|string',
            'email' => 'nullable|string|email',
            'password' => 'nullable|string|min:6',
            'role' => 'nullable|string',
            'gender' => 'nullable|string',
            'age' => 'nullable|integer',
            'birthdate' => 'nullable|date',
            'civil_status' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'place_of_birth' => 'nullable|string',
            'present_address' => 'nullable|string',
            'barangay' => 'nullable|string',
            'city' => 'nullable|string',
            'previous_address' => 'nullable|string',
            'house_owner' => 'nullable|string',
            'months_years' => 'nullable|string',
            'residency_type' => 'nullable|string',
            'purpose' => 'nullable|string',
            'other_purpose' => 'nullable|string',
            'certificate' => 'nullable|string',
            'date' => 'nullable|date'
        ]);

        // Hash password if provided and changed
        if ($request->has('password') && $request->password !== $resident->password) {
            $validated['password'] = Hash::make($request->password);
        }

        $resident->update($validated);
        return new BarangayResidentResource($resident);
    }

    public function resident_change_password(Request $request) {
        $resident = BarangayResident::findOrFail($request->id);
        $validated = $request->validate([
            'password' => 'required|string|min:6'
        ]);

        $resident->update(['password' => Hash::make($validated['password'])]);
        return response()->json(['success' => 'Password updated successfully'], 200);
    }

    public function destroy(Request $request) {
        $resident = BarangayResident::findOrFail($request->id);
        $resident->delete();
        return response()->json(['success' => 'Resident deleted successfully'], 200);
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
