<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBarangayResidentDocumentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('barangay_resident_document', function (Blueprint $table) {
            $table->id();
            $table->string('resident_id')->nullable();
            $table->string('certificate_type')->nullable();
            $table->longText('certificate_file')->nullable();
            $table->string('date_issued')->nullable();
            $table->string('purpose')->nullable();
            $table->string('status')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        // DB::statement("ALTER TABLE barangay_resident_document ADD certificate_file LONGBLOB NULL AFTER certificate_type");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('barangay_resident_document');
    }
}
