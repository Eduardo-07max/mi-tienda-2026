<?php

namespace App\Http\Controllers;

use App\Models\Product;//traemos a nuestro modelo de datos
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;//Request es un herramienta que nos ayuda a capturar los datos enviados por los formularios
use Illuminate\Support\Facades\Storage;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    //Metodo para mostrar todos los productos
    public function index()
    {
       //Aqui en $products Guardamos todos los registros que hay en la tabla Products y con with('user) le estamos diciendo traeme tambien todos los registros de usuarios que creo cada producto get dice listo mandame todos los registros que encontraste
    $products = Product::with('user')->get();
    //De respuesta retornamos en formato json todos los registros que obtuvimos
    return response()->json($products);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /*
    Nuestra funcion store nos sirve para crear un nuevo producto en la base de datos
     */
   public function store(Request $request)
{
    //Primero verificamos o obtenemos al usuario logueado mediante su token en cabecera y $user ahora tiene los datos del usuario al que le pertenece ese token
    $user = $request->user();
    
    if (!$user) {
        return response()->json(['error' => 'Usuario no autenticado. Asegúrate de estar logueado.'], 401);
    }

    // 2. Validación
    $validados = $request->validate([
        'name' => 'required|string',//Nos debe de llegar un dato obligatorio de tipo string  para el nombre del producto
        'price' => 'required|numeric',//nos debe llegar un dato de forma obligatoria de tipo numerico
        'description' => 'required|string', // Cambié a required para evitar errores de base de datos este campo es obligatorio y debe ser de tipo string
        'image'       => 'nullable|image|max:2048', //Este campo image puede ser null o de tipo imagen ademas debe pesar maximo 2 MB 
    ]);

    // 3. Creamos el producto usando el ID del usuario directamente
    $producto = new Product();
    //Seteamos los valores de nuestro objeto producto con la informacion que nos llega de angular atravez de request asignadole el valor a acada campo correspondiente
    $producto->name = $request->name;
    $producto->price = $request->price;
    $producto->description = $request->description;
    $producto->user_id = $user->id; // Aquí le pasamos el id del usuario logueado actualmente es decir quien esta creando este producto

    // 4. Procesamos la imagen si existe
    if ($request->hasFile('image')) {
        // Usamos el disco 'productos' que ya tienes configurado y guardamos el nombre de la imagen en path el nombre se autogera gracias store que nos retorna el nombre de la imagen y guarda la imagen en nuestro disco 
        $path = $request->file('image')->store('', 'productos');
        //Guardamos el nombre exacto de nuestra imagen en nuestra base de datos
        $producto->image = $path;
    }
//Ahora que ya tenemos nuestro objeto con sus valores seteados con la funcion save guardamos este objeto en base datos o mejor dicho creamos un nuevo registro con los valores de este objeto
    $producto->save();
//Retornamos una respuesta en formato json con los datos del nuevo producto y el codigo 201 que indica que se ha creado algo con exito
    return response()->json($producto, 201);
}

    /*
    Metodo show este metodo me muestra solo 1 producto en base a su id
     */

    public function show($id)
    {
       //aqui guardamos un  producto en $product hacemos la consulta en  la tabla Product donde con ayuda de with 'user' nos traemos tambien al usuario que creo ese producto y con findOrFail($id); le pasamos el parametro id para que nos busque el producto con ese id en especifico esta funcion si no encuentra el id lanza un error en automatico
        $product = Product::with('user')->findOrFail($id);
        //retornamos de respuesta el producto que se llevara tambien el registro del usuario que creo este producto
        return response()->json($product);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        
    }

    /*
    Esta funcion nos sirve para actualizar un registro o producto.
    Donde en la funcion le estamos pidiendo dos parametros 1 que es request para los datos
    como nombre, price, description y image que vienen de un formulario y id para obtener el id del
    producto o registro a actualizar
     */
public function update(Request $request, $id)
{
    
//Aqui estamos obteniendo primeramente el producto a actualizar donde gracias findOrFail($id) obtenemos el registro que queremos editar

    $product = Product::findOrFail($id);
//Hacemos una comprobacion mediante este bloque if comprobamos que si el user_id de nuestro producto es diferente al id del usuario logeado entonces nos retornara un mensaje de error
    if ($product->user_id !== $request->user()->id) {
        return response()->json(['message' => 'No tienes permiso'], 403);
    }

    // Hacemos una validacion simple 
    $request->validate([
        'name'        => 'required',//el campo name es requerido
        'price'       => 'required',//el campo price tambien es requerido
        'description' => 'required',//El campo descripcion tambien es requerido
        'image'       => 'nullable|image|max:2048',//el campo image es de tipo imagen puede ser null y debe pesar como maximo 2 MB
    ]);

    // Asignamos usando input() que es más robusto para FormData
    //Seteamos los valores del objeto product con los valores de los inputs que nos llegan de Angular
    $product->name = $request->input('name');
    $product->price = $request->input('price');
    $product->description = $request->input('description');
//Con este bloque if comprobamos que de nuestro formulario venga una imagen del input image
    if ($request->hasFile('image')) {
    //Si es asi comprobamos si ya tenemos una imagen en este registro si es asi que si tenemos una imagen para este producto eliminamos ese imagen con ayuda de Storage::disk('productos')->delete($product->image);  eliminamos la imagen de nuestro disco duro 
        if ($product->image) { 
            Storage::disk('productos')->delete($product->image); 
        }
    //Despues de eliminar la imagen del disco procedemos a guardar la nueva imagen en nuestro disco productos y guardamos el nombre de esa imagen en $path
        $path = $request->file('image')->store('', 'productos');
    //posteriormente seteamos el valor image de nuestro objeto con el nuevo nombre de la imagen nueva
        $product->image = $path;
    }
    //Aqui ya con la imagen guardada y con los valores seteados guardamos este objeto actualizando asi el registro
    $product->save();
    //Retornamos una respuesta al frontend donde retornamos el objeto actualizado en formato json
    return response()->json($product);
}
    /*
    La funcion destroy nos sirve para eliminar un registro o producto
     */
    public function destroy(Request $request, $id)
    {
        //Aqui primero gracias al parametro id obtenemos el registro a eliminar
        $product = Product::findOrFail($id);

        // SEGURIDAD: ¿El producto pertenece al usuario logueado?
        //Con este bloque if preguntamos el user_id es difernte del id del usuario logueado si es asi retornamos una respuesta negativa
        if ($product->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No tienes permiso para eliminar este producto'], 403);
        }
//Si pasa la validacion eliminamos el producto
        $product->delete();
//Retornamos el mensaje producto eliminado
        return response()->json(['message' => 'Producto eliminado']);
    }
}
