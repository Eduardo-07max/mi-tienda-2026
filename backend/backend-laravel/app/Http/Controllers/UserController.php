<?php

// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    // Actualizar datos básicos (Nombre, Email, etc.)
    // app/Http/Controllers/UserController.php

public function updateProfile(Request $request)
{
    //Guardamos en $user al usuario al que le pertenece el token que le pasamos en la cabecera.
    $user = $request->user();
    //Aqui validamos los datos que me llegan de Angular
    $request->validate([
        'name' => 'required|string|max:255',//el campo name es obligatorio, tipo string y tiene un maximo de caracteres de 255
        'email' => 'required|email|unique:users,email,' . $user->id,//el campo email es obligatorio debe ser tipo email, unico excepto el mio solo en caso de que no cambie el correo al actualizar y esto es para que no de error
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,avif|max:2048', // Validación de imagen puede ser null y puede tener los siguientes formatos image|mimes:jpeg,png,jpg,gif,avif y un maximo de 2 MB
    ]);
//Aqui seteamos los valores de nuestro objeto user con los nuevos valores que me llegan de angular
    $user->name = $request->name;
    $user->email = $request->email;

    // Lógica para la imagen
    //con este bloque if nos aseguramos que nuestro campo image si tenga una imagen
    if ($request->hasFile('image')) {
        // Despues si el campo image de nuestro objeto user tiene algo o es diferente de default-avatar.avif 
        if ($user->image && $user->image !== 'default-avatar.avif') {
    //Si se cumple la condicon lo que haremos sera con ayuda de public_path('storage/usuarios/' . $user->image); acceder a ruta exacta donde esta nuestra imagen en nuestro disco duro
            $oldPath = public_path('storage/usuarios/' . $user->image);
    //Ahora aqui comprobamos que si existe la imagen en la ruta si es asi hacemos lo que esta dentro del nuestro bloque if
            if (file_exists($oldPath)) {
                //Con unlike eliminamos el archivo que esta el ruta $oldPath
                unlink($oldPath);
            }
        }

        // Ahora en file guardamos la imagen que viene desde el formulario de Angular
        $file = $request->file('image');
        //Ahora en filename guardamos el nombre de la nueva imagen donde nos apoyamos de time() que es un funcion que nos devuelve los segundos trancurridos desde 1970 donde le concatenamos el punto mas con ayuda de $file->getClientOriginalExtension(); obtenemos la extension de la imagen con esto nos aseguramos que la imagen tendra siempre un nombre diferente
        $filename = time() . '.' . $file->getClientOriginalExtension();
        //Ahora con la funcion move movemos nuestra imagen a la ruta indicada y el segundo parametro filename nos sirve para guardar la imagen con el nombre que le dimos anteirormente
        $file->move(public_path('storage/usuarios'), $filename);
        //Por ultimo al valor image de nuestro objeto lo seatemos con el nuevo nombre que hemos generado
        $user->image = $filename;
    }
    //Ahora simplemente guardamos nuestro objeto o mejor dicho lo actulizamos en la base de datos con save
    $user->save();
//Por ultimo retornamos una respuesta a nuestro frontend donde le pasamos un mensaje y nuestro objeto user
    return response()->json([
        'message' => 'Perfil actualizado',
        'user' => $user
    ]);
}

    // Cambiar contraseña con validación de la anterior
    public function changePassword(Request $request)
    {
        //Aqui hacemos un pequeña validacion de lo que nos llega desde el formulario
        $request->validate([
            'current_password' => 'required',//este primer campo es para la contraseña actual que tenemos ahora mismo y es obligatorio
            'password' => ['required', 'confirmed', Password::defaults()],//este campo es para la nueva contraseña este campo es obligatorio y con confirmed buscara un segundo campo llamado password?confirmation donde si las dos contraseñas no coinciden detiene todo y envia un mensaje de error. Password::defaults(): Aplica las reglas de seguridad estándar de Laravel (como que tenga al menos 8 caracteres).
        ]);
//Aqui gracias al token que se envia en la cabecera traemos al usuario que le pertenece ese token junto a sus datos
        $user = $request->user();

        // Verificar si la contraseña actual es correcta
        //aqui comparamos si la contraseña cifrada que nos llega del frontend y la que tenemos en nuestra base de datos no coinciden mandamos o retornamos de respuesta un mensaje de error
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'La contraseña actual no es correcta'
            ], 422);
        }

        // Actualizar a la nueva
        //Aqui actualizamos la nueva contraseña en la base de datos sin antes cifrarla con ayuda de Hash::make
        $user->update([
            'password' => Hash::make($request->password)
        ]);
        //Retornamos una respuesta al frontend
        return response()->json(['message' => 'Contraseña cambiada con éxito']);
    }
}
