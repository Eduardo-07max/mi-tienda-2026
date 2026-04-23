<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
    Aqui crearemos la tabla usuarios
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();/*Campo id por defecto se autoincrementa*/ 
            $table->string('name');/*Campo name no definimos cuantos caracteres permite asi que por defecto
            seran 255 caracteres*/
            $table->string('email')->unique();/*Definimos que el campo email sera unique es decir unico no se 
            pueden repetir valores por defecto tiene 255 caracteres*/ 
            $table->timestamp('email_verified_at')->nullable();/*Este campo de verificacion solo se 
            pueden anotar fechas gracias a timestamp pero este campo es null y solo se activa cuando 
            verficamos el correo*/
            $table->string('password');/*Aqui definimos el campo password tiene 255 caracteres para usar*/
            $table->rememberToken();/*Aqui creamos la columna remeber token que al marcar en el navegador
            la opcion recuerdame genera un token que se guardara en una cookie de larga duracion y en la
            base datos tambien se guardara ese token*/
            $table->timestamps();/*con timestamp creamos 2 campos a la vez el
            create_at y update_at uno para la fecha de creacion y otro cuando actualizamos algo en el registro
            */
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
