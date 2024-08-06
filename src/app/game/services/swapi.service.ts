import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";

const api = `https://www.swapi.tech/api`;

interface SwapiResponse {
  message: string;
  result: {
    description: string;
    properties: SwapiCharacter | SwapiVehicle;
    uid: string;
  };
}

interface SwapiCharacter {
  name: string;
  height: string;
  mass: string;
}

interface SwapiVehicle {
  name: string;
  model: string;
  crew: string;
}

@Injectable()
export class SwapiService {
  readonly CHARACTERS_COUNT = 83;
  readonly VEHICLES_COUNT = 43;

  constructor(
    private http: HttpClient
  ) {

  }

  fetchCharacterById(id: string): Observable<SwapiCharacter> {
    return this.http.get<SwapiResponse>(`${api}/people/${id}`).pipe(
      map((response) => response.result.properties as SwapiCharacter),
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error('An error occurred fetching character'));
      })
    );
  }

  fetchVehicleById(id: string): Observable<SwapiVehicle> {
    return this.http.get<SwapiResponse>(`${api}/starships/${id}`).pipe(
      map((response) => response.result.properties as SwapiVehicle),
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error('An error occurred fetching vehicle'));
      })
    );
  }
}
