<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CensusProfileEmployment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'census_profile_employment';

    protected $fillable = [
        'census_id',
        'duration',
        'employer_name',
        'employer_address',
        'monthly_salary'
    ];

    // Define relationship with CensusProfile
    public function censusProfile()
    {
        return $this->belongsTo(BarangayResident::class, 'census_id');
    }
}
