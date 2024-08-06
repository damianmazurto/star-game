import { GameHistoryService } from './../../services/game-history.service';
import { Observable } from 'rxjs';
import { BattleService } from './../../services/battle.service';
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Battle } from '../../models/battle.model';

@Component({
  selector: "app-board-container",
  templateUrl: "./board-container.component.html",
  styleUrls: ["./board-container.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardContainerComponent implements OnInit {

  battleState$: Observable<Battle.State>;
  isLoading$: Observable<boolean>;
  canResolveBattle$: Observable<boolean>;

  constructor(
    private battleService: BattleService,
    private gameHistoryService: GameHistoryService
  ) {
    this.battleState$ = this.battleService.battleState$;
    this.canResolveBattle$ = this.battleService.canResolveBattle$;
    this.isLoading$ = this.battleService.isLoading$;
  }

  ngOnInit() {
    this.battleState$.subscribe((state) => {
      console.log(state);
    });
  }

  doPlayerAttributes() {
    this.battleService.setupCharactersAttributes();
  }

  doVehicleAttributes() {
    this.battleService.setupVehiclesAttributes();
  }

  resolveBattle() {
    this.battleService.resolveBattle();
  }

  resetBattle() {
    this.battleService.newGame();
  }

  downloadHistory() {
    this.gameHistoryService.downloadHistory();
  }

  clearHistory() {
    this.gameHistoryService.clearHistory();
  }
}
