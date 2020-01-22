import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserProfile } from '../models/user-profile';

/**
 * The Class is responsible for the actions on the user's detailed profile stored in Cloud Firestore, such as 
 * update the information when the user modified and get the information from Cloud Firebase.
 */
@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  /**
   * The User's profile stored in Cloud Firestore 
   */
  private userCollection: AngularFirestoreCollection<UserProfile>;

  /**
   * Consturctor sets up all basic plugin dependencies in the class
   * @param db The Cloud Firestore that stors the user's specific profile, such as username, password, created date, and so on
   * @param authService The service that is responsible for all basic information of the profile, such as email and password
   */
  public constructor(
    private db: AngularFirestore,
    private authService: AuthService
  ) {
    this.userCollection = this.db.collection<UserProfile>('User');
  }

  /**
   * The method is called to get the user's profile from the Cloud Firestore 
   */
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

  /**
   * The method is called to update the user's information when the user modified any information in the profile
   * The machanism is that the old user profile will be compared to the new modified one. 
   * @param profile The user's new modfied profile
   * @returns this.userCollection.doc(profile.id).update(profileCopy); The action that the old profile is updated to the 
   * latest version
   */
  public updateUser(profile: UserProfile): Promise<void> {
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
