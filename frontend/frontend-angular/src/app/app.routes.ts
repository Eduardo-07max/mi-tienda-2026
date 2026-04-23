import { Routes } from '@angular/router';
import { Welcome } from './pages/welcome/welcome';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ProductList } from './pages/product-list/product-list';
import { AddProduct } from './pages/add-product/add-product';
import { EditProduct } from './pages/edit-product/edit-product';
import { ProductDetail } from './pages/product-detail/product-detail';
import { authGuard } from './auth/auth-guard';//Importamos nuestro guard
import { EditProfile } from './components/edit-profile/edit-profile';
import { ChangePassword } from './components/change-password/change-password';

export const routes: Routes = [
  {
    path: '',
    component: Welcome // Ahora esta es la página principal
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'products', // Cambiamos la lista a '/products'
    component: ProductList,
    canActivate: [authGuard]//Aplicamos un guard para proteger nuestras rutas ya que si no estamos logeados no podremos acceder a estas rutas
  },

  {
    path: 'add-product',
    component: AddProduct,
    canActivate: [authGuard]//Protejemos la ruta, solo los usuarios logueados pueden entrar
  },
  {
    path: 'edit-product/:id',
    component: EditProduct,
    canActivate: [authGuard]
  },
  { path: 'product/:id', component: ProductDetail, canActivate: [authGuard] },
 // ✅ Protección añadida a perfil y seguridad
  { 
    path: 'edit-profile', 
    component: EditProfile, 
    canActivate: [authGuard] //Protegemos la ruta solo los usuarios logeados pueden entrar
  },
  { 
    path: 'change-password', 
    component: ChangePassword, 
    canActivate: [authGuard] 
  },

  // Redirección por si el usuario escribe cualquier cosa loca en la URL nos redirira a la ruta base
  { 
    path: '**', 
    redirectTo: '' 
  }
  

];
