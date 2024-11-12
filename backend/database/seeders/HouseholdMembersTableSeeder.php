<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HouseholdMember;
use App\Models\CensusProfile;
use Faker\Factory as Faker;

class HouseholdMembersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Retrieve all census profiles
        $censusProfiles = CensusProfile::all();

        // Loop through each census profile
        foreach ($censusProfiles as $profile) {
            // Generate a random number of household members
            for ($j = 0; $j < $profile->total_members; $j++) {
                HouseholdMember::create([
                    'census_profile_id' => $profile->id,
                    'name' => $faker->name,
                    'relationship' => $faker->randomElement(['Head', 'Spouse', 'Son', 'Daughter', 'Relative']),
                    'sex' => $faker->randomElement(['Male', 'Female']),
                    'date_of_birth' => $faker->date(),
                    'age' => $faker->numberBetween(1, 90),
                    'is_pwd' => $faker->boolean(10), // 10% chance of being PWD
                    'is_4ps_beneficiary' => $faker->boolean(20), // 20% chance of being a 4Ps beneficiary
                    'is_employed' => $faker->boolean(50), // 50% chance of being employed
                    'educational_attainment' => $faker->randomElement(['None', 'Elementary', 'High School', 'Bachelor\'s Degree']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
