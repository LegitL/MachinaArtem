import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userId: string;
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  public getUser(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  public loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public async registerUser(email: string, password: string): Promise<any> {
    const userCredential = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    const joinedOn = new Date();
    return this.firestore
      .doc(`/User/${userCredential.user.uid}`)
      .set({ email, joinedOn }, { merge: true });
  }

  public resetUserPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public async logoutUser(): Promise<void> {
    try {
      await this.afAuth.auth.signOut()
    } catch (error) {
      console.error('Could not logout:', error);
    }
  }
}
