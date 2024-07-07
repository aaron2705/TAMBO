import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  registrarCompra(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/compra`, data);
  }

  
}