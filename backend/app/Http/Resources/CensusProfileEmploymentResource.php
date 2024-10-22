<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CensusProfileEmploymentResource extends JsonResource
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
            'census_id' => $this->census_id,
            'duration' => $this->duration,
            'employer_name' => $this->employer_name,
            'employer_address' => $this->employer_address,
            'monthly_salary' => $this->monthly_salary,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
