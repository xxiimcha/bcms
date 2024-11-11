<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCensusProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('census_profiles', function (Blueprint $table) {
            $table->id();
            $table->date('date_of_reinterview')->nullable();
            $table->string('respondent_name');
            $table->string('respondent_address');
            $table->integer('total_members')->nullable();
            $table->integer('male_members')->nullable();
            $table->integer('female_members')->nullable();
            // Add other personal and residence fields as needed
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
        Schema::dropIfExists('census_profiles');
    }
}
