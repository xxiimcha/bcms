<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HouseholdMember;

class DashboardController extends Controller
{
    /**
     * Fetch census profiles with age-based classification counts.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCensusProfiles()
    {
        // Classification based on age and other criteria
        $classificationData = [
            'children' => HouseholdMember::whereBetween('age', [0, 14])->count(),
            'youth' => HouseholdMember::whereBetween('age', [15, 24])->count(),
            'senior_citizens' => HouseholdMember::where('age', '>=', 60)->count(),
            'pwd' => HouseholdMember::where('is_pwd', 1)->count(),
            'four_ps' => HouseholdMember::where('is_4ps_beneficiary', 1)->count(),
        ];

        return response()->json($classificationData);
    }

    /**
     * Fetch classification data for age brackets and gender distribution.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getClassificationData()
    {
        // Classification based on age and other criteria
        $classificationData = [
            'children' => HouseholdMember::whereBetween('age', [0, 14])->count(),
            'youth' => HouseholdMember::whereBetween('age', [15, 24])->count(),
            'senior_citizens' => HouseholdMember::where('age', '>=', 60)->count(),
            'pwd' => HouseholdMember::where('is_pwd', 1)->count(),
            'four_ps' => HouseholdMember::where('is_4ps_beneficiary', 1)->count(),
        ];

        return response()->json($classificationData);
    }

    /**
     * Fetch household members data with age and gender distribution.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHouseholdMembers()
    {
        try {
            $householdMembers = HouseholdMember::selectRaw('age, sex as gender, COUNT(*) as count')
                ->groupBy('age', 'sex')
                ->get();

            return response()->json($householdMembers);
        } catch (\Exception $e) {
            \Log::error("Error fetching household members: " . $e->getMessage());
            return response()->json(['error' => 'Server Error'], 500);
        }
    }

    public function getTotalPopulation()
    {
        // Count all household members to get the total population
        $totalPopulation = HouseholdMember::count();

        return response()->json(['total_population' => $totalPopulation]);
    }

    public function getAgeDistribution()
    {
        // Define the age brackets
        $ageBrackets = [
            '0-4' => [0, 4],
            '5-9' => [5, 9],
            '10-14' => [10, 14],
            '15-19' => [15, 19],
            '20-24' => [20, 24],
            '25-29' => [25, 29],
            '30-34' => [30, 34],
            '35-39' => [35, 39],
            '40-44' => [40, 44],
            '45-49' => [45, 49],
            '50-54' => [50, 54],
            '55-59' => [55, 59],
            '60+'  => [60, 120] // 60+ years bracket
        ];

        $ageBracketCounts = [];
        foreach ($ageBrackets as $bracket => $range) {
            // Count household members in each age bracket
            $ageBracketCounts[] = HouseholdMember::whereBetween('age', $range)->count();
        }

        // Calculate the percentage of senior citizens (60+)
        $totalPopulation = array_sum($ageBracketCounts);
        $seniorCitizensCount = HouseholdMember::where('age', '>=', 60)->count();
        $seniorCitizenPercentage = $totalPopulation > 0 ? ($seniorCitizensCount / $totalPopulation) * 100 : 0;

        // Return response in JSON format
        return response()->json([
            'ageBracketCounts' => $ageBracketCounts,
            'seniorCitizenPercentage' => round($seniorCitizenPercentage, 2)
        ]);
    }

    public function getPopulationForecast()
    {
        $totalPopulation = HouseholdMember::count();
        $employedCount = HouseholdMember::where('is_employed', 1)->count();
        $unemployedCount = $totalPopulation - $employedCount;

        // Assumed 2% growth rate for next year's forecast
        $growthRate = 1.02;
        $forecast = [
            'population' => round($totalPopulation * $growthRate),
            'employed' => round($employedCount * $growthRate),
            'unemployed' => round($unemployedCount * $growthRate),
        ];

        return response()->json([
            'current' => [
                'population' => $totalPopulation,
                'employed' => $employedCount,
                'unemployed' => $unemployedCount,
            ],
            'forecast' => $forecast
        ]);
    }
}
