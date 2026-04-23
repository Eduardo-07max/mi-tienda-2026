<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
    El metodo up es una funcion que se crea en automatico cuando creas tu mighracion y nos
    sirve para poder crear nuestras tablas sin la necesidad de entrar a phpMyadmind y crear 
    nuestras tablas a mano.
    Ojo la migracion solo sirve para crear la estructura de nuestras tablas osea los campos
    que tendra y mas no los datos o el llenado de la tabla esto no se hace aqui en migraciones
     */
    public function up(): void
    {
        /*Con Schema::create le estamos diciendo a laravel crea la tabla con el nombre products
        posteriormente con funtion(Blueprint $table) definimos las columnas o campos que tendra 
        nuestra tabla importante para definir cada campo definimos que tipo de dato sera ya sea 
        string, decimal, etc, posteriormente el nombre del campo.

        Nota: laravel al crear el id por defecto lo hace autoincrement y le asigna el PRYMARY-KEY,
        por otro lado sino definimos el largo de los caracteres por ejemplo en el campo name se 
        coloca por defecto 255 caracteres de largo
        */
        Schema::create('products', function (Blueprint $table) {
             $table->id();
    $table->string('name');
    $table->decimal('price', 8, 2);/*aqui estamos haciendo uso de un tipo de dato decimal y con  nuestro
    primer numero que es el 8 le estamos diciendo que nuestro numero puede tener como maximo 8 digitos
    y que decimales puede tener 2*/
    $table->text('description')->nullable();/*el campo descripcion lo definimos como nullable esto
    quiere decir que este campo no es obligatorio o que puede ser null osea puede quedar sin nada 
    o vacio */
    
    /* NUEVA COLUMNA: user_id
           1. foreignId('user_id'): Crea una columna BIGINT para la relación.
           2. constrained(): Laravel deduce que se refiere a la tabla 'users'.
           3. cascadeOnDelete(): SI el usuario se borra, sus productos también se borran automáticamente.
           Esto mantiene la base de datos limpia y segura.
        */
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();

        $table->timestamps();/*Con ayuda de timestamps lo que estamos haciendo es crear dos campos de
    tiempo al mismo tiempo una llamado create_at que guarda la fecha y hora en que se creo 
    el registro y updated_at que guarda la fecha y hora en que se a actualizado o modificado el
    registro */
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
