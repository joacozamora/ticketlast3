//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

//import { AppModule } from './app/app.module';


//platformBrowserDynamic().bootstrapModule(AppModule)
//  .catch(err => console.error(err));
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Standalone AppComponent
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module'; // Tus rutas
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/seguridad/token-interceptor-http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Proveer las rutas
    importProvidersFrom(BrowserAnimationsModule, SweetAlert2Module.forRoot()), // Importa BrowserAnimationsModule y otros módulos
    provideHttpClient(withInterceptors([authInterceptor])) // Proveer interceptores de HTTP
  ]
}).catch(err => console.error(err));

