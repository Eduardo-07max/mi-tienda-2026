<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;



class AuthController extends Controller
{
    // LOGIN: Verifica credenciales y entrega el Token seguro
    public function login(Request $request)
    {
        //aqui hacemos una validacion sencilla
        $request->validate([
            'email' => 'required|email',//validamos que en el campo email nos llegue algo y que sea de tipo mail
            'password' => 'required',//aqui forzosamente nos debe llegar la contraseña
        ]);
//Aqui obtenemos el registro donde el campo email de nuestra base de datos coincida con nuestro campo $request->email que nos llega del formulario
        $user = User::where('email', $request->email)->first();
//Con este bloque if si se cumple alguna de estas dos condiones nos dara un mensaje de error y no podremos entrar si el usuario esta vacio o es diferente a true nos dara error o si la contraseña cifrada de nuestra base de datos es diferente a la contraseña cifrada que nos llega del formualrio nos retornara una respuesta erronea y no podremos acceder 
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Las credenciales son incorrectas.'
            ], 401);
        }

        // Generamos el token de Sanctum si las credenciales como el correo on el mail son correctas
        $token = $user->createToken('auth_token')->plainTextToken;
//Mandamos la respuesta a angular donde le pasamos el token, y los datos del usuario
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'image' => $user->image
            ]
        ]);
    }

    /*La funcion register nos permite crear un nuevo usuario en la base da datos*/
    public function register(Request $request)
{
    // 1. Validamos los datos que vienen de Angular
    $request->validate([
        'name' => 'required|string|max:255',//este campo es obligatorio, debe ser de tipo string y tener un maximo de 255 caracteres
        'email' => 'required|string|email|max:255|unique:users', // unique:users evita correos duplicados, required el campo es obligatorio, debe ser un string, y tener un maximo de 255 caracteres
        'password' => 'required|string|min:8|confirmed',// 'confirmed' exige un campo password_confirmation, es obligatorio este campo, debe ser tipo string min8 debe tener minimo 8 caracteres
        'image'    => 'nullable|image|mimes:jpeg,png,jpg,gif,avif|max:2048', //aqui este campo puede ser null, es de tipo image y los formatos permitidos son jpeg,png,jpg,gif,avi y de tamaño maximo solo debe de tener 2 MB 
    ]);

    // 2. Creamos el usuario en la base de datos
    $user = User::create([
        'name' => $request->name,//en el campo name le asignaremos el valor que nos viene de request en la propiedad name que es el nombre del usuario
        'email' => $request->email,//aqui en el campo email le asigaremos el valor que nos llegue del formulario que viene en la propiedad $request->email 
        'password' => Hash::make($request->password), // Aqui en este campo password le asigaremos el valor de la contraseña que nos llegue de $request->password pero con hash::make lo que hace es cifrar la contraseña donde en lugar de que veamos un texto normal en la base de datos ni siquiera nosotros que tenemos acceso a ella podriamos verla ya que veramos una largo texto de caracteres y numeros
    ]);

    // 3. Lógica para guardar la imagen en el disco 'usuarios' guardamos la imagen despues de crear el usuario por una razon importante ya que si guardaramos la imagen desde el User::Create y algun campo falla la imagen se guardaria la imagen pero quedaria huerfana sin su usuario
    //Con este bloque if preguntamos realmente hay algo en el campo 'image' si es asi ejecuta esto
    if ($request->hasFile('image')) {
        // Con request->file('image') obtemos el archivo que esta guadardo es ese campo
        // ->store('', 'usuarios'); esta linea tiene dos parametros donde el primero que dejamos vacio es para indicarle en que carpeta guardara la imagen el segundo indica el disco virtual donde guadara la imagen en este caso el disco que creamos llamdo usuarios un dato de suma importancia ese metodo store antes de terminar lo que hace es darle un nombre al archivo que acaba de guardar y como pusimos path = request esto lo que hace es guardar el nombre que le dio al archivo esta funcion store de forma automatica tambien genera un nombre diferente en cada ocasion
        $path = $request->file('image')->store('', 'usuarios');
        
        // Guardamos solo el nombre del archivo (o la ruta relativa) en la DB seteamos el objeto user en la propiedad image con el nombre que se genero de nuestra imagen 
        $user->image = $path;
        //Por ultimo guardamos el objeto con los nuevos valores o el nuevo valor en image
        $user->save();
    }

    // 3. Generamos el token con $user->createToken('auth_token') donde le decimos para este usuario genera este token, el nombre 'auth_token' es solo una etiqueta interna para saber que es un token de autenticación, y plainTextToken te lo entrega en texto plano osea una linea de caracteres.
    $token = $user->createToken('auth_token')->plainTextToken;

    /*La respuesta le enviamos la respuesta a angular en formato json donde message = es solo un mensaje de confirmacion de que todo salio bien acces_token aqui le mandamos el token que se acaba de generar, 'token_type' => 'Bearer': Es el estándar de la industria. Significa "Portador". Le dice a Angular: "Cuando me pidas datos en el futuro, envíame este token en la cabecera diciendo que eres el portador de esta llave", 'user' envia el objeto user que contiene los datos del usuario*/
    return response()->json([
        'message' => 'Usuario creado con éxito',
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => $user
    ], 201);
}

    // LOGOUT: Elimina el token para cerrar sesión
    public function logout(Request $request)
    {
        //enviamos por  $request->user() el usuario que esta logueado actualmente con ->currentAccessToken() obtenemos el token actual y con delete eliminamos el token de la base de datos
        $request->user()->currentAccessToken()->delete();
        //retornamos la respuesta sesion cerrada
        return response()->json(['message' => 'Sesión cerrada']);
    }
}
