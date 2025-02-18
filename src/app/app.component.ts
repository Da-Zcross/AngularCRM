import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DummyComponent } from './component/dummy/dummy.component';

@Component({
  selector: 'crm-root',
  standalone: true,
  imports: [
    LoginComponent,
    MatToolbarModule,
    DummyComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Connexion CRM';

  onClicked(event: any) {
    console.log('Button clicked!', event);
  }
}





