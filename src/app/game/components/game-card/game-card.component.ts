import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Battle } from "../../models/battle.model";

@Component
({
  selector: "app-game-card",
  templateUrl: "./game-card.component.html",
  styleUrls: ["./game-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameCardComponent {
  @Input() player!: Battle.Player;
}
