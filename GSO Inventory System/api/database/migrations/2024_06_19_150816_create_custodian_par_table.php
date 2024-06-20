<?php

use App\Models\{Custodian, Par};
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('custodian_par', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Custodian::class);
            $table->foreignIdFor(Par::class);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custodian_par');
    }
};
