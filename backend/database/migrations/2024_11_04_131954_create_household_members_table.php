<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHouseholdMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('household_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('census_profile_id')->constrained('census_profiles')->onDelete('cascade');
            $table->string('name');
            $table->string('relationship');
            $table->enum('sex', ['Male', 'Female']);
            $table->string('date_of_birth'); // Store as MM/YYYY
            $table->integer('age');
            $table->boolean('is_pwd')->default(false); // Field for PWD status
            $table->boolean('is_4ps_beneficiary')->default(false); // Field for 4Ps beneficiary status
            $table->boolean('is_employed')->nullable(); // Field for employment status, not required
            $table->string('educational_attainment')->nullable(); // Field for educational attainment, not required
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('household_members');
    }
}
