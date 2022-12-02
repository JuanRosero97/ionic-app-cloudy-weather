import { Component, Input, OnInit } from '@angular/core';
// import moment from 'moment';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';

import * as moment from 'moment';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { UnitsService } from '../services/units.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
moment.locale('es');
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  dataActualDay: any = {};
  weatherDays: any = [];

  actualTemp: any = '';
  wind: any = '';
  imgActual: any = '';
  sunset: any = '0';
  sunrise: any = '0';
  today: any = '';

  lang = 'es';
  day = true;
  units = 'metric';
  nameCity = 'Popayán';
  country = '';

  $currentUnit: Subscription | any;
  message: string | any;

  constructor(
    public apiService: ApiService,
    public loading: LoadingService,
    private toast: ToastService,
    private unitService: UnitsService,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    this.$currentUnit = this.unitService.currentUnit.subscribe(async (u) => {
      this.units = u;
      await this.refreshViews();
    });
  }

  ngOnDestroy(): void {
    if (this.$currentUnit) this.$currentUnit.unsubscribe();
  }

  async handleRefresh(e: any) {
    try {
      await this.refreshViews();
      e.target.complete();
    } catch (error) {
      console.log(
        '🚀 ~ file: dashboard.page.ts ~ line 35 ~ DashboardPage ~ handleRefresh ~ e',
        error
      );
      e.target.complete();
    }
  }

  async refreshViews() {
    this.loading.present({
      message: 'Consultando información, por favor espere...',
    });

    try {
      await this.getInfoActualDay();
      await this.getInfoWeatherDays();
      await this.checkDates();
      this.loading.dismiss();
    } catch (e) {
      this.showError(e);
      this.loading.dismiss();
    }
  }

  async getInfoActualDay() {
    let promise = new Promise((resolve, reject) => {
      this.apiService
        .get(
          `/weather?q=${this.nameCity}&units=${this.units}&lang=${this.lang}&appid=${environment.WEATHER_API_KEY}`
        )
        .subscribe(
          async (res: any) => {
            if (res.cod === 200) {
              this.dataActualDay = res;
              this.actualTemp = Math.round(this.dataActualDay.main.temp);
              this.wind = Math.round(
                this.dataActualDay.wind.speed *
                  (this.units === 'metric' ? 3.6 : 1.61)
              );
              this.imgActual = `https://openweathermap.org/img/wn/${this.dataActualDay.weather[0].icon}@4x.png`;
              this.sunrise = this.dataActualDay.sys.sunrise;
              this.sunset = this.dataActualDay.sys.sunset;
              this.today = moment(this.dataActualDay.dt, 'X').format(
                'DD MMM YYYY'
              );
              this.country = this.dataActualDay.sys.country;
              console.log(
                '🚀 ~ file: dashboard.page.ts ~ line 81 ~ DashboardPage ~ resActualDay',
                this.dataActualDay
              );
              resolve(this.dataActualDay);
            } else {
              console.log(
                '🚀 ~ file: dashboard.page.ts ~ getInfoActualDay - error',
                res
              );
              reject(
                'Ha ocurrido un error consultando la información. Intente más tarde.'
              );
            }
          },
          (error: any) => {
            console.log(
              '🚀 ~ file: dashboard.page.ts ~ promise getInfoActualDay ~ error',
              error
            );
            reject(
              'Ha ocurrido un error consultando la información. Intente más tarde.'
            );
          }
        );
    });
    return promise;
  }

  async getInfoWeatherDays() {
    let promise = new Promise((resolve, reject) => {
      this.apiService
        .get(
          `/forecast?q=${this.nameCity}&units=${this.units}&lang=${this.lang}&appid=${environment.WEATHER_API_KEY}`
        )
        .subscribe(
          async (res: any) => {
            if (res.cod === '200') {
              let obj = [];

              for (let i = 0; i < res.list.length; i++) {
                if (i === 0 || i % 8 === 0) {
                  let img = `https://openweathermap.org/img/wn/${res.list[i].weather[0].icon}@2x.png`;
                  let min = Math.round(res.list[i].main.temp_min);
                  let max = Math.round(res.list[i].main.temp_max);
                  let fecha = moment(res.list[i].dt_txt).format('DD MMM');
                  obj.push({ ...res.list[i], img, min, max, fecha });
                }
              }

              this.weatherDays = obj;
              console.log(
                '🚀 ~ file: dashboard.page.ts DashboardPage ~ obj',
                obj
              );

              resolve(this.weatherDays);
            } else {
              console.log(
                '🚀 ~ file: dashboard.page.ts ~ getInfoWeatherDays - error',
                res
              );
              reject(
                'Ha ocurrido un error consultando la información. Intente más tarde.'
              );
            }
          },
          (error: any) => {
            console.log(
              '🚀 ~ file: dashboard.page.ts ~ promise getInfoWeatherDays ~ error',
              error
            );
            reject(
              'Ha ocurrido un error consultando la información. Intente más tarde.'
            );
          }
        );
    });
    return promise;
  }

  async checkDates() {
    let currentTime = moment().unix();
    if (currentTime >= this.sunrise && currentTime <= this.sunset) {
      this.day = true;
    } else {
      this.day = false;
    }
  }

  showError(error: any) {
    this.toast.displayToast(
      typeof error === 'object' ? 'Error general' : error,
      'error-toast'
    );
  }

  changeUnit(eventData: any) {
    console.log(eventData.value);
  }
}
