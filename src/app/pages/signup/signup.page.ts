import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Match } from 'src/app/validators/match';

/**
 * This page is responsible for registering a new account for the user 
 * The page will call the method in auth.service to sucessfully register an account 
 */

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  signupForm: FormGroup;
  errorMessage: string = '';
 
  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }
 
  public ngOnInit():void {
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      password: ['', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'), //this is for the letters (both uppercase and lowercase) and numbers validation
        Validators.required
      ])],
      confirmPassword: ['', Validators.required]
    },
    {
      validator: Match('password', 'confirmPassword')
    });
  }
 
  validationMessages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
      { type: 'maxlength', message: 'Password must be less that 20 characters' },
      { type: 'pattern', message: 'Password must contain at least a lower case, a upper case, and numbers'}
    ],
    'confirmPassword': [
      { type: 'mustMatch', message: 'Password must match' }
    ]
  };
 
  public async registerUser(value: any) {
    try {
      await this.authService.registerUser(value.email, value.password);
      this.errorMessage = "";
      this.navCtrl.navigateRoot('/home');
    } catch (err) {
      console.error('Could not sign up:', err)
      this.errorMessage = err.message;
    }
  }

  public navigateToSignin(): void {
    this.navCtrl.navigateRoot('/signin');
  }
}
