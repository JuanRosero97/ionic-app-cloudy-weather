import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule],
  declarations: [MenuComponent],
  exports: [MenuComponent],
})
export class MenuModule {}
