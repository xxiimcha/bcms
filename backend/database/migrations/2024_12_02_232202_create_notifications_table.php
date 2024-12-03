<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('target_user'); // Foreign key to users table
            $table->string('message');                // Notification message
            $table->enum('status', ['Unread', 'Read'])->default('Unread'); // Status of the notification
            $table->timestamps();

            $table->foreign('target_user')->references('id')->on('barangay_resident')->onDelete('cascade'); // Foreign key
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
