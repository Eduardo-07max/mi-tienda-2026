import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

//creamos una constante que se puede exportar llamada authGuard y llamamos a la funcion CanActivateFn
//CanActivated se traduce como puede activarse esta ruta y lo que devuelve es un true o un false
//route contiene informacion sobre la ruta a donde quiere ir y state sobre el estado de la app
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);//Inyectamos nuestro servicio router para redirecionar
  
  // Verificamos si existe el token en el almacenamiento local
  const token = localStorage.getItem('token');

  if (token) {
    // Si hay token, permitimos el paso
    return true;
  } else {
    // Si no hay token, lo mandamos a la página de bienvenida (Landing)
    router.navigate(['/']);
    return false;
  }
};
