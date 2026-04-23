import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';//Importamos router link para poder ir a otras vistas o componentes

@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  
}
