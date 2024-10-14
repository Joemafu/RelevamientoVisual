import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64, // También puedes usar CameraResultType.Uri si prefieres manejar archivos.
      source: CameraSource.Camera // O CameraSource.Photos para abrir la galería.
    });
  
    return image.base64String; // Esto será útil para subir la imagen a Firebase.
  }
  
  async selectFromGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos // Para abrir la galería.
    });
  
    return image.base64String;
  }
}