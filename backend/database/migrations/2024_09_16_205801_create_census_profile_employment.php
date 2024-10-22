<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCensusProfileEmployment extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('census_profile_employment', function (Blueprint $table) {
            $table->id();
            $table->string('census_id');
            $table->string('duration')->nullable();
            $table->text('employer_name')->nullable();
            $table->text('employer_address')->nullable();
            $table->text('monthly_salary')->nullable();
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
        Schema::dropIfExists('census_profile_employment');
    }
}
