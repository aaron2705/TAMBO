import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  mostrarCarrito = false;
  carrito: any[] = [];

  constructor(
    private carritoService: CarritoService,
    private Router: Router,

    private cdr: ChangeDetectorRef // Importa ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.obtenerCarrito();
  }

  toggleCarrito() {
    this.mostrarCarrito = !this.mostrarCarrito;
  }

  cerrarCarrito() {
    this.mostrarCarrito = false;
  }

  obtenerCarrito() {
    this.carritoService.getCarrito().subscribe(data => {
      this.carrito = data;
      this.cdr.detectChanges(); // Fuerza la detección de cambios
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

  eliminarProducto(id: number) {
    this.carritoService.eliminarDelCarrito(id).subscribe(response => {
      console.log('Producto eliminado del carrito:', response);
      this.obtenerCarrito();
    });
  }

  obtenerTotal(): number {
    return this.carrito.reduce((total, item) => total + (item.cantidad * item.precio), 0);
  }

  continuarCompra() {
    this.Router.navigate(['/compra']);
  }
}
