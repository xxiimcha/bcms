<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\BarangayResident;

class BarangayResidentFactory extends Factory
{
    protected $model = BarangayResident::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $monthlySalaryOptions = [
            'Less than 5,000',
            '10,001 - 15,000',
            '15,001 - 20,000',
            '20,001 - 25,000',
            '25,001 - 30,000',
            '30,001 - 35,000',
            '35,001 - 40,000',
            '40,001 and above',
        ];

        $educ = [
            "Some Elementary",
            "Elementary Graduate",
            "Some High School",
            "High School Graduate",
            "Some College",
            "College Graduate",
            "Junior High School Graduate",
            "Vocational Graduate",
            "Primary and Below",
            "Some ALS",
            "Masters",
            "ALS"
        ];

        $purok = [
            "Purok 1",
            "Purok 2",
            "Purok 3",
            "Purok 4",
            "Purok 5",
            "Purok 6",
            "Purok 7",
        ];

        $employed = $this->faker->randomElement(['Yes', 'No']);
        $randomDate = $this->generateRandomDate('2020-01-01', '2024-12-31');

        return [
            'resident_id' => function () {
                $maxId = (int) BarangayResident::max('id');
                return "RES-" . ($maxId + 1);
            },
            'first_name' => $this->faker->firstName,
            'middle_name' => $this->faker->optional()->firstName,
            'last_name' => $this->faker->lastName,
            'address' => $this->faker->optional()->address,
            'ownership' => $this->faker->optional()->word,
            'length_of_stay' => $this->faker->optional()->numberBetween(1, 30),
            'provincial_address' => $this->faker->optional()->address,
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'age' => $this->faker->numberBetween(18, 80),
            'civil_status' => $this->faker->randomElement(['Single', 'Married', 'Widowed', 'Divorced']),
            'birthdate' => $this->faker->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d'),
            'place_of_birth' => $this->faker->optional()->city,
            'contact_number' => $this->faker->optional()->numerify('09########'), // Typical mobile number format
            'height' => $this->faker->optional()->randomFloat(2, 1.5, 2.0),
            'weight' => $this->faker->optional()->numberBetween(40, 100),
            'religion' => $this->faker->optional()->word,
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('12345'),
            'voter' => $this->faker->optional()->word,
            'four_ps' => $this->faker->optional()->word,
            'pwd' => $this->faker->optional()->word,
            'employed' => $employed,
            'occupation' => ($employed === 'No') ? null : $this->faker->optional()->jobTitle(),
            'monthly_salary' => $this->faker->randomElement($monthlySalaryOptions),
            'purok' => $this->faker->randomElement($purok),
            'street' => $this->faker->optional()->streetAddress,
            'barangay' => 'Rosario',
            'city' => 'Pasig City',
            'zipcode' => '1609',
            'role' => 'resident',
            'education' => $this->faker->randomElement($educ),
            'profile_status' => $this->faker->optional()->word,
            'household_count' => $this->faker->optional()->numberBetween(1, 10),
            'elementary' => $this->faker->optional()->word,
            'elementary_address' => $this->faker->optional()->address,
            'high_school' => $this->faker->optional()->word,
            'high_school_address' => $this->faker->optional()->address,
            'vocational' => $this->faker->optional()->word,
            'vocational_address' => $this->faker->optional()->address,
            'college' => $this->faker->optional()->word,
            'college_address' => $this->faker->optional()->address,
            'created_at' => $randomDate,
            'updated_at' => $randomDate
        ];
    }

    private function generateRandomDate($startDate, $endDate)
    {
        $start = strtotime($startDate);
        $end = strtotime($endDate);

        $randomTimestamp = mt_rand($start, $end);

        return date('Y-m-d H:i:s', $randomTimestamp);
    }
}
