import { inject, Injectable } from '@angular/core';
import { Firestore, collection, query, orderBy, getDocs, addDoc, updateDoc, doc, arrayUnion } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { Item } from '../interfaces/item';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private readonly PATH = 'cosas';
  firestore: Firestore = inject(Firestore);

  constructor() {}

/*   obtenerItems(): Observable<Item[]> {
    const colRef = collection(this.firestore, this.PATH);
    const q = query(colRef);
    return from(getDocs(q)).pipe(
      map(querySnapshot => querySnapshot.docs.map(docSnap => docSnap.data() as Item))
    );
  }

  agregarItem(item: Item): Observable<void> {
    const colRef = collection(this.firestore, this.PATH);
    return from(addDoc(colRef, item)).pipe(map(() => {}));
  }

  actualizarItem(item: Partial<Item>): Observable<void> {
    const docRef = doc(this.firestore, `${this.PATH}`);
    return from(updateDoc(docRef, item)).pipe(map(() => {}));
  } */

  async savePhotoData(imageUrl: string, category: string) {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const email = user.email ? user.email.split('@')[0] : 'anonymous';
      const photoData = {
        imageUrl,
        author: email,
        voters: [],
        category,
        createdAt: new Date().toISOString()
      };

      const photosCollection = collection(this.firestore, 'photos');
      await addDoc(photosCollection, photoData);
    }
  }

  async getPhotos(category: string): Promise<Item[]> {
    const photosCollection = collection(this.firestore, 'photos');
    const photosQuery = query(photosCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(photosQuery);
  
    const photos: Item[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as Item;
      return {
        id: doc.id,             // Asignamos el ID del documento manualmente
        imageUrl: data.imageUrl, // Asignamos manualmente cada campo
        author: data.author,
        category: data.category,
        voters: data.voters,
        createdAt: data.createdAt
      };
    });
  
    return photos.filter(photo => photo.category === category);
  }

  async voteForPhoto(photoId: string): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const photoRef = doc(this.firestore, `photos/${photoId}`);
      await updateDoc(photoRef, {
        voters: arrayUnion(user.email) // Agregamos el correo del votante
      });
    }
  }
}