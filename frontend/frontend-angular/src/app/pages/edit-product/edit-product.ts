import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';//Activated route sirve para leer la url y router para redirecionar
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  imports: [FormsModule, RouterLink],//FormsModule para conectar nuestro codigo typescript con el formulario nos permite usar ngModel
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProduct implements OnInit {
  // 1. Creamos un objeto de tipo signal que estara vinculado a los imputs del html
  product = signal<any>({
    name: '',
    price: 0,
    description: '',
    image: null
  });

  //Creamos nuestra variable de tipo File para guardar nuestra imagen la inicializamos en null
  selectedFile: File | null = null;
  // Esta es nuestra variable de tipo signal encargada de guardar nuestra imagen en formato de texto, definimos que esta varible puede ser de tipo string o null y con (null) le damos un valor inicial de null
imagePreview = signal<string | null>(null);

  // Señal para errores
  errorMessage = signal<string>('');
  //Nuestra variable id de cualquier tipo para guardar el id que viene de la url
  id: any;

  private route = inject(ActivatedRoute);//Sirve para leer la url o ruta
  private productService = inject(ProductService);//Inyectamos nuestro servicio de products para poder comunicarnos con el backend mediante sus metodos
  private router = inject(Router);//Router para redirecionarnos
//ngOnInit es nuestro metodo que se ejecuta cada vez que carga nuestro componente 
  ngOnInit() {
    //Aqui con nuestro route vamos a su funcion snapshot que nos sirve para capturar la ruta actual y con paramMap buscamos entre nuestro parametros y con .get('id') buscamos el pametro especifico en este caso id y lo guardamos en nuestra variabke id
    this.id = this.route.snapshot.paramMap.get('id');

    // al invocar la funcion getProduct obtenemos el producto actual para rellenar el formulario donde de parametro le pasamos el id del producto que deseamos
    this.productService.getProduct(this.id).subscribe((data: any) => {
      //Capturamos su respuesta y con el bloque if si nos llega una respuesta correcta setearemos el valor de nuestro objeto product con esa respuesta que es donde vienen nuestros datos del producto(nombre.. precio.. descripcion)
      if (data) {
        this.product.set({ ...data });
      }
    });
  }

  // Capturar la nueva imagen y generar vista previa
  //Esta funcion se llama cuando selecionamos un archivo desde el input para selecionar la imagen y el parametro even captura nuestra imagen o archivo
  onFileSelected(event: any) {
    //Aqui obtenemos la primer imagen que seleciono nuestro usuario y la guardamos en la constante file 
    const file = event.target.files[0];
    //Con este bloque if comprobamos que file si tenga algo osea nuestra imagen 
    if (file) {
      //si es asi guardamos ese file es nuestra variable de tipo archivo llamada selectedFile
      this.selectedFile = file;

      // primeramente creamos un objeto de tipo FileReader que sabe leer bits esto lo hacemos ya que en el html no podemos mostrarlo solo con el nombre si no que debemos transformarlo en algo que html entienda y fileReader lo convierte en una cadena de texto que html entiende
      const reader = new FileReader();
      //Aqui estamos creando una promesa donde decimos hoye navegador cuando termines de leer el archivo has esto 
      reader.onload = () => {
        //Aqui lo que hacemos es setear el valor de imagePreview con la cadena de caracteres que si entiende html donde as es que sera de tipo string esta cadena
        this.imagePreview.set(reader.result as string);
      };
      //Aqui simplemente mandamos llamar a ese proceso con readAsData y le pasamos el archivo a convertir
      reader.readAsDataURL(file);
    }
  }
//
  updateProduct() {
    //Aqui guardamos nuestro objeto signal en la constante currentProduct
  const currentProduct = this.product();

  // Aqui con el este bloque if preguntamos si la propiedad name es diferente a true es decir no tiene nada se cumpliera y seteara el mensaje de error para mostrarlo lo mismo para description, para el campo price la condicion es un poco diferente aqui el precio si es menor o igual 0 se cumplira la condicion por lo que esto lo consideramos como un error ya que no queremos prodcutos gratis ni con precios negativos 

  //Nota: la funcion trim quita los espacios adelante y dretas de nuestro texto
  if (!currentProduct.name.trim() || currentProduct.price <= 0 || !currentProduct.description.trim()) {
    this.errorMessage.set("⚠️ Se deben llenar todos los campos correctamente.");
    return;
  }

  // Aqui creamos un objeto de tipo FormData ideal para enviar texto y archivos a la vez
  const formData = new FormData();
  //Creamos y seteamos los atributos de nuestro formData con las propiedades name,price y description donde estos valores propienen del html donde los vinculamos con su atributo 
  formData.append('name', currentProduct.name);
  formData.append('price', currentProduct.price.toString());
  formData.append('description', currentProduct.description);
  
  // IMPORTANTE: Decirle a Laravel que es un PUT ya que en el backend lo tenemos como post pero en realidad es un put
  formData.append('_method', 'PUT');

  /*
  Ahora si nuestra variable selectedFile tiene algo quiere decir que tiene un archivo por lo que ahora creamos el atributo image y de valor le pasamos nuestra imagen que es selectedFile
   */
  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }
//Aqui mandamos llamar a nuestra funcion updateProduct donde le pasamos de parametro nuestra variable id que contiene el id que extrajimos de la ruta y el objeto formData con los datos nuevos
  this.productService.updateProduct(this.id, formData).subscribe({
    //Si todo sale bien recibimos la respuesta donde nos mostrara un alert con un mensaje que diga producto actualizado y volveremos a la vista products donde se deberia ver reflejado el cambio
    next: () => {
      alert("✅ Producto actualizado con éxito");
      this.router.navigate(['/products']);
    },
    //Si hay algun error nos retorna ese mensaje de error
    error: (error) => {
      //en consola mostramos el error
      console.error("Error del servidor:", error.error.errors); 
      //Seteamos la varible errorMessage indicando que hay un error
      this.errorMessage.set("❌ Error de validación en el servidor.");
    }
  });
}
}