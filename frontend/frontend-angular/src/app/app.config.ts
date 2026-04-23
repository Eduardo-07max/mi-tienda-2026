import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor'; // Ajusta la ruta si es necesario

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    //necesitamos agregar esta linea para que nuestro interceptor funcione, el interceptor recordar funciona de forma automatica
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
