import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Style } from '../models/style';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityStylesService {
  private styleCollection: AngularFirestoreCollection<Style>;

  public constructor(
    private db: AngularFirestore
  ) {
    this.styleCollection = this.db.collection<Style>('Style');
  }

  flaggedStyle: Style;

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

  public addStyle(style: Style): Promise<DocumentReference> {
    const styleCopy = {...style};
    delete style.id;
    return this.styleCollection.add(styleCopy);
  }

  public removeStyle(style: Style): Promise<void> {
    return this.styleCollection.doc(style.id).delete();
  }

  public flagStyle(style: Style){

    if (style.flag == 5){
        this.removeStyle(style);
    }

    this.flaggedStyle = style;

  }

  public returnFlaggedStyleTarget(): any{

    return this.flaggedStyle.date;

  }
}
