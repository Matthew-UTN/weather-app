import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WeatherService } from '../../service/weather.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchControl = new FormControl();
  page:number = 1;

  @Output() weather = new EventEmitter<any>();
  @Output() pn = new EventEmitter<number>();
  
  constructor(private weatherService: WeatherService, private auth: AuthService) {}
  
  ngOnInit() {
  }

  onSubmit() {
    if(this.containsOnlyNumbers(this.searchControl.value)){
      this.weatherService.searchCitiesByZip(this.searchControl.value)
      .subscribe(results => {
        this.weather.emit(results);
      });
    } else {
      this.weatherService.searchCities(this.searchControl.value)
      .subscribe(results => {
        this.weather.emit(results);
      });
    }
  }

  changePage(page:number){
    this.page = page;
    this.pn.emit(this.page);
  }

  logout(){
    this.auth.logout();
  }

  containsOnlyNumbers(string: string): boolean {
    // Use a regular expression to test the string against a pattern that matches only numbers
    return /^\d+$/.test(string);
  }
}
