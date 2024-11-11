<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

use App\Http\Controllers\RegisterController;
use App\Http\Controllers\ForgotPasswordController;

use App\Http\Controllers\BarangayResidentController;
use App\Http\Controllers\BarangayStaffController;
use App\Http\Controllers\BarangayDocumentController;
use App\Http\Controllers\BarangayResidentDocumentController;
use App\Http\Controllers\SpecialURLController;
use App\Http\Controllers\CensusProfileController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [RegisterController::class, 'register']);
Route::post('forgot-password', [ForgotPasswordController::class, 'forgot_password']);
Route::get('open-in-desktop', [SpecialURLController::class, 'open_in_desktop']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/census-profiles', [CensusProfileController::class, 'store']);
    Route::get('/census-profiles', [CensusProfileController::class, 'index']);
    Route::get('/census-profiles/{id}', [CensusProfileController::class, 'show']);
    Route::delete('/census-profiles/{id}', [CensusProfileController::class, 'destroy']);

    Route::get('/residents', [BarangayResidentController::class, 'residents']);
    Route::get('/resident/{id}', [BarangayResidentController::class, 'resident']);
    Route::post('/resident', [BarangayResidentController::class, 'store']);
    Route::patch('/resident', [BarangayResidentController::class, 'update']);
    Route::delete('/resident/{id}', [BarangayResidentController::class, 'destroy']);
    Route::post('/resident/change-password', [BarangayResidentController::class, 'resident_change_password']);
    Route::get('/resident-census/classifications', [BarangayResidentController::class, 'getAllClassificationCounts']);
    Route::get('/residents/forecast', [BarangayResidentController::class, 'get_forecast']);

    Route::get('/staffs', [BarangayStaffController::class, 'staffs']);
    Route::get('/staff/{id}', [BarangayStaffController::class, 'staff']);
    Route::post('/staff', [BarangayStaffController::class, 'store']);
    Route::patch('/staff', [BarangayStaffController::class, 'update']);
    Route::delete('/staff/{id}', [BarangayStaffController::class, 'destroy']);
    Route::post('/staff/change-password', [BarangayStaffController::class, 'staff_change_password']);

    Route::get('/documents', [BarangayDocumentController::class, 'documents']);
    Route::get('/document/{id}', [BarangayDocumentController::class, 'document']);
    Route::post('/document', [BarangayDocumentController::class, 'store']);
    Route::patch('/document', [BarangayDocumentController::class, 'update']);
    Route::delete('/document/{id}', [BarangayDocumentController::class, 'destroy']);

    Route::get('/resident-documents', [BarangayResidentDocumentController::class, 'barangay_documents_residents']);
    Route::get('/resident-document/{id}', [BarangayResidentDocumentController::class, 'barangay_documents_resident']);
    Route::post('/resident-document', [BarangayResidentDocumentController::class, 'store']);
    Route::get('/resident-document-history/{id}', [BarangayResidentDocumentController::class, 'barangay_documents_resident_history']);
});
