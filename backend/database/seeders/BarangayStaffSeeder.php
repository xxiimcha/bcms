<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BarangayStaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\BarangayStaff::create([
            'first_name' => 'John',
            'last_name' => 'Legend',
            'email' => 'john.legend@gmail.com',
            'password' => Hash::make('12345'),
            'email_verified_at' => now(),
            'role' => 'admin'
        ]);

        \App\Models\BarangayStaff::factory(10)->create();
    }
}
