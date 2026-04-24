import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  imports: [FormsModule, RouterLink],//Forms module nos permite vincular los inputs con  nuestro codigo typescript
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements OnInit {
  authService = inject(AuthService); //Inyectamos nuestro servicio para iniciar sesion y obtener al usuario logeado
  http = inject(HttpClient);//Inyectamos nuestro servicio para hacer peticiones https
  router = inject(Router);

  // Creamos un objeto de tipo signal para recibir los datos del formulario
  userForm = signal({
    name: '',
    email: ''
  });

  // Creamos nuestra variable selectedFile para guardar  nuestra imagen de usuario
  selectedFile: File | null = null;
  //Creamos nuestra variable signal que solo puede ser de tipo string o null la inicializamos en null
  imagePreview = signal<string | null>(null);

  // Aqui tenemos nuestra variable de tipo signal message inicializada en vacio esta nos servira para guardar mensajes como usuario actualizado correctamente
  message = signal('');
  //isError es de tipo signal pero es para valores boleanos
  isError = signal(false);

  ngOnInit() {
    //Aqui guardamos en nuestra constante user el contenido de la variable currentUser que es donde estan los datos de nuestro usuario logeado
    const current = this.authService.currentUser();
    //Aqui agregamos una validacion donde preguntamos si current tiene algo dara true
    if (current) {
      //Aqui seteamos los valores de nuestra signal userForm con los datos del usuario actualmente logueado
      this.userForm.set({
        name: current.name,
        email: current.email
      });
      // imagePreview la seteamos su valor con el userAvatar que contiene la imagen del usuario logeado
      this.imagePreview.set(this.authService.userAvatar());
    }
  }

  // Se activa al elegir una imagen en el input donde el parametro event guardara la imagen que el usuario seleccione 
  onFileSelected(event: any) {
    //En la constante file guardamos la imagen la primer imagen que el usuario selecciono
    const file = event.target.files[0];
    //Comprobamos que si file tiene algo dara true y entrara al bloque if
    if (file) {
      //guardamos la constante file(que contiene la imagen) en selectedFile
      this.selectedFile = file;

      //creamos un objeto reader de tipo FileReader
      const reader = new FileReader();
      //onLoad es un evento que nos dice cuando termines de leer el archivo has esto
      reader.onload = () => {
        //reader.result genera una cadena de texto largisuima apartir de nuestra imagen y la guardamos en imagePreview es necesario generar esta cadena de texto ya que solo asi es posible que html visualuce correctamente nuestra imagen
        this.imagePreview.set(reader.result as string);
      };
      //Ahora para poder ejecutar la accion anterior llamamos a readDataURL donde le pasamos la constante file de parametro para que realice el proceso anterior
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    // Aqui creamos un objeto de tipo FormData
    const formData = new FormData();
    //Aqui creamos las propieades de ese objeto formdata, creamos la propiedad name donde le pasamos el valor de la propiedad userForm.name que viene en nuestro signal que asu vez esta vinculada al input name del formularios, hacemos esto mismo con el email
    formData.append('name', this.userForm().name);
    formData.append('email', this.userForm().email);
    //aqui lo que hacemos es comprobar que la variable de tipo file selectedFile si tiene un archivo si es asi entramos al if
    if (this.selectedFile) {
      //Aqui creamos la propiedad image y la setamos con el valor de la variable selectedFile
      formData.append('image', this.selectedFile);
    }
    //Ahora aqui hacemos nuestra peticion para actualizar nuestro usuario donde le pasamos el formData
    // Usamos POST con ?_method=PUT porque PHP no lee archivos en PUT nativo fácilmente
    this.http.post('https://mi-tienda-2026-production.up.railway.app/api/user/profile?_method=PUT', formData)
      .subscribe({
        //si la respuesta es correcta hacemos esto
        next: (res: any) => {
          //la variable signal isError la setamos con false
          this.isError.set(false);
          //seteamos la variable message con este mensaje
          this.message.set("✅ Perfil y foto actualizados correctamente");
          
          // Actualizamos el signal global para que el Navbar cambie la foto
          this.authService.currentUser.set(res.user);
          
          // Actualizamos los datos del localStorage para que persistan al recargar
          localStorage.setItem('user_data', JSON.stringify(res.user));
        },
        //en caso de un error
        error: (err) => {
          //seteamos la variable isError a true
          this.isError.set(true);
          //Seteamos la variable message con el error
          this.message.set(err.error.message || "❌ Error al actualizar el perfil");
        }
      });
  }
}