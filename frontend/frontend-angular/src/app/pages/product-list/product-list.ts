import { Component, OnInit, signal,inject } from '@angular/core'; // Importa signal
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink], // Si usas routerLink en el HTML, aquí debes agregar RouterModule o RouterLink
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  //Inyectamos nuestro servicio
  public authService = inject(AuthService);
   /* Definimos products como una señal que es un array donde se guardaran los prodcutos que me 
   lleguen del bakend pero usamos signal para que cada que detecte un cambio en los datos que me
   lleguen repinte la interfaz nuevos datos*/
  products = signal<any[]>([]);

/*inyectamos nuestro servicio que es donde tenemos todas nuestras funciones
que nos permiten hacer peticiones a nuestro backend */
  private productService = inject(ProductService);

  /*El metodo ngOnInit nos sirve para que lo primero que haga al cargar la pagina sea invocar
  al metodo loadProducts que nos trae todos los productos que tenemos en nuestra base de datos*/
  ngOnInit(){
    this.loadProducts();
  }
/*
La funcion load products llama al servicio productService y invoca a la funcion getProducts y con 
suscribe() obtenemos la respuesta que viene en data una vez que nos llega la respuesta lo que hacemos
es guardar esa respuesta en nuestro array de tipo signal(este tipo de array detecta los cambios facil y rapido)
*/
  loadProducts(){
    this.productService.getProducts().subscribe((data: any) => {
      // 2. Actualizamos el valor de la señal
      this.products.set(data);
      console.log(data);
      
    });
  }

  /*ahora la funcion deleteProduct te pide un parametro id que nos servira para obtener el prodcuto
  a eliminar, esta funcion llama a nuestro servicio productService y ala funcion deleteProduct 
  la nos pide un parametro id y le pasamos ese id de parametro una vez que obtenemos la respuesta
  a nuestra peticion lanzamos un alert que nos indica que nuestro producto ha sido eliminado y para
  finalizar vuelve o manda llamar a nuestra funcion loadProducts para actualizar nuestra vista*/
  deleteProduct(id:number){
    //Este bloque if muy importante ya que nos mostrara un mensaje de confirmacion donde si damos en confirmar dara true por lo que procedera a llamar a nuestra funcion para eliminar el producto y si damos en no dara false por lo que no hara nada
  if(confirm("¿Estás seguro de eliminar este producto?")){

    this.productService.deleteProduct(id).subscribe(()=>{

      alert("Producto eliminado");

      // ✅ Recargar lista automáticamente
      this.loadProducts();

    });

  }
}
}
