import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit {
  resetPasswordForm: FormGroup;
  instructionsSent = false;
  errorMessage: string = '';
 
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
 
  public async loginUser(value: any) {
    try {
      await this.authService.resetUserPassword(value.email);
      this.instructionsSent = true;
    } catch (err) {
      console.error('Could not reset password:', err)
      this.errorMessage = err.message;
    }
  }

  public navigateBack(): void {
    this.navCtrl.navigateBack('/signin');
  }
}
