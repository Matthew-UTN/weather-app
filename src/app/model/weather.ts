export class Weather {
    base: string;
    clouds: { 
        all: number 
    };
    cod: number;
    coord: { 
        lat: number; lon: number 
    };
    dt: number;
    id: number;
    main: {
      feels_like: number;
      humidity: number;
      pressure: number;
      temp: number;
      temp_max: number;
      temp_min: number;
      sea_level?: number;
      grnd_level?: number;
    };
    name: string;
    rain?: {
        '1h':number;
        '3h':number;
    };
    sys: {
      country: string;
      id: number;
      sunrise: number;
      sunset: number;
      type: number;
    };
    snow?: {
        '1h':number;
        '3h':number;
    };
    timezone: number;
    visibility: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    };
    wind: {
      deg: number;
      gust: number;
      speed: number;
    };
}

export interface groupWeather{
  cnt:number;
  list:Weather[];
}