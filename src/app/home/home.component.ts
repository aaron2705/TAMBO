import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/productos.service';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productos: any[] = [];
  carrito: any[] = [];

  constructor(
    private productosService: ProductService,
    private carritoService: CarritoService
  ) { }

  ngOnInit(): void {
    this.productosService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  obtenerCarrito() {
    this.carritoService.getCarrito().subscribe(data => {
      this.carrito = data;
    });
  }

  agregarAlCarrito(producto: any): void {
    const { id, name, precio } = producto;
    const cantidad = 1; // Establecer la cantidad como 1
    this.carritoService.agregarAlCarrito({ id_producto: id, nombre: name, precio, cantidad }).subscribe(response => {
      console.log('Producto agregado al carrito:', response);
      this.obtenerCarrito();
    });

   
  }
  
  
}
