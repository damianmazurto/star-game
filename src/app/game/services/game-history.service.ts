import { BehaviorSubject } from 'rxjs';
import { Battle } from './../models/battle.model';
import { Injectable } from "@angular/core";

@Injectable()
export class GameHistoryService {

  history: BehaviorSubject<Battle.History> = new BehaviorSubject<Battle.History>([]);

  constructor() {}

  addHistory(history: Battle.State) {
    this.history.next([...this.history.value, history]);
  }

  clearHistory() {
    this.history.next([]);
  }

  downloadHistory() {
    const data = JSON.stringify(this.history.value);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-history.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
