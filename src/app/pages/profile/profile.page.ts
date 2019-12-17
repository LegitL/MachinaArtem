import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastController, NavController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraDirection, CameraSource } from '@capacitor/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserProfile } from 'src/app/models/user-profile';
import { FavoriteStylesService } from 'src/app/services/favorite-styles.service';
import { identifierModuleUrl } from '@angular/compiler';

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
  userProfile: UserProfile;
  profileSubscription: Subscription;
 
  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private authService: AuthService,
    private profileService: ProfileService,
    private favoriteStylesService: FavoriteStylesService,
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
      this.userProfile = user;
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

    this.userProfile.avatar = image.dataUrl;

    try {
      await this.profileService.updateUser(this.userProfile);
    } catch (error) {
     console.error('Could not save avatar:', error);
      // TODO: Show user error message.
    }
  }

  public async save(newProfile: UserProfile) {
    try {
      this.userProfile = { ...this.userProfile, ...newProfile}
      await this.profileService.updateUser(this.userProfile);
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

  public async logout(): Promise<void> {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }

    await this.authService.logoutUser();
    await this.favoriteStylesService.removeAllFavorites();
    this.navCtrl.navigateRoot('/signin');
  }
}
