import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

/**
 * This class is responsible for the user's basic account information and related actions, such as user registration,
 * user log in, and password recovery
 */
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public userId: string;

  /**
   * Consturctor sets up all basic plugin dependencies in the class
   * @param afAuth The Authentication system of Firebase, the system will be responsible for store the user's basic information, such as email and password linked to the account
   * @param firestore The Cloud Firestore, which records the user's profile when registered
   */

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}
  
  /**
   * The method is called to get the status of the user, whether is signned in
   * @returns this.afAuth.authState The flag identifies whether the user is signned in 
   */

  public getUser(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  /**
   * The method is called to sign in the user
   * @param email The user's email input when signned in
   * @param password The user's password input when signned in
   * @returns this.afAuth.auth.signInWithEmailAndPassword(email, password) The method that sign in the user with all the information the user provided
   */

  public loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  /**
   * The method is called to create a new account in Fireabase Auth, with email and password
   * @param email The email the user registered on the sign-up page
   * @param password The password the user registered on the sign-up page
   * @returns this.firestore.doc(`/User/${userCredential.user.uid}`).set({ email, joinedOn }, { merge: true });
   * The method returns the flag that the new profile is created in Cloud Firestore
   */

  public async registerUser(email: string, password: string): Promise<any> {
    const userCredential = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    const joinedOn = new Date();
    return this.firestore
      .doc(`/User/${userCredential.user.uid}`)
      .set({ email, joinedOn }, { merge: true });
  }

  /**
   * The method is called to send a password.reset email
   * @param email The user's registered email of the account
   * @returns this.afAuth.auth.sendPasswordResetEmail(email); The action that the email is sent to the user
   */
  public resetUserPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  /**
   * The method is called to log out the user
   * The method will be finished until the user is completely signned out (await this.afAuth.auth.signOut())
   */

  public async logoutUser(): Promise<void> {
    try {
      await this.afAuth.auth.signOut()
    } catch (error) {
      console.error('Could not logout:', error);
    }
  }
}
