import { Injectable } from '@angular/core';
import { StorageError, getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, uploadString } from '@angular/fire/storage';
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

  /* async subirImagen(file: File, nroDocumento : number, nroDeFoto : Number): Promise<string> {
    return new Promise((resolve, reject) => {

      const path : string = `imagenes/${nroDocumento}-${nroDeFoto}-${(file.name.split('.').pop())}`;
      const storageRef = ref(this.storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        () => {},
        (error: StorageError) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          
          resolve(url);
        }
      );
    });
  } */

  /* deleteImage(imageUrl: string): Promise<void> {
    const storageRef = ref(this.storage, imageUrl);
    return deleteObject(storageRef);
  } */

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