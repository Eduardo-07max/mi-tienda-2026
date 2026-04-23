import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { AuthService } from './services/auth.service';
import { Footer } from './components/footer/footer';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,Navbar,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Inyectamos el servicio para que el HTML pueda preguntar si hay sesión
  public authService = inject(AuthService);
}
