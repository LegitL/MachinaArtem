import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserProfile } from '../models/user-profile';
import { FavoriteStyle } from '../models/favorite-style';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userCollection: AngularFirestoreCollection<UserProfile>;

  private currentUser: firebase.User;

  public constructor(
    private db: AngularFirestore,
    private authService: AuthService
  ) {
    this.userCollection = db.collection<UserProfile>('User');
  }

  public async getUserProfile(): Promise<Observable<UserProfile>> {
    this.currentUser = await this.authService.getUser().pipe(first()).toPromise();
    if (this.currentUser) {
      const id = this.currentUser.uid;
      return this.userCollection.doc<UserProfile>(id).valueChanges().pipe(
        map(user => ({ id, ...user }))
      );
    } else {
      Promise.resolve(null);
    }
  }

  public updateUser(newProfile: UserProfile): Promise<void> {
    const id = newProfile.id;
    delete newProfile.id;
    return this.userCollection.doc(id).update(newProfile);
  }

  // public async updateEmail(newEmail: string, password: string): Promise<void> {
  //   const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
  //     this.currentUser.email,
  //     password
  //   );
  //   try {
  //     await this.currentUser.reauthenticateWithCredential(credential);
  //     await this.currentUser.updateEmail(newEmail);
  //     return this.userProfile.update({ email: newEmail });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // public async updatePassword(
  //   newPassword: string,
  //   oldPassword: string
  // ): Promise<void> {
  //   const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
  //     this.currentUser.email,
  //     oldPassword
  //   );
  //   try {
  //     await this.currentUser.reauthenticateWithCredential(credential);
  //     return this.currentUser.updatePassword(newPassword);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
}
