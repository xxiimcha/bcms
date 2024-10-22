<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BarangayResidentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
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
            'employed' =>  $this->employed,
            'occupation' => $this->occupation,
            'monthly_salary' => $this->monthly_salary,
            'education' => $this->education,
            'purok' => $this->purok,
            'street' => $this->street,
            'barangay' => $this->barangay,
            'city' => $this->city,
            'zipcode' => $this->zipcode,
            'role' => $this->role,
            'household_count' => $this->household_count,
            'address' => $this->address,
            'ownership' => $this->ownership,
            'length_of_stay' => $this->length_of_stay,
            'provincial_address' => $this->provincial_address,
            'height' => $this->height,
            'weight' => $this->weight,
            'religion' => $this->religion,
            'voter' => $this->voter,
            'four_ps' => $this->four_ps,
            'pwd' => $this->pwd,
            'elementary' => $this->elementary,
            'high_school' => $this->high_school,
            'vocational' => $this->vocational,
            'college' => $this->college,
            'password' => $this->password,
            'employerRows' => CensusProfileEmploymentResource::collection($this->whenLoaded('employments')),
            'familyRows' => CensusProfileFamilyResource::collection($this->whenLoaded('families')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
