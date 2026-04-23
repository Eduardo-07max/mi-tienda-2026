import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {
  router = inject(Router);//Inyectamos el serivicio de rutas, nos permite redirecionar y saber en que ruta estamos
  showFooter = signal(true);//Es una variable boleano de tipo signal

  ngOnInit() {
    //llamado esta primera funcion checkRoute para cargara el footer en la ruta inicial
    this.checkRoute(this.router.url);//en que url estoy ahora le pasamos el parametro this.router.url que coniene la ruta actual
    //Este events se queda escuchando todos los cambios en la url o ruta para saber a donde tiene que ir y si debe mostrar o no el footer
    //aqui con router.events. events esta escuchando todos los eventos cuando navgagamos en nuestra web, pero con pipe nos ayuda a capturar solo los eventos que queremos con ayuda de filter, en filtro nos ayuda a capturar solo los eventos NavigationEnd es decir cuando el evento termino
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
      //dentro de suscribe recibimos el evento que logro pasar el filtro
    ).subscribe((event: any) => {
      //aqui mandamos llamar de nuevo a nuestra funcion checkRoute y le pasamos de parametro el evento que capturamos event y con urlAfterRedirects capturamos la url real o ruta donde estamos
      this.checkRoute(event.urlAfterRedirects);
    });
  }

  private checkRoute(url: string) {
    // Creamos un array con las rutas donde no queremos que se vea el footer
    const excludedRoutes = ['/login', '/register'];
    // 'some' recorre el array y devuelve true si la URL actual empieza con /login o /register
    const shouldHide = excludedRoutes.some(route => url.startsWith(route));
    //Seteamos nuestra variable showFooter con el valor que nos de sholudHide pero con !shouldHide obtendremos el valor contrario 
    this.showFooter.set(!shouldHide);
  }
}