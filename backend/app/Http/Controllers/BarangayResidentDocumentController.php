<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\BarangayResidentDocumentResource;
use App\Models\BarangayResidentDocument;

class BarangayResidentDocumentController extends Controller
{
    public function update(Request $request, $id)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'certificate_type' => 'string|max:255',
            'certificate_file' => 'nullable|string|max:255',
            'purpose' => 'string|max:255',
            'status' => 'string|max:50',
        ]);

        try {
            // Find the document by ID
            $residentDocument = BarangayResidentDocument::findOrFail($id);

            // Update the document with the validated data
            $residentDocument->update($validatedData);

            // Return the updated document
            return response()->json([
                'message' => 'Resident document updated successfully',
                'data' => $residentDocument,
            ], 200);
        } catch (\Exception $e) {
            // Handle errors
            return response()->json([
                'message' => 'Error updating resident document',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
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
