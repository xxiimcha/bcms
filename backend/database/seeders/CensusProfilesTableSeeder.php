<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CensusProfile;
use Faker\Factory as Faker;

class CensusProfilesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Create 10 Census Profiles
        for ($i = 0; $i < 10; $i++) {
            CensusProfile::create([
                'date_of_reinterview' => $faker->date(),
                'respondent_name' => $faker->name,
                'respondent_address' => $faker->address,
                'total_members' => $faker->numberBetween(2, 8),
                'male_members' => $faker->numberBetween(1, 4),
                'female_members' => $faker->numberBetween(1, 4),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
