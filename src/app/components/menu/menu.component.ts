import { Component, OnInit } from '@angular/core';
import { UnitsService } from '../../services/units.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor(private unitService: UnitsService) {}

  ngOnInit() {}

  check($event: any) {
    this.unitService.changeUnit($event.detail.checked ? 'imperial' : 'metric');
  }
}
