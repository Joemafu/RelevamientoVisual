import { Component, OnInit, inject } from '@angular/core';
import { IonToolbar, IonTitle, IonContent, IonButton, IonCardSubtitle, IonCardHeader, IonCard, IonCardTitle, IonCardContent, IonFab, IonFabButton, IonIcon, IonItem } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonItem,  IonIcon, IonFabButton, IonFab, IonButton, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {

  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  usuario: string = '';
  public subscription: Subscription = new Subscription();
  selectedCosas: string = '';

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentUserSig.set({
          mail: user.email!,
          pass: "",
          nombre: "", 
          apellido: "",
        });
        this.usuario = user.email!;        
      } else {
        this.usuario="";
        this.authService.currentUserSig.set(null);    
      }
    });
  }

  goToCosas(cosas: string)
  {
    this.selectedCosas = cosas;
  }

  goHome() {
    this.selectedCosas = '';
  }

  logout() {
    this.authService.logout();
  }
}