<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PrivacyPrompt;
use App\Models\Policy;
use App\Models\Privacy;

use App\Http\Resources\PrivacyPolicyResource;

class PrivacyPolicyController extends Controller
{
    public function __construct()
    {
        $this->middleware("role:Admin", [
            "only" => [
                "getPolicies",
                "getPolicy",
                "activatePrivacyPolicy",
                "createPrivacyPolicy",
            ],
        ]);
    }

    public function getPublicPolicy()
    {
        $privacy = Privacy::whereNotNull("activated_at")->first();
        return response(["data" => new PrivacyPolicyResource($privacy)]);
    }

    public function getPolicies(Request $request)
    {
        $limit = $request->input("limit", 25);
        $offset = $request->input("offset", 0);
        $order = $request->input("order", "asc");
        $orderBy = $request->input("orderBy", "created_at");
        $_order = $order == "asc" ? "ASC" : "DESC";

        $sort = ["date" => "created_at"];

        $orderBy = $sort[$orderBy] ?? "created_at";

        $privacyPolicies = Privacy::limit($limit)
            ->offset($offset)
            ->orderBy("activated_at", "ASC")
            ->orderBy($orderBy, $_order)
            ->get();

        $count = Privacy::count();

        return response([
            "data" => PrivacyPolicyResource::collection($privacyPolicies),
            "count" => $count,
        ]);
    }

    public function getPolicy(Request $request, Privacy $privacy)
    {
        return response(["data" => new PrivacyPolicyResource($privacy)]);
    }

    public function activatePrivacyPolicy(Privacy $privacy)
    {
        $current = Privacy::whereNotNull("activated_at")->first();
        $current->update(["activated_at" => null]);
        $privacy->update(["activated_at" => now()]);
        $this->logInfo(
            "Active Privacy Policy Changed!",
            "Privacy Policy Management",
            $this->ACTION_UPDATE,
            $current->getOriginal(),
            $privacy
        );
        return response(["data" => new PrivacyPolicyResource($privacy)]);
    }

    public function createPrivacyPolicy(Request $request)
    {
        $request->validate([
            "prompt" => "required",
            "policies" => "required|array",
            "policies.*.title" => "required_if:policies.*.collapsible,==,true",
            "policies.*.content" => "required",
        ]);

        $prompt = $this->preparePrompt($request->input("prompt"));
        $policies = $this->preparePolicies($request->input("policies"));

        $privacy = Privacy::where("prompt_id", $prompt->id)
            ->where(function ($q) use ($policies) {
                $q->whereHas(
                    "policies",
                    function ($qq) use ($policies) {
                        $qq->whereIn("policy_id", array_keys($policies));
                    },
                    "=",
                    count($policies)
                );
            })
            ->first();

        if (!$privacy) {
            $privacy = Privacy::create([
                "user_id" => $request->user()->id,
                "prompt_id" => $prompt->id,
            ]);
            $privacy->policies()->attach($policies);
            // $privacy->refresh();
            $this->logInfo(
                "New Privacy Policy Created!",
                "Privacy Policy Management",
                $this->ACTION_CREATE,
                null,
                $privacy
            );
        } else {
            foreach ($policies as $key => $policy) {
                $privacy->policies()->updateExistingPivot($key, [
                    "order" => $policy["order"],
                    "collapsible" => $policy["collapsible"],
                ]);
            }
            $this->logInfo(
                "Privacy Policy order & style Updated!",
                "Privacy Policy Management",
                $this->ACTION_CREATE,
                null,
                $privacy
            );
        }

        return response([
            "message" => "Policies updated!",
            "data" => new PrivacyPolicyResource($privacy),
        ]);
    }

    private function preparePrompt(string $prompt)
    {
        $promptModel = PrivacyPrompt::where("content", $prompt)->first();
        if (!$promptModel) {
            $promptModel = PrivacyPrompt::create([
                "content" => $prompt,
            ]);
        }
        return $promptModel;
    }

    private function preparePolicies(array $policies)
    {
        $plcs = [];
        foreach ($policies as $policy) {
            $tmp = $this->preparePolicy($policy["title"], $policy["content"]);
            $plcs[$tmp->id] = [
                "order" => $policy["order"],
                "collapsible" => $policy["collapsible"],
            ];
        }
        return $plcs;
    }

    private function preparePolicy($title, $content)
    {
        $policy = Policy::where("title", $title)
            ->where("content", $content)
            ->first();
        if (!$policy) {
            $policy = Policy::create([
                "title" => $title,
                "content" => $content,
            ]);
        }
        return $policy;
    }
}
