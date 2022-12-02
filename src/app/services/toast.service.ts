import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}
  isToastPresent = false;
  async displayToast(message: any, error?: any) {
    if (!this.isToastPresent) {
      this.isToastPresent = true;

      const toast = await this.toastController.create({
        //animated: true,
        //color: 'dark',
        duration: 6000,
        message: `${error ? `${message}` : message}`,
        cssClass: error ? error : '',
        icon: error ? 'remove-circle' : '',
        buttons: [
          {
            side: 'end',
            role: 'cancel',
            icon: 'close',
            cssClass: 'custom-toast-button',
            handler: () => {},
          },
        ],
      });

      toast.present();
      toast.onDidDismiss().then(() => (this.isToastPresent = false));
    }
  }
}
