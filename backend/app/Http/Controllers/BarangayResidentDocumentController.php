<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\BarangayResidentDocumentResource;
use App\Models\BarangayResidentDocument;

class BarangayResidentDocumentController extends Controller
{
    public function barangay_documents_residents(Request $request)
    {
        $residents = BarangayResidentDocument::all();
        return BarangayResidentDocumentResource::collection($residents);
    }

    public function barangay_documents_resident(Request $request, $id)
    {
        if ($id) {
            $document = BarangayResidentDocument::where('resident_id', $id)->orderByDesc('created_at')->first();
            if($document) {
                return new BarangayResidentDocumentResource($document);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    public function barangay_documents_resident_history(Request $request, $id)
    {
        if ($id) {
            $document = BarangayResidentDocument::where('resident_id', $id)->get();
            if($document) {
                return BarangayResidentDocumentResource::collection($document);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    public function store(Request $request)  {
        return new BarangayResidentDocumentResource(BarangayResidentDocument::create($request->all()));
    }
}
