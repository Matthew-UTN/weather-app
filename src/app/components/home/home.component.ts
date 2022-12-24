import { Component, OnInit } from '@angular/core';
import { groupWeather, Weather } from '../../model/weather';
import { WeatherService } from '../../service/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  cityWeather: Weather;
  groupCities: Weather[];
  loading: boolean;
  page: number = 1;

  constructor(private weatherServ: WeatherService) { }

  ngOnInit(): void {
    this.getFavorites();
  }

  showResults(event: Weather){
    this.cityWeather = event
  }

  async getFavorites(){
    this.loading = true;
    (await this.weatherServ.getFavorites()).subscribe((results: groupWeather) => {
      if(results){
        this.groupCities = results.list;
      }
      this.loading = false;
    });
  }

  pageChange(page){
    this.page = page;
    if(page == 2){
      this.getFavorites();
    }
  }

  addCity(city:Weather){
    if(this.groupCities){
      this.groupCities.push(city);
    } else {
      this.groupCities = [city];
    }
  }

  removeCity(city:Weather){
    let index = this.groupCities.findIndex(elem => elem == city);
    this.groupCities.splice(index,1);
  }
}
