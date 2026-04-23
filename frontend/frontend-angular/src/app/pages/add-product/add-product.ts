import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';/*Forms module permite que lo que escribimos en los
imputs de nuestro html se guarde en nuestro objeto de typescript*/
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';/*Importamos nuestro modelo de datos*/
import { RouterLink,Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule, RouterLink],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  //Creamos nuestro objeto de tipo product
  product: Product = {
    name: '',
    price: 0,
    description: ''
  };

  // 1️⃣ Añadimos variable para el archivo esta  variable puede ser solo de tipo file o null la inicializamos en null y nos servira para guardar nuestra imagen
  selectedFile: File | null = null;
  //Creamos nuestra varible de tipo signal que puede ser solo string y la inicializamos en vacio
  errorMessage = signal<string>('');

  
    private productService =  inject(ProductService);//Inyectamos nuestro servicio para los productos 
    private router = inject(Router);//Inyectamos router para redirecionar


  // 2️⃣ Función para capturar la imagen esta funcion pide un parametro event que sera aqui donde venga la imagen
  onFileSelected(event: any) {
    //Guardamos en la constante file el primer archivo selecionado
    const file: File = event.target.files[0];
    //Aqui con este bloque if comprobamos que si file tiene algo es true y guardamos en la variable selectedFile la constante file que contiene nuestra imagen
    if (file) {
      this.selectedFile = file;
    }
  }
//Ahora nuestra funcion saveProduct nos permite guardar un producto en la base de datos mediante su respectiva peticion
  saveProduct() {
    // Validación básica aqui con el bloque if preguntamos si la proiedad product.name sin espacios por delante y detras es diferente a true es decir es null tirara un error lo mismo para description, para price es diferente ya que si el precio es 0 o menor tambien tirara un error
    if (!this.product.name.trim() || this.product.price <= 0 || !this.product.description.trim()) {
      //Seteamos nuestra signal con el texto se deben llenar todos los campos
      this.errorMessage.set("⚠️ Se deben llenar todos los campos correctamente.");
      //Despues de tres segundos el mensaje erroMensaje se vuelve a setear a vacio
      setTimeout(() => this.errorMessage.set(''), 3000);
      return; // Salimos de la función si hay error
    }

    // 3️⃣ Creamos el FormData para enviar archivos y texto juntos
    const formData = new FormData();
    //Creamos las propiedades name, price y description con los valores de nuestro objeto product que asu vez estan vinculadas a nuestros inputs
    formData.append('name', this.product.name);
    formData.append('price', this.product.price.toString());
    formData.append('description', this.product.description);

    // Si el usuario seleccionó una imagen, la adjuntamos
    if (this.selectedFile) {
      //creamos la propiedad image donde le pasamos el archivo y el nombre del archivo
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    // Ahora si con nuestros valores seteados mandamos llamar a la funcion createProduct donde le pasamos de parametro nuestro objeto formData
    this.productService.createProduct(formData).subscribe({
      //Si la respuesta es correcta veremos en consola la respuesta y en la interfaz veremos un alert que diga producto creado con exito
      next: (response) => {
        console.log(response);
        alert("✅ Producto guardado con éxito");

        // Posteriormente limpiamos nuestro objeto product y nuestra variable selectedFile
        this.product = { name: '', price: 0, description: '' };
        this.selectedFile = null;
        //Posteriormente aqui nos redirigimos a nuestra lista de productos
        this.router.navigate(['/products']);
      },
      //Si hubo un error setamos nuestra signal con un texto indicando que hubo un error y en consola veremos el error tambien
      error: (err) => {
        console.error(err);
        this.errorMessage.set("❌ Error al guardar el producto.");
      }
    });
  }
}