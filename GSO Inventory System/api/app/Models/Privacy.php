<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Privacy extends AppModel {
    protected $fillable = ["user_id", "prompt_id", "activated_at"];

    protected $casts = [
        "activated_at" => "datetime",
    ];

    public function user(): User {
        return $this->belongsTo(User::class);
    }

    public function prompt() {
        return $this->belongsTo(PrivacyPrompt::class);
    }

    public function policies(): BelongsToMany {
        return $this->belongsToMany(
            Policy::class,
            "privacy_policies",
            "privacy_id",
            "policy_id"
        )->withPivot(["order", "collapsible"]);
    }
}
