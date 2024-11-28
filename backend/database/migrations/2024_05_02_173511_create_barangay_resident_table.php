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
            $table->string('resident_id')->nullable(); // e.g., RES001, incremental
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->text('present_address')->nullable();
            $table->string('gender')->nullable(); // Male/Female
            $table->integer('age')->nullable();
            $table->string('civil_status')->nullable(); // Single, Married, etc.
            $table->date('birthdate')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->string('password')->nullable();
            $table->string('role')->default('resident'); // Defaults to 'resident'

            // Residency details
            $table->text('previous_address')->nullable();
            $table->string('house_owner')->nullable(); // Name of house owner (if rented)
            $table->string('months_years')->nullable(); // Duration of stay in barangay
            $table->string('residency_type')->nullable(); // Owner/Renter

            // Application purpose and certificate
            $table->string('purpose')->nullable();
            $table->string('other_purpose')->nullable();
            $table->string('certificate')->nullable(); // Selected certificate/form type

            // Timestamps
            $table->date('date')->nullable(); // Date of application
            $table->timestamps();
            $table->softDeletes(); // For soft deletion
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
