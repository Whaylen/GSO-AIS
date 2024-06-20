<?php

namespace App\Traits;
use Illuminate\Http\Request;

use App\Models\Gender;

trait GenderTrait {
    private $validGenderSort = ["name", "description", "active"];

    public function searchGenderQuery($search = "") {
        $searchKeys = preg_split("/\s+/", $search, -1, PREG_SPLIT_NO_EMPTY);
        $genders = Gender::where(function ($query) use ($searchKeys) {
            foreach ($searchKeys as $key) {
                $query->orWhere("name", "ILIKE", "%" . $key . "%");
            }
        });
        return $genders;
    }

    public function searchGender(
        $search,
        $limit = 25,
        $offset = 0,
        $orderBy = "name",
        $order = "asc"
    ) {
        if (in_array($orderBy, $this->validGenderSort)) {
            $genders = $this->searchGenderQuery($search)
                ->when($orderBy == "active", fn($q) => $q->orderBy("disabled_at", $order))
                ->when(!in_array($orderBy, ["active"]), fn($q) => $q->orderBy($orderBy, $order))
                ->offset($offset)
                ->limit($limit);

            return $genders;
        }
        throw new \Exception("Invalid sort field");
    }

    public function searchGenderCount($search = "") {
        $genders = $this->searchGenderQuery($search)->selectRaw("count(*) as count");
        return $genders;
    }
}
