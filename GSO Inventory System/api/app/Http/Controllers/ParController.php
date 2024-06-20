<?php

namespace App\Http\Controllers;

use App\Http\Requests\ParRequests\CreateParRequest;
use Illuminate\Http\JsonResponse;
use App\Models\Par;
use Illuminate\Http\Request;

class ParController extends Controller
{
    public function list(Request $request) : JsonResponse {
        // $fields = $request->validated();

        $pars = Par::get();

        return response()->json($pars);
    }
    public function show(Request $request, Par $par) : JsonResponse {
        return response()->json($par);
    }
    public function create(CreateParRequest $request) : JsonResponse {
        $fields = $request->validated();

        $par = Par::create($fields);
        return response()->json($par);
    }
    public function update(Request $request) : JsonResponse {
        $fields = $request->validated();
        // $par = Par::update($fields);
        return response()->json([]);
    }
    public function delete(Request $request) : JsonResponse {
        $fields = $request->validated();

        return response()->json();
    }
    public function restore(Request $request) : JsonResponse {
        $fields = $request->validated();

        return response()->json();
    }
}
