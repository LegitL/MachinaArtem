import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserProfile } from '../models/user-profile';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userCollection: AngularFirestoreCollection<UserProfile>;

  public constructor(
    private db: AngularFirestore,
    private authService: AuthService
  ) {
    this.userCollection = this.db.collection<UserProfile>('User');
  }

  public async getUserProfile(): Promise<Observable<UserProfile>> {
    const currentUser = await this.authService.getUser().pipe(first()).toPromise();
    if (currentUser) {
      const id = currentUser.uid;
      return this.userCollection.doc<UserProfile>(id).valueChanges().pipe(
        map(user => ({ id, ...user }))
      );
    } else {
      Promise.resolve(null);
    }
  }

  public async updateUser(profile: UserProfile): Promise<void> {

    const currentUser = await this.authService.getUser().pipe(first()).toPromise();

    if (currentUser) {
     
    } else {
      Promise.resolve(null);
    }

    if (profile.email != currentUser.email){

      this.authService.updateEmail(profile.email);
      
    }
    const profileCopy = {...profile};
    delete profileCopy.id;
    return this.userCollection.doc(profile.id).update(profileCopy);
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
