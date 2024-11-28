<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BarangayResidentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'resident_id' => $this->resident_id,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'gender' => $this->gender,
            'age' => $this->age,
            'birthdate' => $this->birthdate,
            'civil_status' => $this->civil_status,
            'email' => $this->email,
            'contact_number' => $this->contact_number,
            'place_of_birth' => $this->place_of_birth,
            'present_address' => $this->present_address,
            'barangay' => $this->barangay,
            'city' => $this->city,
            'previous_address' => $this->previous_address,
            'house_owner' => $this->house_owner,
            'months_years' => $this->months_years,
            'residency_type' => $this->residency_type,
            'purpose' => $this->purpose,
            'other_purpose' => $this->other_purpose,
            'certificate' => $this->certificate,
            'date' => $this->date,
            'role' => $this->role,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
