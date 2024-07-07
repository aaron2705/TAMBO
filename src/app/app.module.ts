import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CompraComponent } from './compra/compra.component';
import { CarritoComponent } from './carrito/carrito.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CompraComponent,
    CarritoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [provideHttpClient(
      withFetch() // Aquí habilitas el uso de `fetch`
    )],
  bootstrap: [AppComponent]
})
export class AppModule { }
