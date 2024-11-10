import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Checker } from "../Checker";
import { PlayableAgent } from "../Player";
import { Lang } from "../Lang";
// import { Rules } from '../rules';

@Component({
  selector: 'stat',
  templateUrl: './board-stat-component.component.html',
  styleUrls: ['./board-stat-component.component.css']
})
export class BoardStatComponentComponent implements OnInit {
  @Input() player1: PlayableAgent;
  @Input() player2: PlayableAgent;
  @Input() game: Checker;

//   @Input() rules: Rules;
  lang: Lang = new Lang();

  constructor() { }

  ngOnInit(): void {
  }

  txt(key: string) {
    return this.lang.txt(key);
  }

  getBackgroundColor(player: PlayableAgent):string {
    if (player.active) {
      return player.color
    } else {
      return "#fff";
    }
  }

  getTextColor(player: PlayableAgent):string {
    if (player.active) {
      return "#fff";
    } else {
      return player.color;
    }
  }

  redo() {
    this.game.redo();
  }

  giveup() {
    this.game.giveup();
  }
}
