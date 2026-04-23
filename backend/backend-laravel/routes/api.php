<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. Rutas públicas (Login y Registro)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// 2. Rutas protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function () {
    
    // Ruta por defecto de Laravel para obtener el usuario actual
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Gestión de Perfil y Seguridad
    Route::post('/logout', [AuthController::class, 'logout']);//cerrar sesion
    Route::put('/user/profile', [UserController::class, 'updateProfile']);//actualizar usuario
    Route::post('/user/change-password', [UserController::class, 'changePassword']);//cambiar contraseña

    // --- CRUD DE PRODUCTOS ---
    
    // Obtener todos los productos (con sus dueños)
    Route::get('/products', [ProductController::class, 'index']);
    
    // Crear un nuevo producto
    Route::post('/products', [ProductController::class, 'store']);
    
    // Mostrar un producto específico
    Route::get('/products/{id}', [ProductController::class, 'show']);
    
    // Actualizar un producto
    Route::put('/products/{id}', [ProductController::class, 'update']);
    
    // Eliminar un producto
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});