import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCardSubtitle, IonCardHeader, IonCard, IonCardTitle, IonCardContent, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFabButton, IonFab, IonCardContent, IonCardTitle, IonCard, IonCardHeader, IonCardSubtitle, IonButton, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class Tab1Page implements OnInit{

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
