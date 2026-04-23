<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /*Aqui vamos a modificar nuestra tabla products*/
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Añadimos el campo image después del precio
        $table->string('image')->nullable()->after('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            //
        });
    }
};
