<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBarangayResidentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('barangay_resident', function (Blueprint $table) {
            $table->id();
            $table->string('resident_id')->nullable();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->text('address')->nullable();
            $table->string('ownership')->nullable();
            $table->string('length_of_stay')->nullable();
            $table->text('provincial_address')->nullable();
            $table->string('gender')->nullable();
            $table->integer('age')->nullable();
            $table->string('civil_status')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('height')->nullable();
            $table->string('weight')->nullable();
            $table->string('religion')->nullable();
            $table->string('email')->nullable();
            $table->string('password')->nullable();
            $table->string('voter')->nullable();
            $table->string('four_ps')->nullable();
            $table->string('pwd')->nullable();
            $table->string('employed')->nullable();
            $table->string('occupation')->nullable();
            $table->string('monthly_salary')->nullable();
            $table->string('purok')->nullable();
            $table->string('street')->nullable();
            $table->string('barangay')->nullable();
            $table->string('city')->nullable();
            $table->string('zipcode')->nullable();
            $table->string('role')->nullable();
            $table->string('education')->nullable();
            $table->string('profile_status')->nullable();
            $table->integer('household_count')->nullable();

            $table->text('elementary')->nullable();
            $table->text('elementary_address')->nullable();

            $table->text('high_school')->nullable();
            $table->text('high_school_address')->nullable();

            $table->text('vocational')->nullable();
            $table->text('vocational_address')->nullable();

            $table->text('college')->nullable();
            $table->text('college_address')->nullable();

            $table->string('otp')->nullable();
            $table->dateTime('otp_expires_at')->nullable();
            $table->string('two_factor')->nullable();
            $table->dateTime('two_factor_expires_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('barangay_resident');
    }
}
