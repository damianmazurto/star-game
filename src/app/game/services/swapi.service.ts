import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { Swapi } from "../models/swapi.model";

const api = `https://www.swapi.tech/api`;

@Injectable()
export class SwapiService {
  readonly CHARACTERS_COUNT = 83;
  readonly VEHICLES_COUNT = 43;

  constructor(
    private http: HttpClient
  ) {

  }

  fetchCharacterById(id: string): Observable<Swapi.Character> {
    return this.http.get<Swapi.Response>(`${api}/people/${id}`).pipe(
      map((response) => response.result.properties as Swapi.Character),
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error('An error occurred fetching character'));
      })
    );
  }

  fetchVehicleById(id: string): Observable<Swapi.Starship> {
    return this.http.get<Swapi.Response>(`${api}/starships/${id}`).pipe(
      map((response) => response.result.properties as Swapi.Starship),
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error('An error occurred fetching vehicle'));
      })
    );
  }
}
