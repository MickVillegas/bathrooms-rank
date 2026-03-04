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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_local');
            $table->string('comentario');
            $table->string('valoracion_dada');
            $table->string('nombre_usuario');
            $table->unsignedBigInteger('id_local'); 
            $table->foreign('id_local')->references('id')->on('locals');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
