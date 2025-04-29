import { inject, Injectable } from '@angular/core';
import { Firestore, collection, query, orderBy, getDocs, addDoc, updateDoc, doc, arrayUnion, where } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { Item } from '../interfaces/item';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  firestore: Firestore = inject(Firestore);
  auth: AuthService = inject(AuthService);

  constructor() {}

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
    const photosQuery = query(photosCollection, where('category', '==', category), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(photosQuery);
  
    const photos: Item[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as Item;
      return {
        id: doc.id,             
        imageUrl: data.imageUrl,
        author: data.author,
        category: data.category,
        voters: data.voters,
        createdAt: data.createdAt
      };
    });
  
    return photos.filter(photo => photo.category === category);
  }

  async voteForPhoto(photoId: string) {
    const photoRef = doc(this.firestore, `photos/${photoId}`);
    
    await updateDoc(photoRef, {
      voters: arrayUnion(this.auth.currentUser)
    });
  }
  
}