<?php
// App/Models/CensusProfile.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CensusProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'date_of_reinterview',
        'respondent_name',
        'respondent_address',
        'total_members',
        'male_members',
        'female_members',
    ];

    /**
     * Get the household members for the census profile.
     */
    public function householdMembers()
    {
        return $this->hasMany(HouseholdMember::class);
    }
}
