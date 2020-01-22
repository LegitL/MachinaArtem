import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

/**
 * This page is responsible for all actions and variables on the password recovery page. On this page, once the user
 * enters the registered email, the page will call the authentication.service for the permission to send the password
 * reset email.
 * 
 */

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})

export class PasswordRecoveryPage implements OnInit {
  resetPasswordForm: FormGroup;
  instructionsSent = false;
  errorMessage: string = '';
 
  /**
   * 
   * @param navCtrl The navigator of the page.
   * @param formBuilder The object that accepts the user's input and submit to the method in auth.service
   * @param authService The service that is responsible to perform actions to the modification of the basic user info, such as the account's email and passowrd.
   */
  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }
 
  public ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }
 
  validationMessages = {
    'email': [
      { type: 'required', message: 'Email is required.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' }
    ]
  };
 
  /**
   * The method reset the user's passowrd by sending the user a password-reset email
   * @param value The user's input in the textfield, which is email the user registered 
   */
  public async resetPassword(value: any) {
    try {
      await this.authService.resetUserPassword(value.email);
      this.instructionsSent = true;
    } catch (err) {
      console.error('Could not reset password:', err)
      this.errorMessage = err.message;
    }
  }

  /**
   * The method send the user back to the home page to sign in
   */
  public navigateBack(): void {
    this.navCtrl.navigateBack('/signin');
  }
}
