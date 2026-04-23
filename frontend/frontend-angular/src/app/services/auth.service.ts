import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
//Con inyectable le decimos a angular este es un servicio al que los otros pueden perdir prestado
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //Aqui inyectamos nuestro servicio HttpClient que nos permite hacer nuestras peticiones
  private http = inject(HttpClient);

  //Nuestra ruta base para conectarnos al backend
  private apiUrl = 'http://localhost:8000/api';

  // Agregamos una variable de tipo signal para guardar al usuario logeado
  public currentUser = signal<any>(null);

  // COMPUTED: Un valor derivado que nos dice si el usuario está logueado o no, da true si tenemos un objeto usuario y false si no tenemos nada 
  public isAuthenticated = computed(() => !!this.currentUser());
  
  // URL base para las fotos de usuarios (esta se mantiene igual porque apunta al storage) sirve para  obtener las imagenes guardadas ahi para poder acceder a esta ruta es necesario crear un puente de acceso a esta ruta lo cual hacemos desde la terminal, reandonly sirve para decirle a la variable que es solo de lectura esto ayuda o evita que la url se llegase a cambiar por error
  private readonly userStorageUrl = 'http://localhost:8000/storage/usuarios/';

  // COMPUTED: Devuelve la URL de la foto o una por defecto
  //userAvatar es una variable de tipo computed es decir una variable que observa a otra variable y en este caso esta varible userAvatar depende de la variable de tipo signal currentUser donde cada que se haga un cambio la variable computed volvera a ejecutarse 
  public userAvatar = computed(() => {
    //Guardamos la variable currentUser en user
    const user = this.currentUser();
//Con este bloque if comprobamos que user si tenga algo osea que si tenga el objeto usuario y que si existe algo en la propiedad name de ese usuario si si existe y todo esta bien lo que hara sera armar y retornar la ruta exacta donde esta nuestra imagen guardada 
    if (user && user.image) {
      return `${this.userStorageUrl}${user.image}`;
    }
    //Si no se cumplen las condiciones del bloque if lo que hacemos es retornar la ruta donde tenemos la imagen por defecto del usuario
    return 'images/default-avatar.avif'; 
  });
//Nuestro metodo checkSession se recarga cada vez que se recarga la pagina gracias al constructor donde con esto logramos que el navegador siempre recuerde al usuario logueado
  constructor() {
    this.checkSession();
  }

  // MÉTODO PARA REGISTRARSE
  //El parametro formData son los datos del usuario que nos llegan desde el formulario y estos al ser de tipo FormData nos permiten no solo enviar texto sino que nos permiten enviar archivos en este caso nuestras imagenes de usuario
  register(formData: FormData) {
    // Ahora llamará a http://localhost:8000/api/register
    return this.http.post<any>(`${this.apiUrl}/register`, formData).pipe(
      //Con el pipe capturamos la respuesta y antes que nada o mejor dicho antes de obtener nuestra respuesta guardamos el usuario y el token en nuestro local storage
      tap(res => this.setSession(res))
    );
  }

  // MÉTODO PARA INICIAR SESIÓN
  //Credentials son los datos que nos llega del formulario como puede ser el email y la contraseña
  login(credentials: any) {
    // Ahora llamará a http://localhost:8000/api/login
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      //La pipe nos sirve para interceptar la respuesta y tap nos ayuda a llamar al metodo setSession que nos ayuda a guardar el token y los datos del usuario
      tap(res => this.setSession(res))
    );
  }

  // MÉTODO PARA CERRAR SESIÓN
  logout() {
    // Ahora llamará a http://localhost:8000/api/logout
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      //Aqui antes de retornar nuestra respuesta eliminamos nuestro token actual y nuestros datos del usuario del localstorage y seteamos nuestra variable currentUser a null
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
        this.currentUser.set(null);
      })
    );
  }

  // FUNCIONES AUXILIARES PRIVADAS
  private setSession(response: any) {
    //aqui en este bloque if comprobamos que nuestra respuesta en access_token si tenga el token del usuario si es asi lo que se hara sera guardar ese token en el localstorage 
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
    }
    //Aqui lo que hacemos es guardar los datos del usuario en el localstorage 
    localStorage.setItem('user_data', JSON.stringify(response.user));
    //Aqui seteamos el valor de nuestra varible signal currentUser con el valor o con los datos de nuestro usuario
    this.currentUser.set(response.user);
  }

//La función checkSession nos permite recuperar el token y los datos que ya estaban en el LocalStorage para rellenar la variable signal currentUser. Así, la app 'recuerda' quién eres sin pedirte login otra vez
  private checkSession() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      //este bloque try catch nos permite capturar errores en caso que los datos del local storage estuvieran corruptos lo que hace aqui es limpiar el localstorague en caso de un error y si no hay error simplemente setea la variable currentUser
      try {
        this.currentUser.set(JSON.parse(userData));
      } catch (e) {
        localStorage.clear();
      }
    }
  }

}