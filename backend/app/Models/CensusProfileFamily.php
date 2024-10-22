<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CensusProfileFamily extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'census_profile_family';

    protected $fillable = [
        'census_id',
        'full_name',
        'position',
        'age',
        'birthdate',
        'civil_status',
        'occupation',
    ];

    // Relationship with CensusProfile
    public function censusProfile()
    {
        return $this->belongsTo(BarangayResident::class, 'census_id');
    }
}
