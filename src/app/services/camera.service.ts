import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  private photoUploadedSubject = new Subject<void>();

  constructor() { }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64, 
      source: CameraSource.Camera 
    });
  
    this.photoUploadedSubject.next();
    return image.base64String; 
  }
  
  async selectFromGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos 
    });
  
    this.photoUploadedSubject.next();
    return image.base64String;
  }

  getPhotoUploadedObservable(): Observable<void> {
    return this.photoUploadedSubject.asObservable();
  }
}