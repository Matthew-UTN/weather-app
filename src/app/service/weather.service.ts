import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import firebase from "firebase";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '../model/users';
import { groupWeather, Weather } from '../model/weather';
import { interval, Observable, of, from } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AngularFireMessaging } from '@angular/fire/messaging';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

    // URL of the weather API
    private apiUrl = 'https://api.openweathermap.org/data/2.5';

    // API key for the weather API
    private apiKey = '5615d668aa47baac1ec071a781ae0c9a';
  
    // Interval (in minutes) at which to check for updates
    private checkInterval = 15;

  constructor(
    private http: HttpClient, 
    private afs: AngularFirestore,
    private auth: AuthService,
    private messaging: AngularFireMessaging
    ) {
    interval(this.checkInterval * 60000).pipe(
      take(1)
    ).subscribe(async () => {
      let cities = [];
      (await this.getFavorites()).subscribe((results: groupWeather) => {
        if(results){
          cities = results.list;
          for (const city of cities) {
            this.checkWeather(city).subscribe((weather) => {
              if (this.temperatureChanged(city, weather) || this.conditionsChanged(city, weather)) {
                this.sendNotification(city, weather);
              }
            });
          }
        }
      });
    });
  }
  searchCities(query: string) {
    const url = `${this.apiUrl}/weather?q=${query}&units=imperial&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  searchCitiesByZip(query: string) {
    const url = `${this.apiUrl}/weather?zip=${query}&units=imperial&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  searchCitiesById(IDs: string){
    const url = `${this.apiUrl}/group?id=${IDs}&units=imperial&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  async getFavorites(): Promise<Observable<any>> {
    let udata = await this.auth.getCurrentUserDoc();
    let user = udata.data() as User;
    let IDstring = '';
    if(user.favorites){
      for (let favorite of user.favorites) {
        IDstring += favorite + ',';
      }
      if (IDstring !== '') {
        return this.searchCitiesById(IDstring.slice(0, -1));
      } else {
        return of(null);
      }
    } else {
      return of(null);
    }

  }

  checkWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${city}&appid=${this.apiKey}`).pipe(
      map((response: any) => response.weather)
    );
  }

  async addToFavorites(ID){
    let udata = await this.auth.getCurrentUserDoc();
    let user = udata.data() as User;
    const userCollectionRef: AngularFirestoreCollection<any> = this.afs.collection('users');
    userCollectionRef.doc(user.id).update({
      favorites: firebase.firestore.FieldValue.arrayUnion(ID)
    });
  }

  async removeFromFavorites(ID){
    let udata = await this.auth.getCurrentUserDoc();
    let user = udata.data() as User;
    const userCollectionRef: AngularFirestoreCollection<any> = this.afs.collection('users');
    userCollectionRef.doc(user.id).update({
      favorites: firebase.firestore.FieldValue.arrayRemove(ID)
    });
  }

  private temperatureChanged(city: string, weather: any): boolean {
    const prevTemp = this.getPreviousTemperature(city);
    const currentTemp = weather.main.temp;
    if (prevTemp !== currentTemp) {
      this.setPreviousTemperature(city, currentTemp);
      return true;
    }
    return false;
  }

  private async getPreviousTemperature(city: string): Promise<number> {
    const temperatureDoc = await this.afs.doc(`temperatures/${city}`).get().toPromise();
    let data = <number>temperatureDoc.data();
    return data;
  }

  private setPreviousTemperature(city: string, temp: number): void {
    this.afs.doc(`temperatures/${city}`).set({ temp });
  }

  private conditionsChanged(city: string, weather: any): boolean {
    const prevConditions = this.getPreviousTemperature(city);
    const currentConditions = weather.weather[0].main;
  
    if (prevConditions !== currentConditions) {
      this.setPreviousTemperature(city, currentConditions);
      return true;
    }
    return false;
  }

  async sendNotification(title: string, body: string): Promise<void> {
    //TODO
 /*    await this.messaging.requestPermission();
    const token = await this.messaging.getToken();
    await this.messaging.send({
      notification: {
        title,
        body
      },
      token
    }); */
  }
}