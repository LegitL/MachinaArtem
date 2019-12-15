import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastController, NavController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraDirection, CameraSource } from '@capacitor/core';
import { ProfileService, UserProfile } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

const { Camera } = Plugins;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  errorMessage: string = '';
  profileImage = '';
  profileSubscription: Subscription;
 
  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private authService: AuthService,
    private profileService: ProfileService,
  ) { }
 
  public async ngOnInit(): Promise<void> {
    this.profileForm = this.formBuilder.group({
      email: [''],
      name: [''],
      bio: [''],
    });

    const userProfile$ = await this.profileService.getUserProfile();
    this.profileSubscription = userProfile$.subscribe(user => {
      this.profileForm.patchValue(user);
      this.profileImage = user.avatar;
    });
  }
 
  public async captureProfileImage(): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 90,
      height: 256,
      width: 256,
      allowEditing: true,
      direction: CameraDirection.Front,
      source: CameraSource.Prompt,
      resultType: CameraResultType.DataUrl,
    });
    const newProfile: UserProfile = {
      avatar: image.dataUrl
    };

    try {
      await this.profileService.updateUser(newProfile);
    } catch (error) {
     console.error('Could not save avatar:', error);
      // TODO: Show user error message.
    }
  }

  public async save(newProfile: UserProfile) {
    try {
       await this.profileService.updateUser(newProfile);
       const toast = await this.toastController.create({
        message: 'Profile changes saved',
        color: 'light',
        duration: 2000
      });
      toast.present();
    } catch (error) {
      console.error('Could not save user profile:', error);
      // TODO: Show user error message.
    }
  }

  public changePassword(): void {
    // TODO: Implement change password
  }

  public logout(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }

    this.authService.logoutUser();
    this.navCtrl.navigateRoot('/signin');
  }
}
