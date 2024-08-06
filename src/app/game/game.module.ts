import { NgModule } from "@angular/core";
import { BoardContainerComponent } from "./containers/board-container/board-container.component";
import { GameCardComponent } from "./components/game-card/game-card.component";
import { provideHttpClient } from "@angular/common/http";
import { BattleService } from "./services/battle.service";
import { SwapiService } from "./services/swapi.service";
import { GameHistoryService } from "./services/game-history.service";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    BoardContainerComponent,
    GameCardComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    provideHttpClient(),
    BattleService,
    SwapiService,
    GameHistoryService,
  ],
  exports: [
    BoardContainerComponent,
    GameCardComponent
  ]
})
export class GameModule {}
