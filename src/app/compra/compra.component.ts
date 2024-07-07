import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {
  carrito: any[] = [];
  subtotal: number = 0;
  delivery: number = 4.00;
  total: number = 0;
  direccion: string = '';
  telefono: string = '';
  tipoComprobante: string = 'Boleta';
  metodoPago: string = 'Tarjeta de Crédito o Débito';

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerCarrito();
    window.onclick = (event: any) => {
      const modal = document.getElementById('compraExitosaModal');
      if (event.target == modal) {
        this.cerrarModal();
      }
    }
  }

  obtenerCarrito() {
    this.carritoService.getCarrito().subscribe(data => {
      this.carrito = data;
      this.calcularTotales();
    });
  }

  calcularTotales() {
    this.subtotal = this.carrito.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
    this.total = this.subtotal + this.delivery;
  }

  registrarCompra() {
    const compra = {
      direccion: this.direccion,
      telefono: this.telefono,
      tipoComprobante: this.tipoComprobante,
      metodoPago: this.metodoPago,
      total: this.total,
      carrito: this.carrito
    };
    
    this.abrirModal();
    setTimeout(() => {
        this.vaciarCarrito();
        this.router.navigate(['/']);
        this.cerrarModal();
      }, 1000);


    this.carritoService.registrarCompra(compra).subscribe(response => {
    }, error => {
      console.error('Error al registrar la compra', error);
    });
  }

 
  abrirModal() {
    const modal = document.getElementById('compraExitosaModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  cerrarModal() {
    const modal = document.getElementById('compraExitosaModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  vaciarCarrito() {
    this.carritoService.vaciarCarrito().subscribe({
      next: (response) => {
        console.log('Carrito vaciado exitosamente', response);
      },
      error: (error) => {
        console.error('Error al vaciar el carrito', error);
      }
    });
  }
}
