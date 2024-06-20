<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrivacyPolicyResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        $route = $request->route()?->getName() ?? "privacy.list";
        $result = [
            "id" => $this->hash,
            "date" => $this->created_at,
            "active" => $this->activated_at,
        ];

        if (in_array($route, ["privacy.add", "privacy.get", "privacy.activate", "policy.prompt"])) {
            $result = array_merge($result, [
                "prompt" => $this->prompt->content,
            ]);
        }

        if (in_array($route, ["privacy.add", "privacy.get", "privacy.activate", "policy.public"])) {
            $policies = PolicyResource::collection(
                $this->policies()
                    ->orderByPivot("order")
                    ->get()
            );
            $result = array_merge($result, [
                "policies" => $policies,
            ]);
        }

        return $result;
    }
}
