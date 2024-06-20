<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->nullable();
            $table->unsignedBigInteger('gender_id')->nullable();
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('suffix')->nullable();
            $table->string('nickname')->nullable();
            $table->date('birthdate')->nullable();
            $table->unsignedBigInteger('image_id')->nullable();
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['image_id']);

            $table->foreign('gender_id')->references('id')->on('genders')->onDelete('cascade');
            $table->foreign('image_id')->references('id')->on('images')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('profiles', function (Blueprint $table){
            $table->dropForeign(['user_id']);
            $table->dropForeign(['gender_id']);
            $table->dropForeign(['image_id']);
        });
        Schema::dropIfExists('profiles');
    }
};
