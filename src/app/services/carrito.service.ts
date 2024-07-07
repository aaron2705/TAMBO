import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://localhost:3000/carrito';
  private apiUrl2 = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getCarrito(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
   
  agregarAlCarrito(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto);
  }

  actualizarCantidad(idProducto: number, cantidad: number): Observable<any> {
    const url = `${this.apiUrl}/${idProducto}/actualizarCantidad`;
    return this.http.put<any>(url, { cantidad });
  }

  eliminarDelCarrito(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  registrarCompra(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl2}/compras`, data);
  }

  vaciarCarrito(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete`);
  }
  
}
