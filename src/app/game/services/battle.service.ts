import { Injectable } from "@angular/core";
import { SwapiService } from "./swapi.service";
import { BehaviorSubject, Observable, catchError, delay, forkJoin, map, of, retry, retryWhen, take, tap } from "rxjs";
import { Battle } from "../models/battle.model";
import { GameHistoryService } from "./game-history.service";


@Injectable()
export class BattleService {

  battleState$: BehaviorSubject<Battle.State> = new BehaviorSubject<Battle.State>({players: [], winner: null});
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canResolveBattle$: Observable<boolean> = this.battleState$.pipe(
    map((state) => this.canResolveBattle(state.players))
  );

  constructor(
    private swapiService: SwapiService,
    private gameHistoryService: GameHistoryService
  ) {
    this.newGame();
  }

  get players(): Battle.Player[] {
    return this.battleState$.value.players;
  }

  setupCharactersAttributes() {
    this.setupAttributes(this.fetchRandomCharacterAttributes.bind(this));
  }

  setupVehiclesAttributes() {
    this.setupAttributes(this.fetchRandomVehicleAttributes.bind(this));
  }

  canResolveBattle(players: Battle.Player[]): boolean {
    return players.every(player => player.height && player.mass && player.vehicleCrew);
  }

  resolveBattle() {
    if (!this.canResolveBattle(this.players)) return;

    const scores = this.players.map(player =>
      ((player.height || 1) * (player.mass || 1)) + (player.vehicleCrew || 1)
    );

    const winnerIndex = scores.indexOf(Math.max(...scores));

    this.battleState$.next({
      ...this.battleState$.value,
      winner: this.players[winnerIndex]
    });

    this.gameHistoryService.addHistory({
      players: this.players,
      winner: this.players[winnerIndex]
    });
  }

  newGame() {
    this.battleState$.next({players: [
      {name: 'Player 1'},
      {name: 'Player 2'},
    ], winner: null});
  }

  private setupAttributes(fetchAttributesMethod: () => Observable<Battle.PlayerAttributes>) {
    const playersWithAttributes = this.players.map((player) =>
      this.createPlayerAttributesObservable(fetchAttributesMethod, player)
    );

    this.isLoading$.next(true);

    forkJoin(playersWithAttributes).pipe(
    ).subscribe((updatedPlayers) => {
      const mergedPlayers = this.players.map((player, index) => ({
        ...player,
        ...updatedPlayers[index]
      }));

      this.battleState$.next({
        ...this.battleState$.value,
        players: mergedPlayers
      });

      this.isLoading$.next(false);
    });
  }

  private fetchRandomCharacterAttributes(): Observable<Battle.CharacterAttributes> {
    return this.swapiService.fetchCharacterById(this.randomCharacterId()).pipe(
      map((character) => {
        return {
          characterName: character.name,
          height: parseInt(character.height.replace(',', ''), 10) || 1,
          mass: parseInt(character.mass.replace(',', ''), 10) || 1
        };
      })
    );
  }

  private fetchRandomVehicleAttributes(): Observable<Battle.VehicleAttributes> {
    return this.swapiService.fetchVehicleById(this.randomVehicleId()).pipe(
      map((vehicle) => {
        return {
          vehicleName: vehicle.name,
          vehicleCrew: parseInt(vehicle.crew, 10)
        };
      })
    );
  }

  private createPlayerAttributesObservable(fetchAttributesMethod: () => Observable<Battle.PlayerAttributes>, player: Battle.Player) {
    return new Observable<Battle.PlayerAttributes>((observer) => {
      const subscription = fetchAttributesMethod().subscribe({
        next: (attributes) => observer.next({ ...player, ...attributes }),
        error: (error) => observer.error(error),
        complete: () => observer.complete()
      });
      return () => subscription.unsubscribe();
    }).pipe(
      retry({count: 5, delay: 500}),
      catchError(error => {
        console.error(error);
        return of(player);
      })
    );
  }

  private randomCharacterId(): string {
    return `${Math.floor(Math.random() * this.swapiService.CHARACTERS_COUNT) + 1}`;
  }

  private randomVehicleId(): string {
    return `${Math.floor(Math.random() * this.swapiService.VEHICLES_COUNT) + 1}`;
  }
}
