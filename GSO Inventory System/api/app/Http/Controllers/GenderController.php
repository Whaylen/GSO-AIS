<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\GenderTrait;

use App\Models\Gender;

use App\Http\Resources\GenderResource;

class GenderController extends Controller {
    use GenderTrait;

    public function __construct() {
        $permissions = ["gender_list", "gender_add", "gender_edit", "gender_toggle"];

        $this->middleware("permission:" . implode("|", $permissions), [
            "only" => ["searchGenders"],
        ]);

        $this->middleware("permission:gender_add", ["only" => "addGender"]);
        $this->middleware("permission:gender_edit", ["only" => "updateGender"]);
        $this->middleware("permission:gender_toggle", ["only" => "toggleGender"]);
    }

    public function getGenders() {
        $genders = Gender::select("id", "name", "description AS desc")
            ->where("disabled_at", null)
            ->orderBy("id")
            ->get();

        return response([
            "data" => $genders->map(function ($item, $key) {
                return [
                    "id" => $item->hash,
                    "name" => $item->name,
                    "desc" => $item->desc,
                ];
            }),
            "count" => $genders->count(),
        ]);
    }

    public function searchGenders(Request $request) {
        $search = $request->input("search", "");
        $limit = $request->input("limit", 25);
        $offset = ($request->input("page", 1) - 1) * $limit;
        $orderBy = $request->input("orderBy", "name");
        $order = $request->input("order", "asc");
        $column = $request->input("column", "name");

        $genders = $this->searchGender($search, $limit, $offset, $orderBy, $order, $column)->get();
        $count = $this->searchGenderCount($search, $column)->first()->count;

        return response([
            "data" => GenderResource::collection($genders),
            "count" => $count,
        ]);
    }

    public function addGender(Request $request) {
        $request->validate([
            "name" => "required|max:255|unique:genders,name",
        ]);

        $gender = Gender::create([
            "name" => $request->input("name"),
            "description" => $request->input("desc", null),
        ]);

        $this->logInfo(
            "New Gender created: $gender->name",
            "Gender management",
            $this->ACTION_CREATE,
            null,
            $gender
        );

        return new GenderResource($gender);
    }

    public function updateGender(Request $request, Gender $gender) {
        $request->validate([
            "name" => "required|max:255|unique:genders,name," . $gender->id . ",id",
        ]);

        $old = json_decode(json_encode(new GenderResource($gender)));

        $gender->update([
            "name" => $request->input("name"),
            "description" => $request->input("description", null),
        ]);

        $result = new GenderResource($gender);
        $this->logInfo("Gender updated!", "Gender management", $this->ACTION_UPDATE, $old, $result);
        return $result;
    }

    public function toggleGender(Gender $gender) {
        $status = !!$gender->disabled_at ? null : now();
        $gender->update(["disabled_at" => $status]);
        $this->logInfo(
            "Gender (" . $gender->name . ") " . (!!$status ? "disabled" : "enabled"),
            "Gender management",
            !!$status ? $this->ACTION_DELETE : $this->ACTION_RESTORED
        );
        return new GenderResource($gender);
    }
}
