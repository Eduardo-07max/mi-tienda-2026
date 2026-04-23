import { HttpInterceptorFn } from '@angular/common/http';
//Aqui creamos una constante global llamada authInterceptor de tipo HttpInterceptor donde vamos a atrapar cada peticion donde req representa cada peticion y next que todo esta bien con esa peticion
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Recuperamos el token que guardamos al registrar/loguear
  const token = localStorage.getItem('token');

  // Si tenemos un token, clonamos la petición y le añadimos el encabezado Authorization
  if (token) {
    //req.clone aqui es donde estamos clonando la peticion y agregandole la cabecera con nuestro token que teniamos en nuestro local storage
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    //Retornamos a laravel esta peticion con su token
    return next(authReq);
  }

  // Si no hay token, la petición sigue su curso original
  return next(req);
};