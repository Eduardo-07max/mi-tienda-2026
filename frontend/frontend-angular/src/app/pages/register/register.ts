import { Component,signal,inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private fb = inject(FormBuilder);//Para crear y validar el formulario
  private authService = inject(AuthService);//Inyectamos nuestro servicio AuthService
  private router = inject(Router);//Router para redirecionar

  // Variable para guardar el archivo físicamente, variable de tipo file inicializada en null
  selectedFile: File | null = null;

  // Signal para manejar errores de validación del backend v ariable de tipo signal
  errorMessage = signal<string | null>(null);

  // Definimos el formulario con sus atributos y validaciones
  registerForm = this.fb.group({
    //El input name es requerido osea no puede ser vacio porque dara error o invalid y como minimo debes poner 3 caracteres
    name: ['', [Validators.required, Validators.minLength(3)]],
    //El input email tambien es requerido y el campo o lo que escribas debe ser tipo email sino dara invalid
    email: ['', [Validators.required, Validators.email]],
    //El input de contraseña tambien debe ser requerido y tener un minimo de 8 caracteres sino dara invalid
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', [Validators.required]] // Laravel pide esto para el campo 'confirmed'
  });

  // Con nuestra función onfileSelected nos servira para capturar el archivo que subimos en este caso la imagen en el parametro event
  onFileSelected(event: any) {
    //aqui creamos una constante de tipo file donde guardaremos nuestra imagen donde con event.target.files[0] guardaremos nuestra imagen files aparece como un array por que hay veces que se donde se sleeciona mas de un archivo
    const file: File = event.target.files[0];
    //este bloque if aqui comprobamos si file tiene algo si es asi guardamos file en nuestra variable this.selectedFile
    if (file) {
      this.selectedFile = file;
    }
  }

 onSubmit() {
 //con este bloque if lo que hacemos es asegurarnos que la validacion anterior funciono y tenemos todos los campos llenados correctamente 
    if (this.registerForm.valid) {
      //creamos nuestro objeto de tipo FormData que nos permite enviar texto y archivos
      const formData = new FormData();
      
      // Usamos el operador ?? '' para asegurar que siempre sea un string y no null ya que formData no acepta null
      // y no un null/undefined
      //para agregar atributos a nuestro objeto formData lo hacemos con append donde 'name' es la etiqueta que le agregamos a ese valor y luego this.registerFomr.get('name')?.value es el valor que tiene ese input y es el valor que agregaremos a nuestro objeto, el signo de interrogacion en ?.value es para que intente sacar el valor pero si el valor esta roto o tiene un error se dentenga ahi y no rompa toda la aplicacion
      formData.append('name', this.registerForm.get('name')?.value ?? '');
      //Aqui le agregamos la propiedad email al objeto formData con la etiqueta email y el valor de lo que tenga nuestro input email, recuerda el primer ? sirve para evitar que la app se rompa en caso de un error y los dos ?? sirve para asegurar que lo que nos llega es un string y dejar vacio en caso de que el sea null mejor se pone un vacio ya que nuestro form data no acepta valores null 
      formData.append('email', this.registerForm.get('email')?.value ?? '');
      //Agregamos la etiuqeta pasword a nuestro objeto con el valor de nuestro input password
      formData.append('password', this.registerForm.get('password')?.value ?? '');
      //Agregamos la etiqueta pasword_confirmation y el valor del input password_confimation 
      formData.append('password_confirmation', this.registerForm.get('password_confirmation')?.value ?? '');
      //con este if preguntamos de verdad tenemos una imagen en selectFile si es asi has esto
      if (this.selectedFile) {
        //aqui le agregamos la etiqueta image a formData y con this.selectedFile aqui va la imagen real, tambien le pasamos this.selectedFile.name que es nombre de la imagen propiedad del objeto file
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      //aqui accedemos a la funcion register que esta en nuestro servicio donde de parametro le pasamos el objeto formData, .suscribe dice espera o escucha la respuesta del servidor
      this.authService.register(formData).subscribe({
        //si la respuesta es positiva nos mostrara un mensaje que dice usuario registrado con exito en consola
        next: () => {
          console.log('¡Usuario registrado con éxito!');
          this.router.navigate(['/products']);//redirecionamos a products gracias a router
        },
        //si hubo un error en algo la respuesta sera de error y nos mostrara un mensaje de error
        error: (err) => {
          //err trae el error ocurrido
          //seteamos nuestra varible de tipo signal con el error ocurrido o si el error esta vacio muestrame el mensaje error al registrar
          this.errorMessage.set(err.error.message || 'Error al registrar');
        }
      });

    }
  }
}
