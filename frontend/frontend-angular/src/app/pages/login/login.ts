import { Component,inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';//Usamos router y router link para redireccionar 
import { AuthService } from '../../services/auth.service';//Importamos nuestro servicio AuthService

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink], //Al utilizar ReactiveFormsModule en imports, habilitas que el HTML pueda usar [formGroup] y formControlName
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

private fb = inject(FormBuilder); // este FormBuilder nos permite crear un objeto de tipo FormGroup ademas de validar y crear sus atributos
private authService = inject(AuthService);//Este es nuestro servicio que contiene los metodos para interactuar con el backend
private router = inject(Router);// Router nos permite redirecionarnos desde el codigo typescript a diferencia de routerlink que nos permite hacerlo desde el html

  errorMessage = signal<string | null>(null);//Variable de tipo signal permite solo guardar un string o ser null 

  //Creamos nuestro objeto de tipo formGroup 
  loginForm = this.fb.group({
    //Creamos el atributo email donde le damos cierta validacion donde este campo es requerido y es de tipo email
    email: ['', [Validators.required, Validators.email]],
    //La contraseña donde este campo tambien es requerido
    password: ['', [Validators.required]]
  });

  //Nuestra funcion onSubmit es la encargada de hacer la peticion y recibir la respuesta al momento de iniciar sesion
  onSubmit() {
    //en este bloque if lo que hacemos es verificar que nuestro objeto loginForm de valid es decir que se cumplieron con las validaciones de los campos
    if (this.loginForm.valid) {
      //si se cumplieron las validaciones entonces con ayuda de nuestro servicio invocamos al metodo login y de parametro le pasamos el objeto loginForm con sus respectivos valores
      this.authService.login(this.loginForm.value).subscribe({
        //si todo salio bien y la respuesta es positiva en consola tendremos el mensaje Login exitoso y nos redijira al componente donde tenemos nuestros productos el metodo login ya guarda a nuestro token y datos de usuario en el local storage
        next: () => {
          console.log('¡Login exitoso!');
          this.router.navigate(['/products']);
        },
        //En caso de un error nos retornara este mensaje de error
        error: (err) => {
          //seteamos el valor de nuestra variable signal errorMessage con el mensaje de error de la respuesta err.error.message o en caso de que no haya mensaje ahi lo setamos con 'Credenciales incorrectas'
          this.errorMessage.set(err.error.message || 'Credenciales incorrectas');
        }
      });
    }
  }
}
