import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

/**
 * This page is responsible for the user to sign into the app
 * 
 * When the user enters the input for the basic information of the account, the page will call
 * the methods in auth.service to get the permission to sign in
 */

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})

export class SigninPage implements OnInit {
  signinForm: FormGroup;
  errorMessage: string = '';

  validationMessages = {
    'email': [
      { type: 'required', message: 'Email is required.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' }
    ]
  };
 

  public constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }
 
  public ngOnInit(): void {
    this.signinForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
 
  public async loginUser(value: any) {
    try {
      await this.authService.loginUser(value.email, value.password);
      this.errorMessage = "";
      this.navCtrl.navigateRoot('/home');
    } catch (err) {
      console.error('Could not sign in:', err)
      this.errorMessage = err.message;
    }
  }

  public navigateToPasswordRecovery(): void {
    this.navCtrl.navigateForward('/password-recovery');
  }

  public navigateToSignup(): void {
    this.navCtrl.navigateRoot('/signup');
  }
}
