<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BarangayResidentDocument extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'barangay_resident_document';

    protected $fillable = [
        'resident_id',
        'certificate_type',
        'certificate_file',
        'date_issued',
        'purpose',
        'status'
    ];
}
