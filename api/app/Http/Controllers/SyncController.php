<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Meal;
use App\Models\MealRecord;
use Carbon\Carbon;

class SyncController extends Controller
{

    public function syncDown(Request $request)
    {
        $user = $request->user();
        

        $meals = Meal::where('data', '>=', Carbon::today())->get();

        $myRecords = MealRecord::where('user_id', $user->id)->get();

        return response()->json([
            'meals' => $meals,
            'my_records' => $myRecords
        ]);
    }
    public function syncUp(Request $request)
    {
        $request->validate([
            'records' => 'required|array'
        ]);

        $user = $request->user();
        $syncedCount = 0;

        foreach ($request->records as $localRecord) {
            $meal = Meal::where('qr_code_hash', $localRecord['qr_code_hash'])->first();

            if ($meal) {
                try {
                    MealRecord::firstOrCreate([
                        'user_id' => $user->id,
                        'meal_id' => $meal->id
                    ], [
                        'scanned_at' => $localRecord['scanned_at']
                    ]);
                    $syncedCount++;
                } catch (\Exception $e) {

                }
            }
        }

        return response()->json(['message' => 'Sincronizado', 'count' => $syncedCount]);
    }
}