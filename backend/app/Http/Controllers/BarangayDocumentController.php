<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\BarangayDocumentResource;
use App\Models\BarangayDocument;

class BarangayDocumentController extends Controller
{
    public function documents(Request $request)
    {
        $documents = BarangayDocument::all();
        return BarangayDocumentResource::collection($documents);
    }

    public function document(Request $request)
    {
        return new BarangayDocumentResource(BarangayDocument::findOrFail($request->id) ?? null);
    }

    public function store(Request $request)  {
        return new BarangayDocumentResource(BarangayDocument::create($request->all()));
    }

    public function update(Request $request)
    {
        $document = BarangayDocument::findOrFail($request->id);

        $updates = [];

        // Check and update each field if it's different from the current value
        if ($request->has('certificate_type') && $request->certificate_type !== $document->certificate_type) {
            $updates['certificate_type'] = $request->certificate_type;
        }

        if ($request->has('certificate_value') && $request->certificate_value !== $document->certificate_value) {
            $updates['certificate_value'] = $request->certificate_value;
        }

        // Apply updates
        if (!empty($updates)) {
            $document->update($updates);
        }

        return new BarangayDocumentResource($document);
    }

    public function destroy(Request $request)
    {
        $document = BarangayDocument::findOrFail(($request->id) ?? null);
        return $document->delete();
    }
}
