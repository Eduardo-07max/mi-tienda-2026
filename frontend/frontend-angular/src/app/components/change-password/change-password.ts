import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, RouterLink],//FormsModule nos sirve para vincular nuestros inputs a nuestro codigo typescript concretamente a nuestra signal formData en este caso
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword {
  private http = inject(HttpClient);

  // Señal para los datos del formulario
  formData = signal({
    current_password: '',
    password: '',
    password_confirmation: ''
  });
//Signal para mensaje de exito o error 
  message = signal('');
  //Signal con valor boleano para determinar si hay error o no en la respuesta
  isError = signal(false);

  updatePassword() {

    const data = this.formData();

  // Validación local en Angular si se cumple la condicion que el campo data.password y password_confimation da un error detenemos el fjuejo y no se hace la peticion solo mostraramos el error en pantalla
  if (data.password !== data.password_confirmation) {
    this.isError.set(true);
    this.message.set("❌ Las nuevas contraseñas no coinciden");
    return; // Detenemos el envío
  }

    // Enviamos la petición POST a la ruta de Laravel junto con nuestra  signal formData
    this.http.post('http://localhost:8000/api/user/change-password', this.formData())
      .subscribe({
        //si la respuesta es positiva lo que hacemos es
        next: (res: any) => {
          //seteamos la signal de error en false
          this.isError.set(false);
          //seteamos message con este mensaje
          this.message.set("✅ ¡Contraseña actualizada con éxito!");
          // Limpiamos el formulario por seguridad
          this.formData.set({
            current_password: '',
            password: '',
            password_confirmation: ''
          });
        },
        //En caso de un error
        error: (err) => {
          //seteamos la variable de error en true para indicar que hay un error 
          this.isError.set(true);
          // Mostramos el error específico (ej: "La contraseña actual no es correcta")
          this.message.set(err.error.message || "❌ Hubo un error al cambiar la contraseña");
        }
      });
  }
}