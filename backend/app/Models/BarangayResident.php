<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BarangayResident extends Authenticatable implements CanResetPassword
{
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    protected $table = 'barangay_resident'; // Reflects the current table name

    protected $fillable = [
        'resident_id',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'password',
        'role',
        'gender',
        'age',
        'birthdate',
        'civil_status',
        'contact_number',
        'place_of_birth',
        'present_address',
        'barangay',
        'city',
        'previous_address',
        'house_owner',      // Name of house owner (if rented)
        'months_years',     // Number of months/years stayed in barangay
        'residency_type',   // Type of residency (owner/renter)
        'purpose',          // Purpose of the application
        'other_purpose',    // For custom purposes
        'certificate',      // Selected certificate/form
        'date'              // Date of the application
    ];

    /**
     * Password Reset Methods
     */

    // Get the email address that should be used for password reset notifications
    public function getEmailForPasswordReset()
    {
        return $this->email;
    }

    // Send the password reset notification
    public function sendPasswordResetNotification($token)
    {
        $url = env('APP_URL') . '/reset-password?token=' . $token;
        $this->notify(new ResetPasswordNotification($url));
    }
}
