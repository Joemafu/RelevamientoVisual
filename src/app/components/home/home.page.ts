import { Component, OnInit, inject } from '@angular/core';
import { IonContent, IonCard, IonCardContent, IonFab, IonFabButton, IonIcon, IonFabList } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CosasComponent } from '../cosas/cosas.component';
import { CameraService } from 'src/app/services/camera.service';
import { ImagenUploadService } from 'src/app/services/imagen-upload.service';
import Swal from 'sweetalert2';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonFabList, IonIcon, IonFabButton, IonFab, IonCardContent, IonCard, IonContent, CosasComponent ],
})
export class HomePage implements OnInit {

  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  usuario: string = '';
  public subscription: Subscription = new Subscription();
  selectedCosas: string = '';
  private cameraService: CameraService = new CameraService();
  private imagenUploadService: ImagenUploadService = new ImagenUploadService();
  private itemService: ItemService = inject(ItemService);

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

  async takePhoto() {
    try {
      const imageBase64 = await this.cameraService.takePhoto();
      if (imageBase64) {
        const url = await this.imagenUploadService.uploadPhoto(imageBase64);
        this.itemService.savePhotoData(url, this.selectedCosas);

        Swal.fire({
          title: 'Imagen subida exitosamente',
          icon: 'success',
          heightAuto: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
        });
        
    this.selectedCosas = '';
      }
    } catch (error) {
      Swal.fire({
        title: 'Error al subir la foto',
        icon: 'error',
        heightAuto: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      
    this.selectedCosas = '';

    }
  }

  async selectFromGallery() {
    try {
      const imageBase64 = await this.cameraService.selectFromGallery();
      if (imageBase64) {
        const url = await this.imagenUploadService.uploadPhoto(imageBase64);        
        this.itemService.savePhotoData(url, this.selectedCosas);

        Swal.fire({
          title: 'Imagen subida exitosamente',
          icon: 'success',
          heightAuto: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
        });
        this.selectedCosas = '';
      }
    } catch (error) {
      Swal.fire({
        title: 'Error al subir la foto',
        icon: 'error',
        heightAuto: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      
    this.selectedCosas = '';
    }
  }
}