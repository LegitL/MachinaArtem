import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Style } from '../models/style';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

/**
 * The class is repsonsible for the actios applied on the community styles, such as addition, removal,
 * extraction from the database, and save the style to the local storage and Cloud Firestore
 */
export class CommunityStylesService {
  private styleCollection: AngularFirestoreCollection<Style>;

  /**
   * Consturctor sets up all basic plugin dependencies in the class
   * @param db The Cloud Firestore that stores the information of the community styles
   */
  public constructor(
    private db: AngularFirestore
  ) {
    //Assign the styleCollection to the stored styles in Cloud Firestore
    this.styleCollection = this.db.collection<Style>('Style');
  }

  /**
   * The method is called to get all styles from Cloud Firestore storage
   * @returns Observable<Style[]> The list of style stored in the local storage
   */
  public getAllStyles(): Observable<Style[]> {
    return this.styleCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  /**
   * The method is called to add the style to the community style
   * The style will be saved on both local storage and Cloud Firestore
   * @param style The style that the user added to the list of styles 
   */
  public addStyle(style: Style): Promise<DocumentReference> {
    const styleCopy = {...style};
    delete style.id;
    return this.styleCollection.add(styleCopy);
  }

  /**
   * The method removes style from the list of styles in CLoud Firestore
   * @param style The targeted style to be removed
   */
  public removeStyle(style: Style): Promise<void> {
    return this.styleCollection.doc(style.id).delete();
  }
}
