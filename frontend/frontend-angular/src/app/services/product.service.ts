import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ 
  providedIn: 'root'
})
export class ProductService {
  //Inyectamos el HttpClient para poder hacer peticiones al backend
  private http = inject(HttpClient);
  //Colocamos nuestra ruta base para hacer las peticiones
  private apiURL = 'http://localhost:8000/api/products';

  constructor() { }

  //El metodo getProducts hace una peticion al backend para obtener todos los productos y saber que usuario creo tal producto
  getProducts() {
    //aqui definimos la ruta del backend donde hara la peticion acompañado del tipo de metodo que en este caso es get ya que es para mostrar informacion
    return this.http.get(this.apiURL);
  }
//Aqui tenemos el metodo createProduct que es para crear un nuevo producto donde te parametro recibe un formData que es ahi donde van los datos que capturamos desde nuestro formulario
  createProduct(formData: FormData) {
    //Aqui hacemos una peticion por post donde le pasamos la ruta dase junto al dataForm
    return this.http.post(this.apiURL, formData);
  }

  //CAMBIO AQUÍ: Cambiamos .put por .post
  updateProduct(id: number, formData: any): Observable<any> {
    /* IMPORTANTE: Usamos .post porque Laravel procesará el FormData 
       correctamente gracias al campo '_method' que añadimos en el componente.
       Es importante notar que aqui lo hacemos como si fuera un post pero en nuestro componente update porduct definimos que es por put
       en la ruta le psamos la ruta base junto al id y la formData los datos del formulario
    */
    return this.http.post(`${this.apiURL}/${id}`, formData);
  }
//Aqui con la funcion deleteProduct donde le pasamos un id nos sirve para eliminar un producto
  deleteProduct(id: number) {
    //Aqui escribimos la ruta con el metodo delete donde le pasamos la ruta junto al id del producto a eliminar
    return this.http.delete(`${this.apiURL}/${id}`);
  }
//Aqui con nuestro metodo getProduct obtenemos un solo producto gracias al id que le pasamos de parametro
  getProduct(id: number) {
    //mediante el metodo get mas la ruta mas el id del prodcuto obtendremos el producto con el id deseado
    return this.http.get(`${this.apiURL}/${id}`);
  }
}