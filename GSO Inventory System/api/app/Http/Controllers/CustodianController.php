<?php

namespace App\Http\Controllers;

use App\Models\{Custodian, Par};
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class CustodianController extends Controller
{
    public function list(Request $request) : JsonResponse {
        $custodians = Custodian::get();
        return response()->json($custodians);
    }
    public function show(Request $request, Custodian $custodian) : JsonResponse {
        return response()->json($custodian);
    }
    public function create(Request $request) : JsonResponse {
        $fields = $request->validated();
        // TODO:: create custodian
        // 1. Create Profile for Custodian
        // $profile = Profile::create($fields);
        // 2. Create Custodian
        // $custodian = Custodian::create([
        //     'employee_id' => 'asldfkjasdlfkj',
        //     'profile_id' => $profile->id
        // ]);
        return response()->json();

        $custodian = null;
        return response()->json($custodian);
    }
    public function update(Request $request, Custodian $custodian) : JsonResponse {
        $fields = $request->validated();
        // TODO:: update custodian
        // $custodian->update($fields);
        return response()->json($custodian);
    }
    public function delete(Request $request, Custodian $custodian) : JsonResponse {
        $custodian->delete();
        return response()->json("Custodian has been deleted.");
    }
    public function restore(Request $request, String $custodian) : JsonResponse {
        //TODO:: restore business logic.
        return response()->json();
    }
    public function bindPar(Request $request, Custodian $custodian) : JsonResponse {
        // TODO:: bind Par to custodian.
        return response()->json();
    }

    public function removePar(Request $request, Custodian $custodian, Par $par) : JsonResponse {
        //TODO:: remove bounded par from custodian.
        return response()->json();
    }

    public function transfer(Request $request) : JsonResponse {
        //TODO:: transfer par from a custodian to another.
        return response()->json();
    }
}
