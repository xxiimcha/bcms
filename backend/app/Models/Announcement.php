<?php
namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index()
    {
        return Announcement::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_user_type' => 'required|string|in:all,admin,user',
        ]);

        return Announcement::create($request->all());
    }

    public function show($id)
    {
        return Announcement::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->update($request->all());
        return $announcement;
    }

    public function destroy($id)
    {
        Announcement::destroy($id);
        return response()->json(['message' => 'Announcement deleted successfully']);
    }
}
