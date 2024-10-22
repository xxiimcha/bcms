<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CensusProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'address' => $this->address,
            'ownership' => $this->ownership,
            'length_of_stay' => $this->length_of_stay,
            'provincial_address' => $this->provincial_address,
            'gender' => $this->gender,
            'civil_status' => $this->civil_status,
            'birthdate' => $this->birthdate,
            'place_of_birth' => $this->place_of_birth,
            'contact_number' => $this->contact_number,
            'height' => $this->height,
            'weight' => $this->weight,
            'religion' => $this->religion,
            'email' => $this->email,
            'voter' => $this->voter,
            'four_ps' => $this->four_ps,
            'pwd' => $this->pwd,
            'elementary' => $this->elementary,
            'elementary_address' => $this->elementary_address,
            'high_school' => $this->high_school,
            'high_school_address' => $this->high_school_address,
            'vocational' => $this->vocational,
            'vocational_address' => $this->vocational_address,
            'college' => $this->college,
            'college_address' => $this->college_address,
            'employerRows' => CensusProfileEmploymentResource::collection($this->whenLoaded('employments')),
            'familyRows' => CensusProfileFamilyResource::collection($this->whenLoaded('families')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
