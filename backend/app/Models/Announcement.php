<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    // Specify the fields that are mass-assignable
    protected $fillable = ['title', 'content', 'target_user_type'];

    // Optionally, specify the table name if it doesn't match Laravel's naming convention
    protected $table = 'announcements';
}
