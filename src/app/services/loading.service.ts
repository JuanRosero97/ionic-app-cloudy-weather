import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  isLoading = false;

  constructor(public loadingController: LoadingController) {}

  async present(options: any) {
    this.isLoading = true;
    return await this.loadingController.create(options).then((a) => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    setTimeout(async () => {
      await this.loadingController.dismiss();
      console.log('dismissed');
    }, 100);
  }
}
