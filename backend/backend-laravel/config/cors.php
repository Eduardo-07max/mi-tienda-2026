<?php

return [

    /*
    | Definimos qué rutas de nuestra API están sujetas a CORS. 
    | 'api/*' es lo estándar para que afecte a todos tus endpoints.
    */
    'paths' => ['*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'], // Permitimos GET, POST, PUT, DELETE, etc.

    /*
    | AQUÍ LA SEGURIDAD: Solo permitimos peticiones desde tu app de Angular.
    | Cambia el '*' por la URL de tu frontend.
    */
    'allowed_origins' => ['http://localhost:4200',
    'https://mi-tienda-2026.vercel.app'], 

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
    | Cambiamos a 'true' para permitir el envío de cookies o 
    | cabeceras de autenticación si fuera necesario.
    */
    'supports_credentials' => true,

];