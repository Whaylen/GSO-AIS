<?php

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
        Schema::create('pars', function (Blueprint $table) {
            $table->id();
            $table->timestamp('date_received');
            $table->string('article');
            $table->string('brand_model')->nullable();
            $table->longText('particulars');
            $table->string('responsibility_center');
            $table->string('account_code');
            $table->timestamp('date_acquired');
            $table->decimal('unit_value');
            $table->integer('quantity');
            $table->decimal('total_value');
            $table->string('unit_of_measure');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pars');
    }
};
