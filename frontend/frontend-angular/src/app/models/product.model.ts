export interface Product {
  id?: number;      // El ? significa que es opcional (útil al crear uno nuevo)
  name: string;
  price: number;
  description: string;
}