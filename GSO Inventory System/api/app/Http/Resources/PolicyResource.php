<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PolicyResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            "id" => $this->hash,
            "title" => $this->title,
            "content" => $this->content,
            "order" => $this->pivot->order,
            "collapsible" => $this->pivot->collapsible,
        ];
    }
}
