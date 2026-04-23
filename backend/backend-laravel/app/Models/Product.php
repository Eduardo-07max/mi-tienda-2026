<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;//Aqui usamos enloquent para interacturar con la base de datos

/*Gracias a extends model nos estamos conectando a la tabla product de la base de datos*/
class Product extends Model
{
    /*Aqui con protedted fillable le estamos diciendo a laravel que los unicos campos que pueden
    ser llenados desde el formulario son name, price, description  y user_id los demas campos como id o 
    created_at o update_at se actualizan automaticamente */
    protected $fillable = [
        'name',
        'price',
        'description',
        'image',
        'user_id'

    ];

    /* BUENA PRÁCTICA: Relación Inversa
       Aquí le decimos a Laravel que un producto "pertenece a" un usuario.
       Esto te permitirá hacer cosas como: $producto->user->name para obtener 
       el nombre del dueño fácilmente.
    */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

 
}
