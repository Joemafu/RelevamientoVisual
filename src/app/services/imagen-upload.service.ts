import { Injectable } from '@angular/core';
import { getStorage, ref, getDownloadURL, uploadString } from '@angular/fire/storage';
import { getAuth } from 'firebase/auth';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenUploadService {

  private storage;
  private photoUploadedSubject = new Subject<void>();

  constructor () {
    this.storage = getStorage();
  }

  getPhotoUploadedObservable(): Observable<void> {
    return this.photoUploadedSubject.asObservable();
  }

  async uploadPhoto(imageBase64: string) : Promise<string> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user){
      const storageRef = ref(this.storage, `photos/${user.uid}/${new Date().getTime()}.jpg`);
      await uploadString(storageRef, imageBase64, 'base64',{contentType: 'image/jpeg'});

      this.photoUploadedSubject.next();

      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    }
    throw new Error('Usuario no autenticado');
  }
}