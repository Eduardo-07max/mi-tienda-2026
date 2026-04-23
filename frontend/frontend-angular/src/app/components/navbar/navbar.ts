import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],//Importamos router link para poder navegar a otras rutas desde el HTML
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  authService = inject(AuthService);//Inyectamos nuestro servicio para iniciar sesion, registrarse, etc
  router = inject(Router);//Inyectamos router para redidijirnos a otros componentes

  showNavbar = signal(true);//Para saber si se debe mostrar o no el navbar
  menuVisible = signal(false);//Para saber si se debe desplegar o no el menu

  ngOnInit() {
    this.checkRoute(this.router.url);
//Aqui con ayuda de router  nos estamos centrando en las urls con events estamos atentos a todos los eventos pero con  pipe nos centramos en solo ciertos eventos
    this.router.events.pipe(
      //// Usamos filter para ignorar todos los eventos intermedios y quedarnos solo con NavigationEnd, que es el momento exacto en que el usuario ya llegó a su destino final.
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.urlAfterRedirects);
    });
  }

  private checkRoute(url: string) {
    // 1. Limpiamos la URL (quitamos parámetros si existen) con split('?') quitamos esos parametros y con [0] guardamos la url sin parametros ya que aqui no interesa los parametros solo en que ruta estamos
    const currentUrl = url.split('?')[0];

    // 2. Definimos las rutas donde NO QUEREMOS que aparezca el Navbar
    const excludedRoutes = [
      '/login',
      '/register',
      '/add-product',
      '/edit-product',
    ];

    // 3. Lógica precisa:
    // - Ocultar si es la raíz exacta (Welcome)
    //Aqui estamos creando una constante llamada isWelcome donde si currentUrl es igual a / o a " " nuestra variable is welcome dara true
    const isWelcome = currentUrl === '/' || currentUrl === '';
    
    // - Ocultar si es Login o Register
    //Aqui en isAuth tenemos ecludedRoutes que es nuestro array con la rutas que queremos excluir para evitar que se vea el navbar con some estamos diciendo si existe al menos una ruta en mi array que coincida con la actual dara true y si no dara false currentUrl es la ruta actual en la que estamos y con startsWith(route) preguntamos empieza con la ruta route donde route es cada elemento del array
    const isAuth = excludedRoutes.some(route => currentUrl.startsWith(route));

    // Si es Welcome O es Auth (Login/Register), entonces shouldShow es FALSO
    //Aqui en nuestra constante shouldShow estamos verificando si estamos en isWelcome que es la vista de bienvenida o si isAuth es true osea que estamos en alguna de las rutas prohibidas con que se cumpla una ya sea isWelcome es true o isAuth sea true se volvera false gracias a ! con esto volviendo false shouldShow 
    const shouldShow = !(isWelcome || isAuth);
    //Aqui seteamos el valor del showNavbar con el de sholudShow donde dependiendo de que ruta este dara false para no mostrar el navbar o true para mostrarlo
    this.showNavbar.set(shouldShow);
    //Seteamos el valor de menuVisible en false
    this.menuVisible.set(false);
  }
//Esta funcion nos sirve para cambiarle el valor a la variable menuVisible que nos sirve para mostrar el menu cuando esta en true y no mostrarlo cuando esta en false
  toggleMenu() {
    //Aqui con update(v => !v) v representa el valor actual ya sea true o false y !v representa el valor contrario donde cada que invoquemos a nuestra funcion togglemenu el valor actual cambiara por el contrario como si fuera un apagador cerrando y abriendo el menu
    this.menuVisible.update(v => !v);
  }
//Nuestra funcion on logout es la encargada de con ayuda de nuestro servicio invocar al metodo logout para cerrar la sesion
  onLogout() {
    this.authService.logout().subscribe({
      //Si todo salio bien entonces la respuesta es positiva y cuando recibamos la respuesta lo que hara sera redirigirnos al login una vez hecho esto lo que hace el metodo es eliminar del local storage el token y los datos del usuario
      next: () => {
        this.router.navigate(['/login']);
      },
      //En caso de que la respuesta que tengamos sea erronea lo que haremos sera visualiar el mensaje de error en consola y limpiar el localstorage y redirigirnos al login
      error: (err) => {
        console.error('Error al cerrar sesión', err);
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}