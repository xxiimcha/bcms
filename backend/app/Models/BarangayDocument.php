<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangayDocument extends Model
{
    use HasFactory;

    protected $table = 'barangay_document';

    protected $fillable = [
        'certificate_type',
        'certificate_value'
    ];
}
