<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create("privacy_policies", function (Blueprint $table) {
            $table->id();
            $table->foreignId("privacy_id")->constrained("privacies");
            $table->foreignId("policy_id")->constrained("policies");
            $table->unsignedTinyInteger("order")->default(1);
            $table->boolean("collapsible")->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists("privacy_policies");
    }
};
