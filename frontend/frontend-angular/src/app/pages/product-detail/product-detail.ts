import { Component, OnInit, signal, inject } from '@angular/core'; // Añadimos inject
import { ActivatedRoute, RouterLink, Router } from '@angular/router';//ActivatedRoute para tener acceso a la ruta actual
import { ProductService } from '../../services/product.service';//Inyectamos el servicio del usuario
import { AuthService } from '../../services/auth.service'; // Importamos tu servicio de auth

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  // Inyectamos el AuthService para usarlo en el HTML
  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);//Inyectamos Activated Route para poder capturar el parametro id que viene en nuestra ruta
  private productService = inject(ProductService);//Inyectamos nuestro servicio ProductService para accder a los metodos CRUD que tenemos en nuestro backend
  private router = inject(Router);//Inyectamos router para poder direccionarnos desde el codigo

  //Creamos nuestra variable de tipo signal inicializada en null
  product = signal<any>(null);

//Aqui nuestro metodo ngOnInit se ejecutara cada vez que cargemos la vista de este componente
  ngOnInit() {
    //Guardamos el id que viene en nuestra ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    //Con este bloque if comprobamos que tenemos algo en la constante idParam 
    if (idParam) {
      //Si paso la validacion ahora guardamos idParam en id que es donde viene el id de la ruta
      const id = +idParam; 
      //Aqui mandamos llamar a nuestro metodo getProduct que viene del servicio serviceProduct y de parametro le pasamos la constante id
      this.productService.getProduct(id).subscribe((data: any) => {
        //Despues con la respuesta si fue correcta seteamos el valor de nuestra signal con esa respuesta
        this.product.set(data);
      });
    }
  }

  //Aqui creamos el metodo delete product que invoca a la funcion que esta en nuestro servicio para eliminar elproducto donde nos pide un parametro id de tipo numerico
  deleteProduct(id: number) {
    //Lo primero que pasa al invocar a este metodo es que con un bloque if evaluamos si nuestro confirm con su mensaje es true es decir dimos en aceptar se ejecutara el codigo dentro del if
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      //Aqui mandamos llamar al metodo deleteProduct que esta en nuestroi servico de productos donde el metodo nos pide un id y le pasamos el parametro de la funcion general
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          //Si todo salio bien de respuesta lo que haremos sera invocar un alert con el mensaje producto eliminado correctamente y navagamos a la ruta base 
          alert("Producto eliminado correctamente");
          this.router.navigate(['/products']); 
        },
        //en caso contrario mostramos un mensaje de error en consola
        error: (err) => console.error("Error al borrar", err)
      });
    }
  }
}