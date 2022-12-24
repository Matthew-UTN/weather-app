import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Weather } from 'src/app/model/weather';
import { WeatherService } from '../../service/weather.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() cityWeather:Weather;
  @Input() favorite:boolean = false;
  
  @Output() add = new EventEmitter<Weather>();
  @Output() remove = new EventEmitter<Weather>();

  constructor(private weather: WeatherService) { }

  ngOnInit(): void {
    console.log(this.cityWeather);
  }

  addToFavorites(city:Weather){
    this.weather.addToFavorites(city.id);
    this.add.emit(city);
  }

  removeFromFavorites(city:Weather){
    this.weather.removeFromFavorites(city.id);
    this.remove.emit(city);
  }

}
