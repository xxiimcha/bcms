<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CensusProfileFamilyResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'census_id' => $this->census_id,
            'full_name' => $this->full_name,
            'position' => $this->position,
            'age' => $this->age,
            'birthdate' => $this->birthdate,
            'civil_status' => $this->civil_status,
            'occupation' => $this->occupation,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'deletedAt' => $this->deleted_at,
        ];
    }
}
