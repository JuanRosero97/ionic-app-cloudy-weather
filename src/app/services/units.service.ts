import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  private unitSource = new BehaviorSubject<string>('metric');
  currentUnit = this.unitSource.asObservable();

  constructor() {}

  changeUnit(unit: any) {
    this.unitSource.next(unit);
  }
}
