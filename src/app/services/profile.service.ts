import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { first } from 'rxjs/internal/operators/first';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userProfile: AngularFirestoreDocument<UserProfile>;
  private currentUser: firebase.User;

  public constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  public async getUserProfile(): Promise<Observable<UserProfile>> {
    this.currentUser = await this.authService.getUser().pipe(first()).toPromise();
    console.log('Current user:', this.currentUser);
    this.userProfile = this.firestore.doc(`User/${this.currentUser.uid}`);
    return this.userProfile.valueChanges();
  }

  public updateUser(newProfile: UserProfile): Promise<void> {
    return this.userProfile.update(newProfile);
  }

  public async updateEmail(newEmail: string, password: string): Promise<void> {
    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      password
    );
    try {
      await this.currentUser.reauthenticateWithCredential(credential);
      await this.currentUser.updateEmail(newEmail);
      return this.userProfile.update({ email: newEmail });
    } catch (error) {
      console.error(error);
    }
  }

  public async updatePassword(
    newPassword: string,
    oldPassword: string
  ): Promise<void> {
    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      oldPassword
    );
    try {
      await this.currentUser.reauthenticateWithCredential(credential);
      return this.currentUser.updatePassword(newPassword);
    } catch (error) {
      console.error(error);
    }
  }
}

export interface UserProfile {
  email?: string;
  name?: string;
  bio?: string;
  avatar?: string;
  joinedOn?: string;
  // TODO: Add references to user created styles
}
