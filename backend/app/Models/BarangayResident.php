<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Auth\CanResetPassword;
use App\Models\CensusProfileEmployment;
use App\Models\CensusProfileFamily;
use Illuminate\Database\Eloquent\Relations\HasMany;


class BarangayResident extends Authenticatable implements CanResetPassword
{
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    protected $table = 'barangay_resident'; // Updated to reflect the new table name

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'gender',
        'age',
        'birthdate',
        'civil_status',
        'household_count',
        'email',
        'contact_number',
        'place_of_birth',
        'employed',
        'occupation',
        'monthly_salary',
        'purok',
        'street',
        'barangay',
        'city',
        'zipcode',
        'role',
        'password',
        'resident_id',
        'profile_status',
        'education',
        'address',
        'ownership',
        'length_of_stay',
        'provincial_address',
        'height',
        'weight',
        'religion',
        'voter',
        'four_ps',
        'pwd',
        'elementary',
        'high_school',
        'vocational',
        'college'
    ];

    public function families(): HasMany
    {
        return $this->hasMany(CensusProfileFamily::class, 'census_id');
    }

    public function employments(): HasMany
    {
        return $this->hasMany(CensusProfileEmployment::class, 'census_id');
    }


    /**
     * Get the email address that should be used for password reset notifications.
     *
     * @return string
     */
    public function getEmailForPasswordReset()
    {
        return $this->email;
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $url = env('APP_URL') . '/reset-password?token=' . $token;
        $this->notify(new ResetPasswordNotification($url));
    }
}
