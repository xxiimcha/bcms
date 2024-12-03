<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BarangayResidentDocument;
use App\Models\Notification; // Import the Notification model

class DashboardController extends Controller
{
    // Total Certificates Issued
    public function getTotalCertificates()
    {
        try {
            $total = BarangayResidentDocument::count();
            return response()->json(['total' => $total], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch total certificates', 'message' => $e->getMessage()], 500);
        }
    }

    // Certificate Types
    public function getCertificateTypeData()
    {
        try {
            $data = BarangayResidentDocument::selectRaw('certificate_type, COUNT(*) as count')
                ->groupBy('certificate_type')
                ->orderBy('count', 'DESC') // Optional: Order by count for better visualization
                ->get();

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch certificate types', 'message' => $e->getMessage()], 500);
        }
    }

    // Certificate Purposes
    public function getPurposeData()
    {
        try {
            $data = BarangayResidentDocument::selectRaw('purpose, COUNT(*) as count')
                ->groupBy('purpose')
                ->orderBy('count', 'DESC') // Optional: Order by count for better visualization
                ->get();

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch purposes', 'message' => $e->getMessage()], 500);
        }
    }

    // Issuance Timeline
    public function getIssuanceTimelineData()
    {
        try {
            $data = BarangayResidentDocument::selectRaw('DATE(date_issued) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date', 'ASC')
                ->get();

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch issuance timeline', 'message' => $e->getMessage()], 500);
        }
    }

    // Notifications for Admin (where target_user = 0)
    public function getNotifications()
    {
        try {
            $notifications = Notification::select('id', 'target_user', 'message', 'status', 'created_at')
                ->where('target_user', 0) // Filter for admin-specific notifications
                ->orderBy('created_at', 'DESC')
                ->get();

            return response()->json($notifications, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch notifications', 'message' => $e->getMessage()], 500);
        }
    }

    // Forecasting Data (Example for Future Implementation)
    public function getForecastingData()
    {
        try {
            $currentYear = now()->year;

            $forecastData = BarangayResidentDocument::selectRaw('MONTH(date_issued) as month, COUNT(*) as count')
                ->whereYear('date_issued', $currentYear)
                ->groupBy('month')
                ->orderBy('month', 'ASC')
                ->get();

            return response()->json($forecastData, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch forecasting data', 'message' => $e->getMessage()], 500);
        }
    }
}
