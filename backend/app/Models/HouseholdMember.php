<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HouseholdMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'census_profile_id',
        'name',
        'relationship',
        'sex',
        'date_of_birth',
        'age',
        'is_pwd',            // New field for PWD status
        'is_4ps_beneficiary', // New field for 4Ps beneficiary status
        'is_employed',
        'educational_attainment'
    ];

    /**
     * Get the census profile that owns the household member.
     */
    public function censusProfile()
    {
        return $this->belongsTo(CensusProfile::class);
    }
}
