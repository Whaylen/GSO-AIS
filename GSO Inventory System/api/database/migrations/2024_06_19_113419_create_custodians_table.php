<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Profile;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('custodians', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Profile::class);
            $table->string('tin_number')->nullable();
            $table->string('employee_id')->nullable();
            // $table->foreignIdFor(Office::class)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custodians');
    }
};
