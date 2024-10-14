import { Component, OnInit, Input } from '@angular/core';
import { IonToolbar, IonTitle, IonContent, IonButton, IonCardSubtitle, IonCardHeader, IonCard, IonCardTitle, IonCardContent, IonFab, IonFabButton, IonIcon, IonItem, IonHeader, IonFabList, IonList } from '@ionic/angular/standalone';
import { Item } from 'src/app/interfaces/item';
import { CameraService } from 'src/app/services/camera.service';
import { ImagenUploadService } from 'src/app/services/imagen-upload.service';
import { ItemService } from 'src/app/services/item.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cosas',
  templateUrl: './cosas.component.html',
  styleUrls: ['./cosas.component.scss'],
  standalone: true,
  imports: [IonList, IonFabList, IonHeader, IonItem,  IonIcon, IonFabButton, IonFab, IonButton, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonToolbar, IonTitle, IonContent, CommonModule],
})
export class CosasComponent  implements OnInit {

  private cameraService: CameraService = new CameraService();
  private imagenUploadService: ImagenUploadService = new ImagenUploadService();
  //selectedCosas: string = '';
  //cosas: string[] = ['Tomar foto', 'Seleccionar de galería'];
  @Input() cosas!: string;
  photos: any[] = [];
  private itemService: ItemService = new ItemService();

  constructor() { }

  ngOnInit() {
    this.loadPhotos();
  }

  async loadPhotos() {
    try {
      // Cargamos las fotos de la categoría que desees (ej. 'cosas lindas' o 'cosas feas')
      console.log('Cargando fotos de la categoría: ', this.cosas);
      this.photos = await this.itemService.getPhotos(this.cosas);
      console.log('Fotos cargadas: ', this.photos);
    } catch (error) {
      console.error('Error al cargar las fotos:', error);
    }
  }

  async voteForPhoto(photoId: string) {
    console.log('Votando por la foto con ID: ', photoId);
    try {
      await this.itemService.voteForPhoto(photoId);
      this.loadPhotos(); // Recargar fotos para actualizar los votos
    } catch (error) {
      console.error('Error al votar por la foto:', error);
    }
  }

  /* async takePhoto() {
    try {
      const imageBase64 = await this.cameraService.takePhoto();
      if (imageBase64) {
        await this.imagenUploadService.uploadPhoto(imageBase64);
        console.log('Foto tomada y subida con éxito');
      }
    } catch (error) {
      console.error('Error al tomar o subir la foto', error);
    }
  }

  async selectFromGallery() {
    try {
      const imageBase64 = await this.cameraService.selectFromGallery();
      if (imageBase64) {
        await this.imagenUploadService.uploadPhoto(imageBase64);
        console.log('Foto seleccionada y subida con éxito');
      }
    } catch (error) {
      console.error('Error al seleccionar o subir la foto', error);
    }
  } */
}
