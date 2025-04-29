import { Component, OnInit, Input, inject } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonIcon, IonList } from '@ionic/angular/standalone';
import { Item } from 'src/app/interfaces/item';
import { ItemService } from 'src/app/services/item.service';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { getAuth } from 'firebase/auth';
import { CameraService } from 'src/app/services/camera.service';
@Component({
  selector: 'app-cosas',
  templateUrl: './cosas.component.html',
  styleUrls: ['./cosas.component.scss'],
  standalone: true,
  imports: [IonList, IonIcon, IonButton, IonCardContent, IonCard, CommonModule],
})
export class CosasComponent  implements OnInit {

  authService: AuthService = inject(AuthService);
  usuario: string = '';
  @Input() cosas!: string;
  private itemService: ItemService = new ItemService();
  photos: any[] = [];
  cameraService: CameraService = inject(CameraService);

  constructor() { }

  ngOnInit() {
    this.cameraService.getPhotoUploadedObservable().subscribe(() => {
      this.loadPhotos();
    });

    const auth = getAuth();
    this.usuario = auth.currentUser?.email!;
    this.loadPhotos();
  }

  async loadPhotos() {
    try {
      this.photos = await this.itemService.getPhotos(this.cosas);
    } catch (error) {
      console.error('Error al cargar las fotos:', error);
    }
  }

  hasVoted(photo: Item): boolean {
    return photo.voters && photo.voters.includes(this.usuario);
  }

  isPhotoAuthor(author: string): boolean {
    console.log('author:', author);
    console.log('this.usuario:', this.usuario);
    return author === this.usuario.split('@')[0];
  }

  async voteForPhoto(photoId: string) {
    try {
      await this.itemService.voteForPhoto(photoId);
      const photoIndex = this.photos.findIndex(photo => photo.id === photoId);
      if (photoIndex !== -1) {
        this.photos[photoIndex].voters.push(this.usuario); 
      }

    } catch (error) {
      console.error('Error al votar por la foto:', error);
    }
  }
}
